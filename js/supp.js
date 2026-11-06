// lesson supplements: deep-dive content, open-licensed excerpts (wikipedia, wikibooks) and textbook tags
window.DEEP = window.DEEP || {};

const Supp = (() => {
  const cache = {};
  const OS = (name, slug) => ({ name, url: `https://openstax.org/details/books/${slug}` });
  const BOOKS = {
    'hand-ap-calc-ab': [OS('Calculus Volume 1', 'calculus-volume-1')], 'hand-ap-calcbc': [OS('Calculus Volume 2', 'calculus-volume-2'), OS('Calculus Volume 1', 'calculus-volume-1')],
    'hand-ap-precalc': [OS('Precalculus 2e', 'precalculus-2e')], 'hand-ap-stats': [OS('Introductory Statistics 2e', 'introductory-statistics-2e')],
    'hand-ap-bio': [OS('Biology 2e', 'biology-2e'), OS('Biology for AP Courses', 'biology-ap-courses')], 'hand-ap-chem': [OS('Chemistry 2e', 'chemistry-2e')],
    'hand-ap-physics1': [OS('College Physics for AP Courses 2e', 'college-physics-ap-courses-2e')], 'hand-ap-phys2': [OS('College Physics for AP Courses 2e', 'college-physics-ap-courses-2e')],
    'hand-ap-physc-mech': [OS('University Physics Volume 1', 'university-physics-volume-1')], 'hand-ap-physc-em': [OS('University Physics Volume 2', 'university-physics-volume-2')],
    'hand-ap-psych': [OS('Psychology 2e', 'psychology-2e')], 'hand-ap-ush': [OS('U.S. History', 'us-history')], 'hand-ap-gov': [OS('American Government 3e', 'american-government-3e')],
    'hand-ap-macro': [OS('Principles of Macroeconomics 3e', 'principles-macroeconomics-3e')], 'hand-ap-micro': [OS('Principles of Microeconomics 3e', 'principles-microeconomics-3e')],
    biology: [OS('Biology 2e', 'biology-2e')], algebra: [OS('Algebra and Trigonometry 2e', 'algebra-and-trigonometry-2e')],
  };

  const WIKI = {
    'hand-ap-physics1/kin': 'Kinematics', 'hand-ap-physics1/dyn': "Newton's laws of motion", 'hand-ap-physics1/energy': 'Conservation of energy', 'hand-ap-physics1/momentum': 'Momentum',
    'hand-ap-chem/equilibrium': 'Chemical equilibrium', 'hand-ap-chem/thermo': 'Gibbs free energy', 'hand-ap-chem/kinetics': 'Chemical kinetics', 'hand-ap-chem/acidbase': 'Buffer solution',
    'hand-ap-bio/energetics': 'Cellular respiration', 'hand-ap-bio/evolution': 'Hardy-Weinberg principle', 'hand-ap-bio/heredity': 'Mendelian inheritance',
    'hand-ap-calc-ab/ftc': 'Fundamental theorem of calculus', 'hand-ap-calc-ab/implicit': 'Implicit function', 'hand-ap-calc-ab/analysis': 'Mean value theorem',
    'hand-ap-macro/adas': 'Aggregate demand', 'hand-ap-micro/sd': 'Supply and demand', 'hand-ap-psych/learning': 'Operant conditioning', 'hand-ap-gov/foundations': 'Federalist Papers',
  };
  const j = async url => { const r = await fetch(url); if (!r.ok) throw new Error(r.status); return r.json(); };
  const wikiBase = 'https://en.wikipedia.org/w/api.php';

  async function wikipedia(term, hint = '') {
    const ck = 'w:' + term + '|' + hint;
    if (cache[ck]) return cache[ck];
    let title = null;
    try {
      const f = await j(`${wikiBase}?action=query&list=search&srsearch=${encodeURIComponent((term + ' ' + hint).trim())}&srlimit=1&format=json&origin=*`);
      title = ((f.query.search || [])[0] || {}).title;
    } catch (e) { /* fall back below */ }
    if (!title) { const s = await j(`${wikiBase}?action=opensearch&search=${encodeURIComponent(term)}&limit=1&format=json&origin=*`); title = (s[1] || [])[0]; }
    if (!title) return null;
    const q = await j(`${wikiBase}?action=query&prop=extracts&exintro=1&explaintext=1&redirects=1&titles=${encodeURIComponent(title)}&format=json&origin=*`);
    const p = Object.values(q.query.pages)[0];
    return (cache[ck] = { title: p.title, text: (p.extract || '').trim(), url: 'https://en.wikipedia.org/wiki/' + encodeURIComponent(p.title.replace(/ /g, '_')) });
  }
  async function wikibooks(term) {
    if (cache['b:' + term]) return cache['b:' + term];
    const r = await j(`https://en.wikibooks.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(term)}&srlimit=4&format=json&origin=*`);
    return (cache['b:' + term] = (r.query.search || []).map(x => ({ title: x.title, snippet: plainText(x.snippet), url: 'https://en.wikibooks.org/wiki/' + encodeURIComponent(x.title.replace(/ /g, '_')) })));
  }

  const tags = (c, l) => {
    const t = [];
    (BOOKS[c.id] || []).forEach(b => t.push(`<a class="tagrow" href="${esc(b.url)}" target="_blank" rel="noopener noreferrer"><span class="ricon">OS</span><span><b>${esc(b.name)}</b><small>Free OpenStax textbook: find the chapter on "${esc(l.title)}"</small></span></a>`));
    return t.join('');
  };

  function deepHtml(d) { return Normalize.deepHtml(d); }
  const getDeep = (c, l) => window.DEEP[`${c.id}/${l.id}`] || (Store.get().deep || {})[`${c.id}/${l.id}`];

  function mountDeep(c, l) {
    const box = $('#deep'); if (!box) return;
    const d = getDeep(c, l);
    box.innerHTML = d ? `<div class="deep"><div class="ctitle">Deep dive</div>${deepHtml(d)}</div>` : `<div class="panel deepcta"><b>Want a deeper treatment?</b><p class="muted">Generate a long-form deep dive for this lesson with extra worked examples, common mistakes and exam tips. It uses free AI models and is saved in this browser.</p><button class="btn small" id="deepbtn">Expand this lesson with AI</button><span class="muted" id="deepstat"></span></div>`;
    const b = $('#deepbtn');
    if (b) b.onclick = async () => {
      if (!AI.hasKey()) { alert('Connect your OpenRouter account in Studio to use AI.'); return; }
      b.disabled = true; $('#deepstat').textContent = ' Writing…';
      try {
        const r = await AI.json(Prompts.SYSTEM, Prompts.deepenPrompt(c, l), { max: 9000 });
        const S = Store.get(); (S.deep = S.deep || {})[`${c.id}/${l.id}`] = r.json; Store.save(); mountDeep(c, l);
      } catch (e) { b.disabled = false; $('#deepstat').textContent = ' ' + e.message; }
    };
  }

  async function mountSupp(c, l) {
    const box = $('#supp'); if (!box) return;
    const clean = t => String(t || '').replace(/^AP\s+/i, '').replace(/\b(and|the|of|in|with|for)\b/gi, ' ').replace(/\s+/g, ' ').trim();
    const hint = clean(c.title).replace(/\b(AB|BC|1|2|C)\b/g, '').trim();
    const terms = [l.wiki || WIKI[`${c.id}/${l.id}`], l.title, clean(l.title).split(' ').slice(0, 3).join(' '), clean(c.title)].filter(Boolean);
    const term = terms[0];
    box.innerHTML = `<h2>Supplementary reading</h2><p class="muted"><small>Excerpts below are from openly licensed sources and are shown with attribution. Textbook and video tags point to free resources you can use alongside this lesson.</small></p>
      <div class="supp"><div class="panel" id="suppw"><p class="muted">Loading excerpt…</p></div><div class="panel" id="suppb"></div></div>
      <h3>Tagged resources</h3><div class="tagrows">${tags(c, l)}${(l.res || []).map(id => resourceCard(id, l.q || l.title)).join('')}</div>`;
    (async () => { for (const t of terms) { try { const w = await wikipedia(t, t === (l.wiki || WIKI[`${c.id}/${l.id}`]) ? '' : hint); if (w && w.text) return w; } catch (e) { /* try next */ } } return null; })().then(w => {
      const el = $('#suppw'); if (!el) return;
      if (!w || !w.text) { el.remove(); return; }
      const short = w.text.length > 1400 ? w.text.slice(0, 1400).replace(/\s+\S*$/, '') + '…' : w.text;
      el.innerHTML = `<h3>From Wikipedia: ${esc(w.title)}</h3>${short.split('\n').filter(Boolean).map(p => `<p>${esc(p)}</p>`).join('')}<p class="muted"><small>Text from <a href="${esc(w.url)}" target="_blank" rel="noopener noreferrer">Wikipedia</a>, licensed CC BY-SA 4.0. <a href="${esc(w.url)}" target="_blank" rel="noopener noreferrer">Continue reading</a>.</small></p>`;
    }).catch(() => { const el = $('#suppw'); if (el) el.remove(); });
    wikibooks(term).then(list => {
      const el = $('#suppb'); if (!el) return;
      if (!list.length) { el.remove(); return; }
      el.innerHTML = `<h3>Free textbook pages on Wikibooks</h3><ul class="list">${list.map(x => `<li><span><a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.title)}</a><br><small class="muted">${esc(x.snippet)}</small></span></li>`).join('')}</ul><p class="muted"><small>Wikibooks content is licensed CC BY-SA.</small></p>`;
    }).catch(() => { const el = $('#suppb'); if (el) el.remove(); });
  }

  return { mount(c, l) { mountDeep(c, l); mountSupp(c, l); } };
})();
