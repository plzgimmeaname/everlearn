#!/usr/bin/env node
// generates course json with free openrouter models, then rebuilds js/generated.js
const fs = require('fs');
const path = require('path');
const { normalizeCourse } = require('../js/normalize.js');
const { SYSTEM, outlinePrompt, lessonPrompt } = require('../js/prompts.js');

const ROOT = path.join(__dirname, '..');
const RAW = path.join(ROOT, 'generated', 'raw');
const OUT = path.join(ROOT, 'js', 'generated.js');
const API = 'https://openrouter.ai/api/v1';

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf('--' + n); return i < 0 ? d : (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const log = (...a) => console.log(...a);

function loadKey() {
  if (process.env.OPENROUTER_API_KEY) return process.env.OPENROUTER_API_KEY.trim();
  for (const f of [path.join(__dirname, '.env'), path.join(ROOT, '.env')]) {
    if (fs.existsSync(f)) {
      const m = fs.readFileSync(f, 'utf8').match(/^OPENROUTER_API_KEY\s*=\s*(.+)$/m);
      if (m) return m[1].trim().replace(/^["']|["']$/g, '');
    }
  }
  return '';
}

async function freeModels() {
  const r = await fetch(API + '/models');
  if (!r.ok) throw new Error('could not list models: ' + r.status);
  const { data } = await r.json();
  const bad = /safety|guard|code|embed|lyria|image|audio|whisper|vl\b|omni/i;
  const size = id => { const m = id.match(/(\d+(?:\.\d+)?)b/i); return m ? parseFloat(m[1]) : 0; };
  return data
    .filter(m => m.pricing && +m.pricing.prompt === 0 && +m.pricing.completion === 0 && m.id.endsWith(':free'))
    .filter(m => /->text$/.test((m.architecture || {}).modality || 'text->text') && !bad.test(m.id) && (m.context_length || 0) >= 16000 && (size(m.id) === 0 || size(m.id) >= 20))
    .sort((a, b) => size(b.id) - size(a.id) || b.context_length - a.context_length)
    .map(m => m.id);
}

function extractJson(text) {
  let t = String(text || '').replace(/<think>[\s\S]*?<\/think>/g, '').replace(/```(?:json)?/gi, '');
  const a = t.indexOf('{'), b = t.lastIndexOf('}');
  if (a < 0 || b <= a) throw new Error('no json object in reply');
  return JSON.parse(t.slice(a, b + 1));
}

let rr = 0;
async function ask(key, models, system, user, tries = 6) {
  let lastErr;
  const start = rr++;
  for (let i = 0; i < tries; i++) {
    const model = models[(start + i) % models.length];
    try {
      const r = await fetch(API + '/chat/completions', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json', 'HTTP-Referer': 'https://github.com/everlearn', 'X-Title': 'Everlearn course generator' },
        body: JSON.stringify({ model, temperature: 0.4, max_tokens: 10000, messages: [{ role: 'system', content: system }, { role: 'user', content: user }] }),
      });
      if (r.status === 401) throw Object.assign(new Error('401: invalid api key'), { fatal: true });
      if (r.status === 402) throw Object.assign(new Error('402: account needs credits for this request'), { fatal: true });
      if (r.status === 429) {
        const body = await r.text();
        if (/per-day|daily|free-models-per-day/i.test(body)) throw Object.assign(new Error('daily free-model limit reached (resets daily; adding $10 of credit raises it to 1000/day)'), { fatal: true });
      }
      if (r.status === 429 || r.status >= 500) { lastErr = new Error(`${model}: http ${r.status}`); await sleep(4000 * (i + 1)); continue; }
      const j = await r.json();
      if (j.error) { lastErr = new Error(`${model}: ${j.error.message || JSON.stringify(j.error)}`); await sleep(2500); continue; }
      return { json: extractJson(j.choices[0].message.content), model };
    } catch (e) {
      if (e.fatal) throw e;
      lastErr = e; log(`   retry (${model}): ${e.message}`); await sleep(2000);
    }
  }
  throw lastErr || new Error('generation failed');
}

async function generateCourse(key, models, c) {
  const nUnits = +flag('units', c.units || 4), nLessons = +flag('lessons', c.lessons || 3);
  c.units = nUnits;
  log(`\n=== ${c.title} [${c.tier || c.band}] ===`);
  const outlinePath = path.join(RAW, c.id + '.json');
  let raw = fs.existsSync(outlinePath) ? JSON.parse(fs.readFileSync(outlinePath, 'utf8')) : null;
  if (!raw || !raw.units) {
    const o = await ask(key, models, SYSTEM, outlinePrompt(c, nUnits, nLessons));
    raw = { id: c.id, title: c.title, subject: c.subject, band: c.band, tier: c.tier || 'Standard', level: c.level || c.tier || c.band, blurb: o.json.blurb, tags: o.json.tags,
      units: (o.json.units || []).map(u => ({ title: u.title, outline: u.lessons || [], lessons: [] })) };
    log(`outline by ${o.model}: ${raw.units.length} units`);
    save(c.id, raw);
  }
  const conc = +flag('concurrency', 3);
  const jobs = [];
  raw.units.forEach((u, ui) => (u.outline || []).map(t => (typeof t === 'string' ? t : t && t.title)).filter(Boolean).forEach(t => {
    if (!u.lessons.some(l => l.title === t)) jobs.push({ u, ui, t });
  }));
  const order = u => (u.outline || []).map(t => (typeof t === 'string' ? t : t && t.title));
  let fatal = null;
  const worker = async () => {
    while (jobs.length && !fatal) {
      const { u, ui, t } = jobs.shift();
      try {
        const r = await ask(key, models, SYSTEM, lessonPrompt(c, u.title, t));
        u.lessons.push(r.json);
        const o = order(u);
        u.lessons.sort((x, y) => o.indexOf(x.title) - o.indexOf(y.title));
        save(c.id, raw);
        const ok = normalizeCourse({ ...raw, units: [{ title: u.title, lessons: [r.json] }] });
        const words = (Array.isArray(r.json.explanation) ? r.json.explanation.join(' ') : String(r.json.explanation || '')).split(/\s+/).length;
        log(` ${ok ? '✓' : '✗ (will be dropped by validation)'} unit ${ui + 1}: ${t}  (${words} words, ${r.model})`);
      } catch (e) { if (e.fatal) { fatal = e; } else log(` ✗ unit ${ui + 1}: ${t}: ${e.message}`); }
    }
  };
  await Promise.all(Array.from({ length: conc }, worker));
  if (fatal) throw fatal;
}

function save(id, raw) { fs.mkdirSync(RAW, { recursive: true }); fs.writeFileSync(path.join(RAW, id + '.json'), JSON.stringify(raw, null, 2)); }

function build() {
  fs.mkdirSync(RAW, { recursive: true });
  const files = fs.readdirSync(RAW).filter(f => f.endsWith('.json')).sort();
  const good = [];
  files.forEach((f, i) => {
    const raw = JSON.parse(fs.readFileSync(path.join(RAW, f), 'utf8'));
    const c = normalizeCourse(raw, i);
    if (c) { good.push(raw); log(`ok   ${f}: ${c.units.reduce((n, u) => n + u.lessons.length, 0)} lessons`); } else log(`skip ${f}: no valid lessons yet`);
  });
  fs.writeFileSync(OUT, `window.GENERATED_COURSES = ${JSON.stringify(good)};\n`);
  log(`\nwrote js/generated.js with ${good.length} course(s)`);
}

(async () => {
  if (flag('build')) return build();
  const key = loadKey();
  if (flag('list-models')) { (await freeModels()).forEach(m => log(m)); return; }
  if (!key) { console.error('no api key. put OPENROUTER_API_KEY=sk-or-... in tools/.env (free key at openrouter.ai/keys)'); process.exit(1); }

  let models = flag('model') && flag('model') !== true ? String(flag('model')).split(',') : await freeModels();
  models = models.slice(0, +flag('pool', 5));
  if (!models.length) models = ['openrouter/free'];
  log('models:', models.join(', '));

  let list = [];
  if (flag('curriculum')) {
    list = JSON.parse(fs.readFileSync(path.join(__dirname, 'curriculum.json'), 'utf8'));
    if (flag('band') && flag('band') !== true) list = list.filter(c => c.band === flag('band'));
    if (flag('tier') && flag('tier') !== true) list = list.filter(c => (c.tier || 'Standard').toLowerCase() === String(flag('tier')).toLowerCase());
    if (flag('skip')) list = list.slice(+flag('skip'));
    if (flag('subject') && flag('subject') !== true) list = list.filter(c => c.subject.toLowerCase() === String(flag('subject')).toLowerCase());
    const hand = new Set();
    for (const f of fs.readdirSync(path.join(ROOT, 'js', 'courses'))) {
      const src = fs.readFileSync(path.join(ROOT, 'js', 'courses', f), 'utf8');
      for (const m of src.matchAll(/title: '([^']+)'/g)) hand.add(m[1].toLowerCase().replace(/^ap /, ''));
      for (const m of src.matchAll(/apc\('[^']+', '([^']+)'/g)) hand.add(m[1].toLowerCase().replace(/^ap /, ''));
    }
    const before = list.length;
    list = list.filter(c => !hand.has(c.title.toLowerCase().replace(/^ap /, '')));
    if (list.length < before) log(`skipping ${before - list.length} course(s) that already have a hand-written version`);
    if (flag('limit')) list = list.slice(0, +flag('limit'));
  } else if (flag('topic') && flag('topic') !== true) {
    const title = flag('topic');
    list = [{ id: String(flag('id') || title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), title, subject: flag('subject') || 'General', band: flag('band') || '9-12', level: flag('level') || '', focus: flag('focus') || '' }];
  } else {
    console.error('usage:\n  node tools/generate.cjs --topic "Geometry" --subject Math --band 9-12 [--units 4 --lessons 3]\n  node tools/generate.cjs --curriculum [--band 6-8] [--subject Math] [--limit 3]\n  node tools/generate.cjs --list-models | --build   (--model id1,id2 to choose models, --concurrency 4, --pool 6)');
    process.exit(1);
  }
  for (const c of list) {
    try { await generateCourse(key, models, c); } catch (e) { console.error('stopped:', e.message); break; }
    build();
  }
  build();
})();
