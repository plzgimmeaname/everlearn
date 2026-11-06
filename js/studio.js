// studio: notebook workspace (sources + ai) and the in-browser course generator
const slugify = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'course';
const plainText = html => String(html).replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();

function md(text) {
  const inl = s => s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`(.+?)`/g, '<code>$1</code>').replace(/\[S(\d+)\]/g, '<sup class="cite">S$1</sup>');
  let out = '', list = '';
  const close = () => { if (list) { out += `</${list}>`; list = ''; } };
  for (const raw of esc(text).split('\n')) {
    const l = raw.trim();
    let m;
    if (!l) { close(); continue; }
    if ((m = l.match(/^(#{1,4})\s+(.*)/))) { close(); const n = Math.min(4, m[1].length + 1); out += `<h${n}>${inl(m[2])}</h${n}>`; }
    else if ((m = l.match(/^[-*•]\s+(.*)/))) { if (list !== 'ul') { close(); out += '<ul>'; list = 'ul'; } out += `<li>${inl(m[1])}</li>`; }
    else if ((m = l.match(/^\d+[.)]\s+(.*)/))) { if (list !== 'ol') { close(); out += '<ol>'; list = 'ol'; } out += `<li>${inl(m[1])}</li>`; }
    else { close(); out += `<p>${inl(l)}</p>`; }
  }
  close();
  return out;
}

function registerMine(raw) {
  const c = Normalize.normalizeCourse(raw, COURSES.length);
  if (!c || courseById(c.id)) return null;
  c.mine = true;
  COURSES.push(c);
  COURSES.sort((a, b) => BANDS.indexOf(a.band) - BANDS.indexOf(b.band) || a.subject.localeCompare(b.subject) || a.title.localeCompare(b.title));
  return c;
}

function sourceContext(sources, limit = 30000) {
  if (!sources.length) return '';
  const each = Math.floor(limit / sources.length);
  return sources.map((s, i) => `[S${i + 1}] ${s.title}\n${s.text.slice(0, each)}`).join('\n\n');
}

/* ---------- course generator ---------- */

const Gen = {
  async course(spec, onProgress) {
    const c = { title: spec.title, subject: spec.subject, band: spec.band, level: spec.level, focus: spec.focus };
    const ctx = spec.context || '';
    onProgress({ msg: 'Designing the outline…', done: 0, total: 0 });
    const o = await AI.json(Prompts.SYSTEM, Prompts.outlinePrompt(c, spec.units, spec.lessons, ctx));
    const raw = {
      id: `my-${slugify(spec.title)}-${Math.random().toString(36).slice(2, 6)}`, title: spec.title, subject: spec.subject, band: spec.band, level: spec.level || spec.band,
      blurb: o.json.blurb, tags: o.json.tags, created: Date.now(),
      units: (o.json.units || []).map(u => ({ title: u.title, outline: (u.lessons || []).map(t => (typeof t === 'string' ? t : t && t.title)).filter(Boolean), lessons: [] })),
    };
    const jobs = raw.units.flatMap(u => u.outline.map(t => ({ u, t })));
    const total = jobs.length;
    let done = 0, failed = 0, fatal = null;
    const worker = async () => {
      while (jobs.length && !fatal) {
        const { u, t } = jobs.shift();
        try {
          const r = await AI.json(Prompts.SYSTEM, Prompts.lessonPrompt(c, u.title, t, ctx));
          u.lessons.push(r.json);
          u.lessons.sort((x, y) => u.outline.indexOf(x.title) - u.outline.indexOf(y.title));
        } catch (e) { if (e.fatal) fatal = e; else failed++; }
        done++;
        onProgress({ msg: `Writing lessons… ${t}`, done, total, failed });
      }
    };
    await Promise.all([worker(), worker()]);
    if (fatal) throw fatal;
    const course = Normalize.normalizeCourse(raw);
    if (!course) throw new Error('The models did not return any usable lessons. Try again.');
    const S = Store.get();
    S.aiCourses.push(raw);
    Store.save();
    registerMine(raw);
    Game.award(40); Game.event('aicourse'); Game.commit();
    return course;
  },
};

/* ---------- shared bits ---------- */

function aiPanel() {
  if (AI.hasKey()) {
    return `<div class="panel ai-on"><b>Connected to OpenRouter</b> <span class="muted">(free models only)</span>
      <div class="row-actions"><button class="btn small" data-ai="disconnect">Disconnect</button><button class="btn small ghost" data-ai="models">Choose models</button></div></div>`;
  }
  return `<div class="panel"><h3>Connect OpenRouter to use AI</h3>
    <p class="muted">Everlearn uses free models on OpenRouter. Signing in creates a key in <b>your own</b> OpenRouter account. It is stored only in this browser and never sent anywhere else.</p>
    <div class="row-actions"><button class="btn primary" data-ai="login" ${AI.canLogin() ? '' : 'disabled'}>Connect with OpenRouter</button></div>
    ${AI.canLogin() ? '' : '<p class="fb warn">Sign-in works when the site is served over http://localhost or https. Run <code>python3 -m http.server</code> in the project folder and open the localhost link, or paste a key below.</p>'}
    <details><summary>Or paste an API key</summary><form class="inline" data-ai-form><input type="password" placeholder="sk-or-…" autocomplete="off"><button class="btn small">Save</button></form></details>
    <p class="muted"><small>Free models are run by third parties and may log prompts, so don't paste private information. Free models are rate limited.</small></p></div>`;
}

function bindAI(root, rerender) {
  root.addEventListener('click', async e => {
    const b = e.target.closest('[data-ai]');
    if (!b) return;
    if (b.dataset.ai === 'login') { try { await AI.login(); } catch (x) { alert(x.message); } }
    if (b.dataset.ai === 'disconnect') { AI.disconnect(); rerender(); }
    if (b.dataset.ai === 'models') {
      const v = prompt('Comma-separated OpenRouter model ids to use (leave blank for automatic free models):', AI.customModels());
      if (v !== null) AI.setCustomModels(v);
    }
  });
  root.addEventListener('submit', e => {
    const f = e.target.closest('[data-ai-form]');
    if (!f) return;
    e.preventDefault();
    const v = $('input', f).value.trim();
    if (v) { AI.setKey(v); rerender(); }
  });
}

const BAND_LABEL = { 'K-2': 'K–2', '3-5': 'Grades 3–5', '6-8': 'Grades 6–8', '9-12': 'High school (9–12)', College: 'College' };
const bandSelect = sel => `<select name="band">${BANDS.map(b => `<option value="${b}" ${b === sel ? 'selected' : ''}>${BAND_LABEL[b]}</option>`).join('')}</select>`;

function progressUI(el) {
  return p => {
    if (!el.isConnected) return;
    el.innerHTML = `<div class="cbar wide"><i style="width:${p.total ? Math.round(p.done / p.total * 100) : 5}%"></i></div><p class="muted">${esc(p.msg)} ${p.total ? `(${p.done}/${p.total})` : ''}${p.failed ? ` · ${p.failed} skipped` : ''}</p>`;
  };
}

/* ---------- create a course ---------- */

function viewCreate(topic) {
  return {
    html: `<h1>Make a course with AI</h1>
      <p class="muted">Type any subject and a free AI model writes a full course with lessons, worked examples, quizzes and flashcards. It is saved in this browser under <b>My courses</b>.</p>
      <div id="aipanel">${aiPanel()}</div>
      <form class="panel form" id="cf">
        <label>Subject or topic<input name="title" required value="${esc(topic || '')}" placeholder="e.g. The French Revolution"></label>
        <div class="two"><label>Level${bandSelect('9-12')}</label><label>Category<input name="subject" placeholder="e.g. History" value=""></label></div>
        <div class="two"><label>Units<input name="units" type="number" min="1" max="6" value="3"></label><label>Lessons per unit<input name="lessons" type="number" min="1" max="5" value="3"></label></div>
        <label>Focus (optional)<input name="focus" placeholder="e.g. causes, key figures, and effects"></label>
        <button class="btn primary big" id="go">Generate course</button>
        <div id="prog"></div>
      </form>`,
    after() {
      bindAI($('#aipanel'), () => { $('#aipanel').innerHTML = aiPanel(); });
      $('#cf').onsubmit = async e => {
        e.preventDefault();
        if (!AI.hasKey()) { alert('Connect your OpenRouter account first.'); return; }
        const f = new FormData(e.target), btn = $('#go');
        btn.disabled = true;
        const upd = progressUI($('#prog'));
        try {
          const c = await Gen.course({ title: f.get('title').trim(), subject: f.get('subject').trim() || 'General', band: f.get('band'), units: +f.get('units'), lessons: +f.get('lessons'), focus: f.get('focus').trim() }, upd);
          location.hash = '#/course/' + c.id;
        } catch (x) { $('#prog').innerHTML = `<p class="fb bad">${esc(x.message)}</p>`; btn.disabled = false; }
      };
    },
  };
}

/* ---------- studio (notebooks) ---------- */

function viewStudio() {
  const S = Store.get();
  const mine = S.aiCourses.map(r => courseById(r.id)).filter(Boolean);
  return {
    html: `<h1>Studio</h1>
      <p class="muted">Your AI study notebook. Add your own sources (notes, articles, textbook pages, Wikipedia), then chat with them, make study guides, quizzes and flashcards, or turn them into a full course.</p>
      <div id="aipanel">${aiPanel()}</div>
      <div class="sec-head"><h2>Notebooks</h2><button class="btn primary" id="newnb">+ New notebook</button></div>
      <div class="grid">${S.notebooks.map(n => `<a class="ccard" href="#/studio/${n.id}" style="--c:#8b5cf6"><div class="tile">NB</div><div class="cinfo"><h3>${esc(n.title)}</h3><p>${n.sources.length} sources · ${n.chat.length} messages</p></div></a>`).join('') || '<p class="muted">No notebooks yet. Create one to get started.</p>'}</div>
      <div class="sec-head"><h2>AI courses you made</h2><a class="btn" href="#/create"> Generate a course</a></div>
      <div class="grid">${mine.map(courseCard).join('') || '<p class="muted">Courses you generate appear here.</p>'}</div>`,
    after() {
      bindAI($('#aipanel'), () => { $('#aipanel').innerHTML = aiPanel(); });
      $('#newnb').onclick = () => {
        const t = prompt('Notebook name:', 'My notebook'); if (!t) return;
        const n = { id: Math.random().toString(36).slice(2, 9), title: t.trim().slice(0, 80), sources: [], chat: [], guide: '', quiz: null, cards: [] };
        S.notebooks.push(n); Store.save(); location.hash = '#/studio/' + n.id;
      };
    },
  };
}

function viewNotebook(id) {
  const S = Store.get(), nb = S.notebooks.find(n => n.id === id);
  if (!nb) return viewNotFound();
  let tab = 'chat';
  const lessonOptions = COURSES.flatMap(c => allLessons(c).map(l => `<option value="${c.id}/${l.id}">${esc(c.title)} › ${esc(l.title)}</option>`)).join('');
  return {
    html: `<nav class="crumbs"><a href="#/studio">Studio</a> › Notebook</nav>
      <div class="sec-head"><h1>${esc(nb.title)}</h1><button class="btn danger small" id="delnb">Delete notebook</button></div>
      <div id="aipanel">${AI.hasKey() ? '' : aiPanel()}</div>
      <div class="cols nbcols"><aside class="srcs"><div class="panel"><h3>Sources <small class="muted" id="srcn"></small></h3><div id="srclist"></div>
        <details open><summary>+ Paste text</summary><form id="pf" class="stack"><input name="t" placeholder="Title" required><textarea name="x" rows="5" placeholder="Paste notes, an article or textbook text" required></textarea><button class="btn small">Add source</button></form></details>
        <details><summary>+ Upload a file</summary><p class="muted"><small>.txt, .md, .csv, .html or .json. For PDFs, copy and paste the text.</small></p><input type="file" id="ff" accept=".txt,.md,.csv,.html,.htm,.json,text/*" multiple></details>
        <details><summary>+ From Wikipedia</summary><form id="wf" class="inline"><input name="q" placeholder="Topic" required><button class="btn small">Search</button></form><div id="wres" class="list"></div></details>
        <details><summary>+ From a course lesson</summary><select id="ls"><option value="">Choose a lesson…</option>${lessonOptions}</select></details>
      </div></aside>
      <section><div class="tabs" id="tabs">${[['chat', 'Chat'], ['guide', 'Study guide'], ['quiz', 'Quiz'], ['cards', 'Flashcards'], ['course', 'Make a course']].map(([k, v]) => `<button class="tab ${k === 'chat' ? 'on' : ''}" data-t="${k}">${v}</button>`).join('')}</div>
      <div id="pane" class="panel pane"></div></section></div>`,
    after() {
      const save = () => Store.save();
      const needAI = () => { if (!AI.hasKey()) { $('#aipanel').innerHTML = aiPanel(); alert('Connect your OpenRouter account to use AI.'); return false; } if (!nb.sources.length) { alert('Add at least one source first.'); return false; } return true; };
      bindAI($('#aipanel'), () => { $('#aipanel').innerHTML = aiPanel(); });

      const drawSources = () => {
        $('#srcn').textContent = `(${nb.sources.length})`;
        $('#srclist').innerHTML = nb.sources.length ? `<ul class="list">${nb.sources.map((s, i) => `<li><span><b>S${i + 1}</b> ${esc(s.title)} <small class="muted">${Math.round(s.text.length / 1000)}k chars</small></span><button class="x" data-rm="${i}" aria-label="Remove">×</button></li>`).join('')}</ul>` : '<p class="muted">No sources yet.</p>';
      };
      const addSource = (title, text) => {
        text = text.trim().slice(0, 60000);
        if (!text) return alert('That source was empty.');
        nb.sources.push({ id: Math.random().toString(36).slice(2, 8), title: title.slice(0, 100), text });
        save(); drawSources(); Game.event('source'); Game.commit();
      };
      $('#srclist').onclick = e => { const b = e.target.closest('[data-rm]'); if (b) { nb.sources.splice(+b.dataset.rm, 1); save(); drawSources(); } };
      $('#pf').onsubmit = e => { e.preventDefault(); const f = new FormData(e.target); addSource(f.get('t'), f.get('x')); e.target.reset(); };
      $('#ff').onchange = async e => {
        for (const f of e.target.files) { let t = await f.text(); if (/\.html?$/i.test(f.name)) t = plainText(t); addSource(f.name, t); }
        e.target.value = '';
      };
      $('#ls').onchange = e => {
        const [cid, lid] = e.target.value.split('/'); if (!cid) return;
        const c = courseById(cid), l = allLessons(c).find(x => x.id === lid);
        addSource(`${c.title}: ${l.title}`, plainText(l.body + ' ' + (l.example || '')));
        e.target.value = '';
      };
      $('#wf').onsubmit = async e => {
        e.preventDefault();
        const q = new FormData(e.target).get('q'), box = $('#wres');
        box.innerHTML = '<p class="muted">Searching…</p>';
        try {
          const s = await jget(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(q)}&limit=6&format=json&origin=*`);
          box.innerHTML = (s[1] || []).map(t => `<li><button class="linkbtn" data-w="${esc(t)}">+ ${esc(t)}</button></li>`).join('') || '<p class="muted">No results.</p>';
        } catch (x) { box.innerHTML = '<p class="muted">Search failed.</p>'; }
      };
      $('#wres').onclick = async e => {
        const b = e.target.closest('[data-w]'); if (!b) return;
        b.disabled = true;
        try {
          const j = await jget(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&redirects=1&titles=${encodeURIComponent(b.dataset.w)}&format=json&origin=*`);
          const p = Object.values(j.query.pages)[0];
          addSource('Wikipedia: ' + p.title, p.extract || '');
        } catch (x) { alert('Could not load that article.'); }
        b.disabled = false;
      };

      const pane = $('#pane');
      const ctxMsg = () => `Sources:\n${sourceContext(nb.sources)}`;
      const CITE = 'Answer using ONLY the numbered sources provided. Cite them like [S1]. If the sources do not contain the answer, say so plainly, then you may add general knowledge clearly labelled as outside the sources. Plain text and markdown only, no LaTeX.';

      const drawChat = () => {
        pane.innerHTML = `<div class="chat" id="chat">${nb.chat.map(m => `<div class="msg ${m.role}">${m.role === 'user' ? esc(m.content) : md(m.content)}</div>`).join('') || '<p class="muted">Ask anything about your sources. Answers cite them like [S1].</p>'}</div>
          <form id="cq" class="inline"><input name="q" placeholder="Ask your sources a question…" autocomplete="off" required><button class="btn primary">Send</button>${nb.chat.length ? '<button type="button" class="btn ghost" id="clr">Clear</button>' : ''}</form>`;
        const box = $('#chat'); box.scrollTop = box.scrollHeight;
        const clr = $('#clr'); if (clr) clr.onclick = () => { nb.chat = []; save(); drawChat(); };
        $('#cq').onsubmit = async e => {
          e.preventDefault();
          if (!needAI()) return;
          const q = new FormData(e.target).get('q'); e.target.reset();
          nb.chat.push({ role: 'user', content: q }); save(); drawChat();
          $('#chat').insertAdjacentHTML('beforeend', '<div class="msg assistant muted" id="think">Thinking…</div>');
          try {
            const hist = nb.chat.slice(-9, -1).map(m => ({ role: m.role, content: m.content }));
            const r = await AI.run([{ role: 'system', content: `You are a careful study assistant. ${CITE}\n\n${ctxMsg()}` }, ...hist, { role: 'user', content: q }], { max: 2500, temperature: 0.3 });
            nb.chat.push({ role: 'assistant', content: r.text.replace(/<think>[\s\S]*?<\/think>/g, '').trim() });
          } catch (x) { nb.chat.push({ role: 'assistant', content: 'That request failed: ' + x.message }); }
          save(); if (tab === 'chat') drawChat();
        };
      };

      const genButton = (label, id) => `<button class="btn primary" id="${id}">${label}</button>`;
      const drawGuide = () => {
        pane.innerHTML = `${nb.guide ? `<div class="prose">${md(nb.guide)}</div>` : '<p class="muted">Turn your sources into an organized study guide with key concepts and review questions.</p>'}
          <div class="row-actions">${genButton(nb.guide ? 'Regenerate' : 'Generate study guide', 'gg')}</div><div id="gstat"></div>`;
        $('#gg').onclick = async () => {
          if (!needAI()) return;
          $('#gstat').innerHTML = '<p class="muted">Writing…</p>';
          try {
            const r = await AI.run([{ role: 'system', content: `You write excellent study guides. ${CITE}` }, { role: 'user', content: `${ctxMsg()}\n\nWrite a study guide in markdown with: an overview, key concepts with definitions, important facts or steps, common misconceptions, and 6 review questions with answers. Cite sources like [S1].` }], { max: 5000, temperature: 0.3 });
            nb.guide = r.text.replace(/<think>[\s\S]*?<\/think>/g, '').trim(); save(); drawGuide();
          } catch (x) { $('#gstat').innerHTML = `<p class="fb bad">${esc(x.message)}</p>`; }
        };
      };

      const drawQuiz = () => {
        pane.innerHTML = `<div id="qz">${nb.quiz ? '' : '<p class="muted">Generate a practice quiz from your sources, with hints and instant feedback.</p>'}</div><div class="row-actions">${genButton(nb.quiz ? 'New quiz' : 'Generate quiz', 'gq')}</div><div id="qstat"></div>`;
        if (nb.quiz) mountQuiz($('#qz'), nb.quiz, () => { Store.touch(); Game.award(10); Game.commit(); });
        $('#gq').onclick = async () => {
          if (!needAI()) return;
          $('#qstat').innerHTML = '<p class="muted">Writing questions…</p>';
          try {
            const r = await AI.json('You write fair, accurate quiz questions. Reply with one JSON object only.', `${ctxMsg()}\n\nWrite 8 questions that test understanding of these sources (mix easy and hard). JSON: {"questions":[{"question":"...","options":["A","B","C","D"],"answerIndex":0,"explanation":"why","hint":"hint"}, {"question":"...","accepted":["answer"],"explanation":"why","hint":"hint"}]}. Use 6 multiple choice and 2 short-answer.`, { max: 5000 });
            const qs = (r.json.questions || []).map(Normalize.question).filter(Boolean);
            if (qs.length < 3) throw new Error('The model returned too few usable questions. Try again.');
            nb.quiz = qs; save(); drawQuiz();
          } catch (x) { $('#qstat').innerHTML = `<p class="fb bad">${esc(x.message)}</p>`; }
        };
      };

      const drawCards = () => {
        pane.innerHTML = `<p class="muted">${nb.cards.length} cards. They join your daily review on the Flashcards page.</p>
          <ul class="list">${nb.cards.map((c, i) => `<li><span><b>${esc(c.f)}</b> — ${esc(c.b)}</span><button class="x" data-dc="${i}" aria-label="Remove">×</button></li>`).join('')}</ul>
          <div class="row-actions">${genButton('Generate flashcards', 'gc')}<a class="btn" href="#/cards">Review</a></div><div id="cstat"></div>`;
        pane.onclick = e => { const b = e.target.closest('[data-dc]'); if (b && tab === 'cards') { nb.cards.splice(+b.dataset.dc, 1); save(); drawCards(); } };
        $('#gc').onclick = async () => {
          if (!needAI()) return;
          $('#cstat').innerHTML = '<p class="muted">Writing…</p>';
          try {
            const r = await AI.json('You write concise, accurate flashcards. Reply with one JSON object only.', `${ctxMsg()}\n\nWrite 12 flashcards covering the most important ideas. JSON: {"cards":[{"front":"question or term","back":"short answer"}]}`, { max: 4000 });
            const cs = (r.json.cards || []).filter(c => c && c.front && c.back).map(c => ({ f: String(c.front).slice(0, 200), b: String(c.back).slice(0, 400) }));
            if (!cs.length) throw new Error('No usable cards came back. Try again.');
            nb.cards.push(...cs); save(); drawCards();
          } catch (x) { $('#cstat').innerHTML = `<p class="fb bad">${esc(x.message)}</p>`; }
        };
      };

      const drawCourse = () => {
        pane.innerHTML = `<p class="muted">Turn these sources into a full course with lessons, worked examples, quizzes and flashcards, based on your sources.</p>
          <form class="form" id="mc"><label>Course title<input name="title" required value="${esc(nb.title)}"></label>
          <div class="two"><label>Level${bandSelect('9-12')}</label><label>Category<input name="subject" placeholder="e.g. Biology"></label></div>
          <div class="two"><label>Units<input name="units" type="number" min="1" max="6" value="2"></label><label>Lessons per unit<input name="lessons" type="number" min="1" max="5" value="3"></label></div>
          <button class="btn primary big" id="mcb">Generate course</button><div id="prog"></div></form>`;
        $('#mc').onsubmit = async e => {
          e.preventDefault();
          if (!needAI()) return;
          const f = new FormData(e.target); $('#mcb').disabled = true;
          try {
            const c = await Gen.course({ title: f.get('title').trim(), subject: f.get('subject').trim() || 'My notes', band: f.get('band'), units: +f.get('units'), lessons: +f.get('lessons'), context: sourceContext(nb.sources, 24000) }, progressUI($('#prog')));
            location.hash = '#/course/' + c.id;
          } catch (x) { $('#prog').innerHTML = `<p class="fb bad">${esc(x.message)}</p>`; $('#mcb').disabled = false; }
        };
      };

      const draws = { chat: drawChat, guide: drawGuide, quiz: drawQuiz, cards: drawCards, course: drawCourse };
      $('#tabs').onclick = e => {
        const b = e.target.closest('[data-t]'); if (!b) return;
        tab = b.dataset.t; pane.onclick = null;
        $$('#tabs .tab').forEach(x => x.classList.toggle('on', x === b));
        draws[tab]();
      };
      $('#delnb').onclick = () => { if (confirm('Delete this notebook and its sources?')) { S.notebooks = S.notebooks.filter(n => n !== nb); Store.save(); location.hash = '#/studio'; } };
      drawSources(); drawChat();
    },
  };
}
