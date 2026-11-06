const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const app = () => $('#app');

const SUBJ = { Math: 'MATH', Science: 'SCI', English: 'ENG', 'Social studies': 'SOC', 'Computer science': 'CS', Languages: 'LANG', Arts: 'ART' };
const tileOf = c => SUBJ[c.subject] || String(c.subject || 'GEN').slice(0, 3).toUpperCase();
const courseById = id => COURSES.find(c => c.id === id);
const allLessons = c => c.units.flatMap((u, ui) => u.lessons.map(l => ({ ...l, unit: ui })));
const lkey = (c, l) => `${c.id}/${l.id}`;
const uniqueId = () => Math.random().toString(36).slice(2, 9);

const MASTERY = [
  { min: 1, label: 'Mastered', cls: 'm3' },
  { min: 0.8, label: 'Proficient', cls: 'm2' },
  { min: 0.5, label: 'Familiar', cls: 'm1' },
  { min: 0, label: 'Attempted', cls: 'm0' },
];
const masteryOf = best => best == null ? null : MASTERY.find(m => best >= m.min);
const badge = best => { const m = masteryOf(best); return m ? `<span class="badge ${m.cls}">${m.label}</span>` : '<span class="badge m-none">Not started</span>'; };

function courseStats(c) {
  const ls = allLessons(c), S = Store.get();
  const done = ls.filter(l => S.prog[lkey(c, l)]?.done).length;
  const scores = ls.map(l => S.prog[lkey(c, l)]?.best ?? 0);
  return { total: ls.length, done, pct: ls.length ? Math.round(done / ls.length * 100) : 0, mastery: scores.reduce((a, b) => a + b, 0) / (ls.length || 1) };
}

/* ---------- quiz engine ---------- */

function resolveQ(q) {
  if (q.type !== 'gen') return q;
  const g = q.gen();
  return { type: 'text', hint: '', ...g };
}
const norm = s => String(s).trim().toLowerCase().replace(/\s+/g, '').replace(/[.,]$/, '');
function isCorrect(q, val) {
  if (q.type === 'mc') return Number(val) === q.answer;
  const v = norm(val);
  return q.accept.some(a => {
    const n = norm(a);
    if (n === v) return true;
    const x = parseFloat(v.replace(/^[a-z]=/, '')), y = parseFloat(n.replace(/^[a-z]=/, ''));
    return !isNaN(x) && !isNaN(y) && /^[a-z]?=?-?[\d./]+$/.test(v) && x === y;
  });
}
const sample = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const lessonQuestions = (c, l) => l.quiz;

function mountQuiz(el, questions, onDone) {
  const qs = questions.map(resolveQ);
  const st = qs.map(() => ({ tries: 0, ok: false, hints: 0, credit: 0 }));
  let combo = 0;
  const draw = (q, i) => `
    <div class="qcard" data-i="${i}">
      <div class="qnum">Question ${i + 1}</div>
      <div class="qtext">${esc(q.q)}</div>
      ${q.type === 'mc'
        ? `<div class="opts">${q.options.map((o, k) => `<label class="opt" data-k="${k}"><input type="radio" name="q${i}" value="${k}"><span>${esc(o)}</span></label>`).join('')}</div>`
        : `<input class="ans" type="text" autocomplete="off" placeholder="Your answer">`}
      <div class="qbar"><button class="btn primary" data-act="check">Check</button><button class="btn ghost" data-act="hint">Hint</button></div>
      <div class="fb" aria-live="polite"></div>
    </div>`;
  el.innerHTML = qs.map(draw).join('') + '<div class="qresult" hidden></div>';

  const finish = () => {
    if (!st.every(s => s.ok)) return;
    const score = st.reduce((a, s) => a + s.credit, 0) / qs.length;
    const box = $('.qresult', el);
    box.hidden = false;
    box.innerHTML = `<h3>${score === 1 ? 'Full marks.' : 'Quiz complete.'} Score: ${Math.round(score * 100)}% ${badge(score)}</h3>
      <p class="muted">Full credit for correct first tries, less if you used hints or retried.</p>
      <button class="btn" data-act="again">Try again with fresh questions</button>`;
    onDone && onDone(score);
  };

  el.onclick = e => {
    const opt = e.target.closest('.opt');
    if (opt && !e.target.closest('input')) opt.querySelector('input').click();
    const b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'again') return mountQuiz(el, questions, onDone);
    const card = b.closest('.qcard'), i = +card.dataset.i, q = qs[i], s = st[i];
    const fb = $('.fb', card);
    if (b.dataset.act === 'check') {
      if (s.ok) return;
      let val;
      if (q.type === 'mc') { const r = $('input:checked', card); if (!r) { fb.className = 'fb warn'; fb.textContent = 'Pick an answer first.'; return; } val = r.value; }
      else { val = $('.ans', card).value; if (!val.trim()) { fb.className = 'fb warn'; fb.textContent = 'Type an answer first.'; return; } }
      if (isCorrect(q, val)) {
        s.ok = true;
        s.credit = s.tries === 0 ? (s.hints ? 0.5 : 1) : 0.25;
        combo = s.tries === 0 && !s.hints ? combo + 1 : 0;
        fb.className = 'fb good';
        fb.innerHTML = `<b>Correct!</b>${combo >= 2 ? ` <span class="combo">${combo} in a row</span>` : ''} ${esc(q.explain || '')}`;
        $$('input,button[data-act=check],button[data-act=hint]', card).forEach(x => x.disabled = true);
        card.classList.add('done');
        finish();
      } else {
        s.tries++;
        fb.className = 'fb bad';
        fb.textContent = s.tries >= 2 && q.type === 'mc' ? 'Not quite. Use a hint, or re-read the lesson.' : 'Not quite. Try again, or use a hint.';
        card.classList.add('shake'); setTimeout(() => card.classList.remove('shake'), 400);
      }
    } else if (b.dataset.act === 'hint' && !s.ok) {
      s.hints++;
      fb.className = 'fb info';
      if (q.type === 'mc') {
        const wrong = $$('.opt', card).filter(o => +o.dataset.k !== q.answer && !o.classList.contains('gone'));
        if (wrong.length > 1) { const w = wrong[Math.floor(Math.random() * wrong.length)]; w.classList.add('gone'); w.querySelector('input').disabled = true; fb.textContent = 'Hint: one wrong option removed.'; }
        else fb.textContent = 'Hint: ' + (q.explain || 'Re-read the lesson.');
      } else if (s.hints === 1) fb.textContent = 'Hint: ' + (q.hint || 'Re-read the worked example in the lesson.');
      else fb.textContent = `Hint: the answer starts with "${esc(String(q.accept[0]).charAt(0))}" and has ${String(q.accept[0]).length} character(s).`;
    }
  };
}

/* ---------- code runner ---------- */

function mountRunner(el, starter) {
  el.innerHTML = `<div class="runner"><div class="runner-head"><b>Try it</b><span class="muted">Edit the code and run it</span></div>
    <textarea spellcheck="false" rows="${Math.min(14, starter.split('\n').length + 2)}">${esc(starter)}</textarea>
    <div class="qbar"><button class="btn primary" data-run>Run ▶</button><button class="btn ghost" data-reset>Reset</button></div>
    <pre class="out" aria-live="polite">Output appears here.</pre></div>`;
  const ta = $('textarea', el), out = $('.out', el);
  $('[data-run]', el).onclick = () => {
    const old = $('iframe', el); if (old) old.remove();
    const f = document.createElement('iframe');
    f.sandbox = 'allow-scripts'; f.hidden = true;
    const code = JSON.stringify(ta.value).replace(/</g, '\\u003c');
    f.srcdoc = `<script>const o=[];const fmt=a=>a.map(x=>typeof x==='object'?JSON.stringify(x):String(x)).join(' ');
console.log=(...a)=>o.push(fmt(a));console.error=(...a)=>o.push('Error: '+fmt(a));
try{new Function(${code})()}catch(e){o.push('Error: '+e.message)}
parent.postMessage({everlearn:o.join('\\n')||'(no output)'},'*');<\/script>`;
    const h = ev => { if (ev.source === f.contentWindow && ev.data && 'everlearn' in ev.data) { out.textContent = ev.data.everlearn; window.removeEventListener('message', h); } };
    window.addEventListener('message', h);
    out.textContent = 'Running…';
    el.appendChild(f);
  };
  $('[data-reset]', el).onclick = () => { ta.value = starter; };
}

/* ---------- resource links ---------- */

function resourceCard(id, term) {
  const r = RESOURCES[id];
  return `<a class="rcard" href="${esc(r.search(term))}" target="_blank" rel="noopener noreferrer">
    <span class="ricon">${esc(r.mark)}</span>
    <span class="rbody"><b>${esc(r.name)}</b><small>${esc(r.best)}</small></span>
    <span class="rgo">↗</span></a>`;
}

/* ---------- views ---------- */

const header = () => {
  const S = Store.get(), L = Game.level(S.points), pct = Math.round(Game.todayXp() / Game.goal * 100);
  return `<a class="stats" href="#/progress" title="Level ${L.level} ${L.title}: ${L.into}/${L.need} XP. Daily goal ${Game.todayXp()}/${Game.goal} XP"><span class="lv">Level ${L.level}</span><span class="xpbar"><i style="width:${L.pct}%"></i></span><span class="sk">${Store.streak()}d</span><span class="ring sm" style="--p:${Math.min(100, pct)}"></span></a>`;
};

function courseCard(c) {
  const st = courseStats(c);
  return `<a class="ccard" href="#/course/${c.id}" style="--c:${c.color}">
    <div class="tile">${tileOf(c)}</div>
    <div class="cinfo"><span class="ctag">${esc(c.band || '')} · ${esc(c.subject)}${c.ai ? ' · AI-written' : ''}${c.tier && c.tier !== 'Standard' ? `<span class="tag-tier ${c.tier.toLowerCase()}">${c.tier}</span>` : ''}</span><h3>${esc(c.title)}</h3><p>${esc(c.blurb)}</p></div>
    <div class="cbar"><i style="width:${st.pct}%"></i></div>
    <small class="muted">${st.done}/${st.total} lessons</small></a>`;
}

function viewHome() {
  const S = Store.get();
  const recent = COURSES.filter(c => courseStats(c).done > 0).slice(0, 3);
  const subjects = [...new Set(COURSES.map(c => c.subject))];
  const chips = ['Algebra', 'Photosynthesis', 'World War II', 'Python', 'Calculus', 'Spanish', 'Psychology', 'Fractions'];
  return {
    html: `
    <section class="hero">
      <h1>Learn anything, <span class="grad">free</span>, from K to college.</h1>
      <p>Type any subject. We build you a learning path from Khan Academy, MIT OpenCourseWare, OpenStax and more, plus full built-in courses with practice, hints and mastery tracking.</p>
      <form class="searchbox" id="hs"><input id="hq" type="search" placeholder="What do you want to learn?" autocomplete="off" aria-label="Subject to learn"><button class="btn primary big">Start learning</button></form>
      <div class="chips">${chips.map(c => `<a class="chip" href="#/search/${encodeURIComponent(c)}">${c}</a>`).join('')}</div>
    </section>
    ${recent.length ? `<section><h2>Continue learning</h2><div class="grid">${recent.map(courseCard).join('')}</div></section>` : ''}
    ${S.custom.length ? `<section><h2>My courses</h2><div class="grid">${S.custom.map(m => `<a class="ccard" href="#/my/${m.id}" style="--c:#8b5cf6"><div class="tile">MY</div><div class="cinfo"><span class="ctag">My course</span><h3>${esc(m.title)}</h3><p>${m.notes ? 'Notes saved' : 'No notes yet'} · ${m.cards.length} cards</p></div></a>`).join('')}</div></section>` : ''}
    <section><div class="sec-head"><h2>Built-in courses</h2><a href="#/courses">Browse all ${COURSES.length} →</a></div>
      <div class="grid">${COURSES.slice(0, 6).map(courseCard).join('')}</div></section>
    <section><h2>Powered by free resources</h2><div class="rgrid">${Object.keys(RESOURCES).map(id => `<a class="rcard" href="${esc(RESOURCES[id].home)}" target="_blank" rel="noopener noreferrer"><span class="ricon">${esc(RESOURCES[id].mark)}</span><span class="rbody"><b>${esc(RESOURCES[id].name)}</b><small>${esc(RESOURCES[id].best)}</small></span><span class="rgo">↗</span></a>`).join('')}</div></section>`,
    after() { $('#hs').onsubmit = e => { e.preventDefault(); const v = $('#hq').value.trim(); if (v) location.hash = '#/search/' + encodeURIComponent(v); }; },
  };
}

function viewCourses() {
  const bands = BANDS, subjects = [...new Set(COURSES.map(c => c.subject))].sort();
  return {
    html: `<h1>All courses</h1><p class="muted">Kindergarten through college. Filter by level or subject.</p>
      <div class="filters"><div class="chips" id="fb"><button class="chip on" data-b="">All levels</button>${bands.map(b => `<button class="chip" data-b="${b}">${b}</button>`).join('')}</div>
      <div class="chips" id="ft"><button class="chip on" data-t="">All tiers</button><button class="chip" data-t="Standard">Standard</button><button class="chip" data-t="Honors">Honors</button><button class="chip" data-t="AP">AP</button></div>
      <div class="chips" id="fs"><button class="chip on" data-s="">All subjects</button>${subjects.map(s => `<button class="chip" data-s="${esc(s)}">${esc(s)}</button>`).join('')}</div></div>
      <div class="grid" id="cg"></div>`,
    after() {
      let b = '', s = '', t = '';
      const draw = () => {
        const list = COURSES.filter(c => (!b || c.band === b) && (!s || c.subject === s) && (!t || (c.tier || 'Standard') === t));
        $('#cg').innerHTML = list.length ? list.map(courseCard).join('') : '<p class="muted">No courses here yet. Try the search box for a generated learning path.</p>';
      };
      $('#fb').onclick = e => { const x = e.target.closest('[data-b]'); if (!x) return; b = x.dataset.b; $$('#fb .chip').forEach(c => c.classList.toggle('on', c === x)); draw(); };
      $('#ft').onclick = e => { const x = e.target.closest('[data-t]'); if (!x) return; t = x.dataset.t; $$('#ft .chip').forEach(c => c.classList.toggle('on', c === x)); draw(); };
      $('#fs').onclick = e => { const x = e.target.closest('[data-s]'); if (!x) return; s = x.dataset.s; $$('#fs .chip').forEach(c => c.classList.toggle('on', c === x)); draw(); };
      draw();
    },
  };
}

function matchCourses(term) {
  const words = term.toLowerCase().split(/\W+/).filter(w => w.length > 1);
  return COURSES.map(c => {
    const hay = [c.title, c.subject, ...(c.tags || []), ...allLessons(c).map(l => l.title)].join(' ').toLowerCase();
    const score = words.reduce((a, w) => a + (hay.includes(w) ? 1 : 0), 0);
    return { c, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score).map(x => x.c);
}

function viewSearch(term) {
  const matches = matchCourses(term);
  const saved = Store.get().custom.find(m => m.title.toLowerCase() === term.toLowerCase());
  return {
    html: `
    <h1>Learning path: <span class="grad">${esc(term)}</span></h1>
    <div class="row-actions">${saved ? `<a class="btn" href="#/my/${saved.id}">Open my course</a>` : `<button class="btn" id="saveCourse">+ Save as my course</button>`}<a class="btn primary" href="#/create/${encodeURIComponent(term)}"> Generate a full AI course</a></div>
    ${matches.length ? `<section><h2>Built-in courses</h2><div class="grid">${matches.slice(0, 6).map(courseCard).join('')}</div></section>` : `<p class="muted">No built-in course for this yet, but here is a complete path built from free resources, plus live results below.</p>`}
    <section><h2>Your path, step by step</h2><ol class="path">${PATH_STAGES.map((s, i) => `
      <li><div class="pnum">${i + 1}</div><div class="pbody"><h3>${esc(s.title)}</h3><p class="muted">${esc(s.blurb)}</p>
      <div class="rgrid">${s.res.map(id => resourceCard(id, term)).join('')}</div></div></li>`).join('')}</ol></section>
    <section><h2>Live from open sources</h2><div id="live" class="live"><p class="muted">Loading…</p></div></section>`,
    after() {
      const sc = $('#saveCourse');
      if (sc) sc.onclick = () => {
        const S = Store.get(), m = { id: uniqueId(), title: term, notes: '', links: [], cards: [] };
        S.custom.push(m); Store.save(); location.hash = '#/my/' + m.id;
      };
      loadLive(term);
    },
  };
}

async function jget(url) {
  const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 8000);
  try { const r = await fetch(url, { signal: ctl.signal }); if (!r.ok) throw new Error(r.status); return await r.json(); }
  finally { clearTimeout(t); }
}

function loadLive(term) {
  const box = $('#live'); if (!box) return;
  const t = encodeURIComponent(term);
  box.innerHTML = '<div class="panel" data-s="wiki"></div><div class="panel" data-s="gut"></div><div class="panel" data-s="ol"></div>';
  const slot = (name, html) => { const el = $(`[data-s=${name}]`, box); if (!el) return; if (html) el.innerHTML = html; else el.remove(); };
  const link = (u, txt) => `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(txt)}</a>`;
  const loading = n => slot(n, '<p class="muted">Loading…</p>');
  ['wiki', 'gut', 'ol'].forEach(loading);

  (async () => {
    const s = await jget(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${t}&limit=6&format=json&origin=*`);
    const titles = s[1] || [];
    if (!titles.length) return slot('wiki');
    const sum = await jget(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titles[0].replace(/ /g, '_'))}`);
    const rel = titles.slice(1), urls = s[3].slice(1);
    slot('wiki', `<h3>Overview: ${esc(sum.title)}</h3>
      <div class="wiki">${sum.thumbnail ? `<img src="${esc(sum.thumbnail.source)}" alt="">` : ''}<p>${esc(sum.extract)}</p></div>
      ${link(sum.content_urls?.desktop?.page || '#', 'Read the full article ↗')}
      ${rel.length ? `<h4>Related articles</h4><div class="chips">${rel.map((r, i) => `<span class="chip">${link(urls[i], r)}</span>`).join('')}</div>` : ''}`);
  })().catch(() => slot('wiki'));

  jget(`https://gutendex.com/books/?search=${t}`).then(d => {
    const r = (d.results || []).slice(0, 6);
    slot('gut', r.length ? `<h3>Free books on Project Gutenberg</h3><ul class="list">${r.map(b => `<li>${link('https://www.gutenberg.org/ebooks/' + b.id, b.title)}<small>${esc((b.authors[0] || {}).name || '')}</small></li>`).join('')}</ul>` : '');
  }).catch(() => slot('gut'));

  jget(`https://openlibrary.org/search.json?q=${t}&limit=6&fields=title,author_name,key,first_publish_year`).then(d => {
    const r = (d.docs || []).slice(0, 6);
    slot('ol', r.length ? `<h3>Open Library</h3><ul class="list">${r.map(b => `<li>${link('https://openlibrary.org' + b.key, b.title)}<small>${esc((b.author_name || [])[0] || '')} ${b.first_publish_year ? '· ' + b.first_publish_year : ''}</small></li>`).join('')}</ul>` : '');
  }).catch(() => slot('ol'));
}

function lessonRow(c, l, ui) {
  const p = Store.get().prog[lkey(c, l)];
  return `<a class="lrow" href="#/lesson/${c.id}/${l.id}"><span class="lstat ${p?.done ? 'on' : ''}"></span><span class="lt">${esc(l.title)}</span><span class="muted">${l.minutes} min</span>${badge(p?.best)}</a>`;
}

function viewCourse(id) {
  const c = courseById(id); if (!c) return viewNotFound();
  const S = Store.get(), st = courseStats(c);
  return {
    html: `
    <div class="chead" style="--c:${c.color}"><div class="tile big">${tileOf(c)}</div><div>
      <span class="ctag">${esc(c.band || '')} · ${esc(c.subject)} · ${esc(c.level || '')}${c.tier && c.tier !== 'Standard' ? `<span class="tag-tier ${c.tier.toLowerCase()}">${c.tier}</span>` : ''}</span><h1>${esc(c.title)}</h1><p>${esc(c.blurb)}</p>
      ${c.ai ? '<p class="muted"><small>Drafted by an AI model. Verify important facts against the linked references.</small></p>' : ''}<div class="cbar wide"><i style="width:${st.pct}%"></i></div><small class="muted">${st.done}/${st.total} lessons complete · ${Math.round(st.mastery * 100)}% mastery</small></div></div>
    ${c.tier === 'AP' && Framework.has(c) ? Framework.html(c) : ''}
    <div class="cols"><div>
      ${c.units.map((u, ui) => {
        const t = S.tests[`${c.id}/u${ui}`];
        return `<section class="unit"><h2>Unit ${ui + 1}: ${esc(u.title)}</h2>
          ${u.lessons.map(l => lessonRow(c, l, ui)).join('')}
          <a class="lrow test" href="#/test/${c.id}/${ui}"><span class="lstat">T</span><span class="lt">Unit ${ui + 1} test</span><span class="muted">mixed review</span>${badge(t?.best)}</a></section>`;
      }).join('')}
      <section class="unit"><a class="lrow test final" href="#/test/${c.id}/final"><span class="lstat">C</span><span class="lt">Course challenge</span><span class="muted">everything</span>${badge(S.tests[`${c.id}/final`]?.best)}</a></section>
    </div>
    <aside>
      ${c.mine ? `<a class="btn small" href="#/build/${c.id}">Edit in course builder</a> <button class="btn danger small" id="delc">Delete this course</button>` : ''}
      ${c.tier === 'AP' ? Exam.panel(c) : ''}
      ${c.channels?.length ? `<div class="panel"><h3>Recommended channels</h3><ul class="list">${c.channels.map(x => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.name)} ↗</a></li>`).join('')}</ul></div>` : ''}
      <div class="panel"><h3>Go further on "${esc(c.title)}"</h3><div class="rstack">${['khan', 'openstax', 'libretexts', 'ocw', 'youtube', 'scholar'].map(id => resourceCard(id, c.title)).join('')}</div></div>
    </aside></div>`,
    after() {
      if (c.tier === 'AP' && Framework.has(c)) Framework.bind(c);
      const d = $('#delc');
      if (d) d.onclick = () => {
        if (!confirm('Delete this course from your browser?')) return;
        const S = Store.get(); S.aiCourses = S.aiCourses.filter(r => r.id !== c.id); Store.save();
        COURSES.splice(COURSES.indexOf(c), 1); location.hash = '#/studio';
      };
    },
  };
}

function viewLesson(cid, lid) {
  const c = courseById(cid); if (!c) return viewNotFound();
  const ls = allLessons(c), i = ls.findIndex(l => l.id === lid); if (i < 0) return viewNotFound();
  const l = ls[i], prev = ls[i - 1], next = ls[i + 1], key = lkey(c, l);
  const roles = {};
  (l.res || []).forEach(id => { const r = RESOURCES[id]; if (r) (roles[r.role] = roles[r.role] || []).push(id); });
  return {
    html: `
    <nav class="crumbs"><a href="#/course/${c.id}">${esc(c.title)}</a> › Unit ${l.unit + 1}: ${esc(c.units[l.unit].title)}</nav>
    <div class="cols lesson"><article>
      <h1>${esc(l.title)}</h1>
      <div class="prose">${l.body}</div>
      ${l.example ? `<div class="callout"><div class="ctitle">Worked example</div>${l.example}</div>` : ''}
      ${l.code ? '<div id="runner"></div>' : ''}
      <div id="deep"></div>
      <h2>Practice</h2><div id="quiz"></div>
      <div id="supp"></div>
      <div class="pager">${prev ? `<a class="btn" href="#/lesson/${c.id}/${prev.id}">← ${esc(prev.title)}</a>` : '<span></span>'}${next ? `<a class="btn primary" href="#/lesson/${c.id}/${next.id}">${esc(next.title)} →</a>` : `<a class="btn primary" href="#/course/${c.id}">Back to course</a>`}</div>
    </article>
    <aside>
      <div class="panel"><h3>Flashcards <small class="muted">(${l.cards.length})</small></h3>
        <ul class="list">${l.cards.map(([f]) => `<li>${esc(f)}</li>`).join('')}</ul><a class="btn small" href="#/cards/${c.id}">Review cards</a></div>
      <div class="panel"><h3>Learn more on "${esc(l.q)}"</h3>
        ${Object.keys(roles).map(r => `<h4>${ROLE_LABELS[r][0]}</h4><div class="rstack">${roles[r].map(id => resourceCard(id, l.q)).join('')}</div>`).join('')}</div>
    </aside></div>`,
    after() {
      if (l.code) mountRunner($('#runner'), l.code);
      Supp.mount(c, l);
      mountQuiz($('#quiz'), l.quiz, score => {
        const S = Store.get(), p = S.prog[key] || { best: 0, attempts: 0, done: false, pts: 0 };
        p.attempts++;
        p.best = Math.max(p.best || 0, score);
        const pts = Math.round(score * l.quiz.length * 10), gain = Math.max(0, pts - (p.pts || 0)), first = !p.done;
        if (gain) p.pts = pts;
        p.done = true;
        S.prog[key] = p; Store.touch();
        Game.award(gain + (first ? 5 : 0));
        Game.event('lesson', { score, first, course: c });
        Game.commit();
      });
    },
  };
}

function viewTest(cid, which) {
  const c = courseById(cid); if (!c) return viewNotFound();
  const final = which === 'final', ui = +which;
  const pool = final ? allLessons(c) : c.units[ui]?.lessons || [];
  if (!pool.length) return viewNotFound();
  const key = `${c.id}/${final ? 'final' : 'u' + ui}`;
  const build = () => sample(pool.flatMap(l => l.quiz), final ? 12 : 8);
  return {
    html: `<nav class="crumbs"><a href="#/course/${c.id}">${esc(c.title)}</a> › ${final ? 'Course challenge' : `Unit ${ui + 1} test`}</nav>
      <h1>${final ? ' Course challenge' : ` Unit ${ui + 1} test: ${esc(c.units[ui].title)}`}</h1>
      <p class="muted">Mixed questions drawn from ${final ? 'the whole course' : 'this unit'}. Hints and retries are allowed.</p><div id="quiz"></div>
      <div class="pager"><a class="btn" href="#/course/${c.id}">Back to course</a></div>`,
    after() {
      const qs = build();
      mountQuiz($('#quiz'), qs, score => {
        const S = Store.get(), t = S.tests[key] || { best: 0, pts: 0 };
        t.best = Math.max(t.best, score);
        const pts = Math.round(score * qs.length * 15);
        const gain = Math.max(0, pts - t.pts);
        if (gain) t.pts = pts;
        S.tests[key] = t; Store.touch();
        Game.award(gain);
        Game.event('test', { score });
        Game.commit();
      });
    },
  };
}

/* ---------- flashcards ---------- */

function allCards(courseId) {
  const out = [];
  COURSES.filter(c => !courseId || c.id === courseId).forEach(c => allLessons(c).forEach(l => l.cards.forEach(([f, b], i) => out.push({ id: `${c.id}/${l.id}/${i}`, f, b, tag: c.title }))));
  if (!courseId) Store.get().notebooks.forEach(n => n.cards.forEach((cd, i) => out.push({ id: `n/${n.id}/${i}`, f: cd.f, b: cd.b, tag: n.title })));
  if (!courseId) Store.get().custom.forEach(m => m.cards.forEach((cd, i) => out.push({ id: `m/${m.id}/${i}`, f: cd.f, b: cd.b, tag: m.title })));
  return out;
}

function viewCards(courseId) {
  const S = Store.get(), now = Date.now();
  const cards = allCards(courseId);
  const due = cards.filter(c => !S.cards[c.id] || S.cards[c.id].due <= now);
  return {
    html: `<h1>Flashcards</h1>
      <p class="muted">Spaced repetition: cards you know come back less often. ${cards.length} cards, <b>${due.length}</b> due now.</p>
      <div class="chips"><a class="chip ${courseId ? '' : 'on'}" href="#/cards">All</a>${COURSES.map(c => `<a class="chip ${courseId === c.id ? 'on' : ''}" href="#/cards/${c.id}">${esc(c.title)}</a>`).join('')}</div>
      <div id="deck"></div>`,
    after() {
      const deck = $('#deck');
      const queue = sample(due, 20);
      let shown = 0;
      const next = () => {
        const c = queue.shift();
        if (!c) { deck.innerHTML = `<div class="panel center"><h3>${shown ? 'Session complete' : 'Nothing due'}</h3><p class="muted">${shown ? `You reviewed ${shown} cards.` : 'Come back later, or study more lessons.'}</p></div>`; return; }
        deck.innerHTML = `<div class="fcard" tabindex="0"><small class="muted">${esc(c.tag)} · ${queue.length + 1} left</small><div class="ff">${esc(c.f)}</div><div class="fb2" hidden>${esc(c.b)}</div></div>
          <div class="qbar center"><button class="btn primary" data-flip>Show answer</button>
          <span class="rate" hidden><button class="btn" data-r="again">Again</button><button class="btn" data-r="good">Good</button><button class="btn" data-r="easy">Easy</button></span></div>`;
        $('[data-flip]', deck).onclick = e => { $('.fb2', deck).hidden = false; $('.rate', deck).hidden = false; e.target.hidden = true; };
        $$('[data-r]', deck).forEach(b => b.onclick = () => {
          const st = S.cards[c.id] || { iv: 0, ease: 2.5, due: 0 };
          if (b.dataset.r === 'again') { st.iv = 0; st.ease = Math.max(1.3, st.ease - 0.2); st.due = Date.now() + 6e4; queue.push(c); }
          else { st.iv = st.iv < 1 ? (b.dataset.r === 'easy' ? 3 : 1) : Math.round(st.iv * st.ease * (b.dataset.r === 'easy' ? 1.4 : 1)); if (b.dataset.r === 'easy') st.ease += 0.1; st.due = Date.now() + st.iv * 864e5; shown++; }
          S.cards[c.id] = st; Store.touch();
          if (b.dataset.r !== 'again') Game.award(2);
          Game.event('card'); Game.commit(); next();
        });
      };
      next();
    },
  };
}

/* ---------- my courses ---------- */

function viewMy(id) {
  const S = Store.get(), m = S.custom.find(x => x.id === id); if (!m) return viewNotFound();
  return {
    html: `<nav class="crumbs"><a href="#/">Home</a> › My courses</nav><h1>${esc(m.title)}</h1>
      <div class="cols"><div>
        <div class="panel"><h3>Notes</h3><textarea id="notes" rows="10" placeholder="Write what you learn here. Saved automatically.">${esc(m.notes)}</textarea></div>
        <div class="panel"><h3>Links</h3><ul class="list" id="links">${m.links.map((l, i) => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.title)} ↗</a><button class="x" data-dl="${i}" aria-label="Remove">×</button></li>`).join('') || '<li class="muted">No links yet.</li>'}</ul>
          <form id="lf" class="inline"><input name="t" placeholder="Title" required><input name="u" type="url" placeholder="https://…" required><button class="btn small">Add</button></form></div>
        <div class="panel"><h3>Flashcards (${m.cards.length})</h3><ul class="list">${m.cards.map((c, i) => `<li><span><b>${esc(c.f)}</b> — ${esc(c.b)}</span><button class="x" data-dc="${i}" aria-label="Remove">×</button></li>`).join('') || '<li class="muted">No cards yet. They join your review deck.</li>'}</ul>
          <form id="cf" class="inline"><input name="f" placeholder="Front" required><input name="b" placeholder="Back" required><button class="btn small">Add</button></form></div>
      </div><aside><div class="panel"><h3>Find resources</h3><div class="rstack">${Object.keys(RESOURCES).filter(k => RESOURCES[k].search).map(k => resourceCard(k, m.title)).join('')}</div></div>
        <button class="btn danger" id="del">Delete this course</button></aside></div>`,
    after() {
      const rerender = () => { Store.save(); render(); };
      $('#notes').oninput = e => { m.notes = e.target.value; Store.save(); };
      $('#lf').onsubmit = e => { e.preventDefault(); const f = new FormData(e.target); const url = String(f.get('u')); if (!/^https?:\/\//i.test(url)) return; m.links.push({ title: f.get('t'), url }); rerender(); };
      $('#cf').onsubmit = e => { e.preventDefault(); const f = new FormData(e.target); m.cards.push({ f: f.get('f'), b: f.get('b') }); rerender(); };
      $$('[data-dl]').forEach(b => b.onclick = () => { m.links.splice(+b.dataset.dl, 1); rerender(); });
      $$('[data-dc]').forEach(b => b.onclick = () => { m.cards.splice(+b.dataset.dc, 1); rerender(); });
      $('#del').onclick = () => { if (confirm('Delete this course and its notes?')) { S.custom = S.custom.filter(x => x !== m); Store.save(); location.hash = '#/'; } };
    },
  };
}

/* ---------- dashboard, resources, misc ---------- */

function viewDashboard() {
  const S = Store.get();
  const rows = COURSES.map(c => ({ c, st: courseStats(c) })).filter(x => x.st.done > 0 || Object.keys(S.tests).some(k => k.startsWith(x.c.id + '/')));
  return {
    html: `<h1>Your progress</h1>
      ${Game.dashboardHtml()}
      <div class="kpis"><div class="kpi"><b>${S.points}</b><span>XP</span></div><div class="kpi"><b>${Store.streak()}</b><span>day streak</span></div>
      <div class="kpi"><b>${Object.values(S.prog).filter(p => p.done).length}</b><span>lessons done</span></div><div class="kpi"><b>${Object.values(S.prog).filter(p => p.best >= 1).length}</b><span>mastered</span></div></div>
      <h2>Courses</h2>${rows.length ? rows.map(({ c, st }) => `<a class="lrow" href="#/course/${c.id}"><span class="tile sm">${tileOf(c)}</span><span class="lt">${esc(c.title)}</span><span class="muted">${st.done}/${st.total}</span>${badge(st.done ? st.mastery : null)}</a>`).join('') : '<p class="muted">Nothing yet. <a href="#/courses">Pick a course</a> to begin.</p>'}
      <h2>Your data</h2><p class="muted">Everything is stored in this browser. Export a backup or move it to another device.</p>
      <div class="row-actions"><button class="btn" id="exp">Export backup</button><label class="btn">Import backup<input type="file" id="imp" accept="application/json" hidden></label><button class="btn danger" id="rst">Reset all progress</button></div>`,
    after() {
      $('#exp').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([Store.export()], { type: 'application/json' })); a.download = 'everlearn-backup.json'; a.click(); };
      $('#imp').onchange = async e => { try { Store.replace(JSON.parse(await e.target.files[0].text())); render(); } catch (x) { alert('That file could not be read.'); } };
      $('#rst').onclick = () => { if (confirm('Erase all progress on this device?')) { Store.reset(); render(); } };
    },
  };
}

function viewResources() {
  return {
    html: `<h1>Free resources</h1><p class="muted">Everything Everlearn links to is free to use.</p>
      <div class="rlist">${Object.entries(RESOURCES).map(([id, r]) => `<a class="rrow" href="${esc(r.home)}" target="_blank" rel="noopener noreferrer"><span class="ricon">${esc(r.mark)}</span>
        <div><b>${esc(r.name)}</b> <span class="muted">· ${esc(r.type)}</span><p>${esc(r.desc)}</p>
        <small><b>Best for:</b> ${esc(r.best)} · <b>Pros:</b> ${esc(r.pros)} · <b>Cons:</b> ${esc(r.cons)} · <b>Cost:</b> ${esc(r.price)}</small></div></a>`).join('')}</div>`,
  };
}

function viewNotFound() { return { html: '<h1>Not found</h1><p><a href="#/">Go home</a></p>' }; }

/* ---------- router ---------- */

function render() {
  const parts = (location.hash.replace(/^#\/?/, '') || '').split('/').map(decodeURIComponent);
  const [r, a, b] = parts;
  let v;
  if (!r) v = viewHome();
  else if (r === 'search') v = viewSearch(parts.slice(1).join('/'));
  else if (r === 'courses') v = viewCourses();
  else if (r === 'course') v = viewCourse(a);
  else if (r === 'lesson') v = viewLesson(a, b);
  else if (r === 'test') v = viewTest(a, b);
  else if (r === 'cards') v = viewCards(a);
  else if (r === 'my') v = viewMy(a);
  else if (r === 'exam') v = Exam.viewExam(a);
  else if (r === 'build') v = a ? Builder.viewEditor(a) : Builder.viewHome();
  else if (r === 'rated') v = a ? Rated.viewSprint(a) : Rated.viewHome();
  else if (r === 'studio') v = a ? viewNotebook(a) : viewStudio();
  else if (r === 'create') v = viewCreate(a);
  else if (r === 'progress') v = viewDashboard();
  else if (r === 'resources') v = viewResources();
  else v = viewNotFound();
  app().innerHTML = v.html;
  $('.stats').outerHTML = header();
  $$('.nav a').forEach(x => x.classList.toggle('on', x.getAttribute('href') === '#/' + (r || '')));
  window.scrollTo(0, 0);
  v.after && v.after();
  document.title = 'Everlearn · learn anything, free';
}

/* ---------- chrome ---------- */

function applyTheme() {
  const t = Store.get().theme;
  if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme;
}

function showAccount() {
  const st = Sync.status;
  const m = document.createElement('div');
  m.className = 'modal';
  m.innerHTML = `<div class="dialog"><button class="x close" aria-label="Close">×</button><h2>Account</h2>
    ${!st.enabled ? `<p>Everlearn works without an account. Your progress is saved in this browser. You can export a backup from <a href="#/progress">Progress</a> any time.</p>
        <p class="muted">Cloud sync is optional and currently off. To turn it on, add a free Firebase config in <code>js/config.js</code> (see the README).</p>`
      : st.user ? `<p>Signed in as <b>${esc(st.user.name || st.user.email)}</b>. Progress syncs automatically.</p><button class="btn" id="so">Sign out</button>`
      : `<p>Sign in to sync progress across devices. It is free and optional.</p><button class="btn primary" id="si">Sign in with Google</button>`}
  </div>`;
  document.body.appendChild(m);
  m.onclick = e => { if (e.target === m || e.target.closest('.close') || e.target.closest('a')) m.remove(); };
  const si = $('#si', m), so = $('#so', m);
  if (si) si.onclick = () => Sync.signIn().then(() => m.remove()).catch(() => alert('Sign-in failed.'));
  if (so) so.onclick = () => Sync.signOut().then(() => m.remove());
}

function loadGenerated() {
  (window.GENERATED_COURSES || []).forEach((r, i) => {
    const c = Normalize.normalizeCourse(r, COURSES.length + i);
    const dup = c && COURSES.some(x => !x.ai && !x.mine && x.title.toLowerCase().replace(/^ap /, '') === c.title.toLowerCase().replace(/^ap /, ''));
    if (c && !dup && !courseById(c.id)) COURSES.push(c);
  });
  Store.get().aiCourses.forEach(r => registerMine(r));
  COURSES.sort((a, b) => BANDS.indexOf(a.band) - BANDS.indexOf(b.band) || a.subject.localeCompare(b.subject) || a.title.localeCompare(b.title));
}

document.addEventListener('DOMContentLoaded', () => {
  loadGenerated();
  applyTheme();
  $('#theme').onclick = () => {
    const S = Store.get(), dark = document.documentElement.dataset.theme === 'dark' || (!S.theme && matchMedia('(prefers-color-scheme: dark)').matches);
    S.theme = dark ? 'light' : 'dark'; Store.save(); applyTheme();
  };
  $('#acct').onclick = showAccount;
  $('#hsearch').onsubmit = e => { e.preventDefault(); const v = $('#hsq').value.trim(); if (v) { location.hash = '#/search/' + encodeURIComponent(v); $('#hsq').value = ''; } };
  $('#menu').onclick = () => $('.nav').classList.toggle('open');
  $('.nav').onclick = () => $('.nav').classList.remove('open');
  window.addEventListener('hashchange', render);
  AI.finishLogin().then(() => render()).catch(e => alert(e.message));
  render();
  Sync.init(() => render()).catch(() => {});
});
