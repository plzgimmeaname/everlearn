#!/usr/bin/env node
// writes in-depth "deep dive" sections for lessons with free openrouter models, then rebuilds js/deep.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { SYSTEM, deepenPrompt } = require('../js/prompts.js');

const ROOT = path.join(__dirname, '..');
const STORE = path.join(ROOT, 'generated', 'deep.json');
const OUT = path.join(ROOT, 'js', 'deep.js');
const API = 'https://openrouter.ai/api/v1';
const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf('--' + n); return i < 0 ? d : (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const log = (...a) => console.log(...a);

function loadKey() {
  if (process.env.OPENROUTER_API_KEY) return process.env.OPENROUTER_API_KEY.trim();
  for (const f of [path.join(__dirname, '.env'), path.join(ROOT, '.env')]) {
    if (fs.existsSync(f)) { const m = fs.readFileSync(f, 'utf8').match(/^OPENROUTER_API_KEY\s*=\s*(.+)$/m); if (m) return m[1].trim().replace(/^["']|["']$/g, ''); }
  }
  return '';
}

async function freeModels() {
  const { data } = await (await fetch(API + '/models')).json();
  const bad = /safety|guard|code|embed|lyria|image|audio|whisper|vl\b|omni/i;
  const size = id => { const m = id.match(/(\d+(?:\.\d+)?)b/i); return m ? parseFloat(m[1]) : 0; };
  return data.filter(m => m.pricing && +m.pricing.prompt === 0 && +m.pricing.completion === 0 && m.id.endsWith(':free'))
    .filter(m => /->text$/.test((m.architecture || {}).modality || 'text->text') && !bad.test(m.id) && (m.context_length || 0) >= 16000 && (size(m.id) === 0 || size(m.id) >= 20))
    .sort((a, b) => size(b.id) - size(a.id) || b.context_length - a.context_length).map(m => m.id);
}

function extractJson(text) {
  const t = String(text || '').replace(/<think>[\s\S]*?<\/think>/g, '').replace(/```(?:json)?/gi, '');
  const a = t.indexOf('{'), b = t.lastIndexOf('}');
  if (a < 0 || b <= a) throw new Error('no json in reply');
  return JSON.parse(t.slice(a, b + 1));
}

let rr = 0;
async function ask(key, models, user, tries = 6) {
  let last; const start = rr++;
  for (let i = 0; i < tries; i++) {
    const model = models[(start + i) % models.length];
    try {
      const r = await fetch(API + '/chat/completions', { method: 'POST', headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json', 'X-Title': 'Everlearn deepen' },
        body: JSON.stringify({ model, temperature: 0.4, max_tokens: 10000, messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: user }] }) });
      if (r.status === 401) throw Object.assign(new Error('invalid api key'), { fatal: true });
      if (r.status === 402) throw Object.assign(new Error('account needs credits for this request'), { fatal: true });
      if (r.status === 429) { const body = await r.text(); if (/per-day|daily/i.test(body)) throw Object.assign(new Error('daily free-model limit reached'), { fatal: true }); last = new Error('rate limited'); await sleep(4000 * (i + 1)); continue; }
      if (r.status >= 500) { last = new Error('http ' + r.status); await sleep(3000); continue; }
      const j = await r.json();
      if (j.error) { last = new Error(j.error.message || 'error'); await sleep(2000); continue; }
      const d = extractJson(j.choices[0].message.content);
      if (!Array.isArray(d.sections) || d.sections.length < 3) throw new Error('too few sections');
      return { json: d, model };
    } catch (e) { if (e.fatal) throw e; last = e; await sleep(1500); }
  }
  throw last || new Error('failed');
}

function loadCourses() {
  const ctx = { window: {}, console }; ctx.globalThis = ctx; vm.createContext(ctx);
  const files = ['js/resources.js', 'js/authoring.js', ...fs.readdirSync(path.join(ROOT, 'js', 'courses')).sort().map(f => 'js/courses/' + f)];
  for (const f of files) { try { vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/^const /gm, 'var '), ctx, { filename: f }); } catch (e) { /* skip files that need browser globals */ } }
  return ctx.window.COURSES || [];
}

function hand() {
  const ctx = { window: {} }; vm.createContext(ctx);
  try { vm.runInContext(fs.readFileSync(path.join(ROOT, 'js', 'deep-hand.js'), 'utf8'), ctx); } catch (e) { /* none */ }
  return ctx.window.DEEP || {};
}

function build(store) { fs.writeFileSync(OUT, `window.DEEP = Object.assign(window.DEEP || {}, ${JSON.stringify(store)});\n`); log(`wrote js/deep.js with ${Object.keys(store).length} deep dive(s)`); }

(async () => {
  const store = fs.existsSync(STORE) ? JSON.parse(fs.readFileSync(STORE, 'utf8')) : {};
  if (flag('build')) return build(store);
  const key = loadKey();
  if (!key) { console.error('no api key: put OPENROUTER_API_KEY=... in tools/.env'); process.exit(1); }
  const handKeys = new Set(Object.keys(hand()));
  let courses = loadCourses();
  if (flag('tier') && flag('tier') !== true) courses = courses.filter(c => (c.tier || 'Standard').toLowerCase() === String(flag('tier')).toLowerCase());
  if (flag('course') && flag('course') !== true) courses = courses.filter(c => c.id === flag('course'));
  const jobs = [];
  courses.forEach(c => c.units.forEach(u => u.lessons.forEach(l => { const k = `${c.id}/${l.id}`; if (!store[k] && !handKeys.has(k)) jobs.push({ c, l, k }); })));
  const limit = +flag('limit', jobs.length);
  jobs.length = Math.min(jobs.length, limit);
  const models = (await freeModels()).slice(0, +flag('pool', 5));
  log(`${jobs.length} lesson(s) to deepen; models: ${models.join(', ')}`);
  let fatal = null, done = 0;
  const worker = async () => {
    while (jobs.length && !fatal) {
      const { c, l, k } = jobs.shift();
      try {
        const r = await ask(key, models, deepenPrompt(c, l));
        store[k] = r.json; fs.mkdirSync(path.dirname(STORE), { recursive: true }); fs.writeFileSync(STORE, JSON.stringify(store));
        const w = r.json.sections.flatMap(s => s.paragraphs || []).join(' ').split(/\s+/).length;
        log(` ok ${k} (${w} words, ${r.model})`); done++;
      } catch (e) { if (e.fatal) fatal = e; else log(` skip ${k}: ${e.message}`); }
    }
  };
  await Promise.all(Array.from({ length: +flag('concurrency', 3) }, worker));
  if (fatal) log('stopped:', fatal.message);
  build(store);
  log(`${done} deep dive(s) written`);
})();
