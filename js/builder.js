// course builder: hand-built or ai-assisted courses, stored in the browser as raw course json
const Builder = (() => {
  const store = () => Store.get();
  const find = id => store().aiCourses.find(r => r.id === id);
  const uid = () => Math.random().toString(36).slice(2, 6);
  const emptyQ = type => (type === 'mc' ? { question: '', options: ['', '', '', ''], answerIndex: 0, explanation: '', hint: '' } : { question: '', accepted: [], explanation: '', hint: '' });
  const ready = l => !!(l.explanation && l.explanation.length) && (l.quiz || []).filter(q => Normalize.question(q)).length >= 2;
  const lines = s => String(s || '').split('\n').map(x => x.trim()).filter(Boolean);
  let timer = null;

  function sync(r) {
    const i = COURSES.findIndex(c => c.id === r.id);
    if (i >= 0) COURSES.splice(i, 1);
    registerMine(r);
  }
  function persist(r, now) {
    clearTimeout(timer);
    const go = () => { sync(r); Store.save(); };
    if (now) go(); else timer = setTimeout(go, 300);
  }

  /* ---------- list ---------- */

  function viewHome() {
    const list = store().aiCourses;
    return {
      html: `<h1>Course builder</h1>
        <p class="muted">Build a full course by hand, let AI draft it for you, or mix both. Courses are stored in this browser, appear in the catalog under your own courses, and can be exported as a file to share.</p>
        <div class="grid">
          <form class="panel form" id="nf"><h3>Start a new course</h3>
            <label>Title<input name="title" required placeholder="e.g. Intro to Music Production"></label>
            <div class="two"><label>Level${bandSelect('9-12')}</label><label>Subject<input name="subject" placeholder="e.g. Arts"></label></div>
            <button class="btn primary">Create and open editor</button></form>
          <div class="panel"><h3>Generate with AI first</h3><p class="muted">Describe a topic and a free model drafts the whole course. You can then edit every lesson here.</p><a class="btn" href="#/create">Generate a course</a>
            <h3 style="margin-top:16px">Import a course file</h3><p class="muted"><small>JSON exported from the builder or from tools/generate.cjs.</small></p><input type="file" id="imp" accept="application/json"></div>
        </div>
        <h2>Your courses</h2>
        ${list.length ? `<div class="rlist">${list.map(r => { const ls = r.units.flatMap(u => u.lessons || []); return `<div class="rrow"><div class="grow"><b>${esc(r.title)}</b> <span class="muted">· ${esc(r.subject || '')} · ${esc(r.band || '')}${r.tier && r.tier !== 'Standard' ? ' · ' + esc(r.tier) : ''}</span><p class="muted">${r.units.length} units, ${ls.length} lessons, ${ls.filter(ready).length} ready</p></div><a class="btn small" href="#/build/${r.id}">Edit</a></div>`; }).join('')}</div>` : '<p class="muted">Nothing here yet.</p>'}`,
      after() {
        $('#nf').onsubmit = e => {
          e.preventDefault();
          const f = new FormData(e.target), title = f.get('title').trim();
          const r = { id: `my-${slugify(title)}-${uid()}`, title, subject: f.get('subject').trim() || 'General', band: f.get('band'), tier: 'Standard', level: '', blurb: '', tags: [], units: [], created: Date.now(), built: true };
          store().aiCourses.push(r); Store.save(); location.hash = '#/build/' + r.id;
        };
        $('#imp').onchange = async e => {
          try {
            const r = JSON.parse(await e.target.files[0].text());
            if (!r || !Array.isArray(r.units) || !r.title) throw new Error('bad file');
            r.id = `my-${slugify(r.title)}-${uid()}`; r.built = true;
            store().aiCourses.push(r); persist(r, true); render();
          } catch (x) { alert('That file is not a valid course.'); }
        };
      },
    };
  }

  /* ---------- editor ---------- */

  function viewEditor(id) {
    const r = find(id);
    if (!r) return viewNotFound();
    let open = null;
    const ctx = () => ({ title: r.title, subject: r.subject, band: r.band, tier: r.tier, level: r.level });

    const qForm = (q, ui, li, qi) => {
      const base = `data-scope="q" data-u="${ui}" data-l="${li}" data-q="${qi}"`;
      const isMc = Array.isArray(q.options);
      return `<div class="panel qedit"><div class="sec-head"><b>${isMc ? 'Multiple choice' : 'Short answer'} ${qi + 1}</b><button class="x" data-act="delQ" data-u="${ui}" data-l="${li}" data-q="${qi}" aria-label="Remove question">×</button></div>
        <label class="fl">Question<textarea rows="2" ${base} data-f="question">${esc(q.question)}</textarea></label>
        ${isMc ? q.options.map((o, k) => `<label class="opt"><input type="radio" name="c${ui}_${li}_${qi}" ${base} data-f="correct" value="${k}" ${q.answerIndex === k ? 'checked' : ''}><input class="ans" ${base} data-f="opt${k}" value="${esc(o)}" placeholder="Option ${k + 1}${q.answerIndex === k ? ' (correct)' : ''}"></label>`).join('')
          : `<label class="fl">Accepted answers (separate with commas)<input class="ans" ${base} data-f="accepted" value="${esc((q.accepted || []).join(', '))}"></label>`}
        <label class="fl">Explanation<input class="ans" ${base} data-f="explanation" value="${esc(q.explanation || '')}"></label>
        <label class="fl">Hint (optional)<input class="ans" ${base} data-f="hint" value="${esc(q.hint || '')}"></label></div>`;
    };

    const lessonForm = (l, ui, li) => {
      const b = `data-scope="lesson" data-u="${ui}" data-l="${li}"`, ex = l.example || {};
      return `<div class="lessonedit"><div class="two"><label class="fl">Lesson title<input class="ans" ${b} data-f="title" value="${esc(l.title)}"></label><label class="fl">Minutes<input class="ans" type="number" min="3" max="60" ${b} data-f="minutes" value="${l.minutes || 10}"></label></div>
        <label class="fl">Explanation (separate paragraphs with a blank line; **bold** and \`code\` work)<textarea rows="10" ${b} data-f="explanation">${esc((l.explanation || []).join('\n\n'))}</textarea></label>
        <label class="fl">Key terms (one per line: term: definition)<textarea rows="3" ${b} data-f="terms">${esc((l.keyTerms || []).map(t => `${t.term}: ${t.definition}`).join('\n'))}</textarea></label>
        <label class="fl">Worked example: problem<input class="ans" ${b} data-f="exProblem" value="${esc(ex.problem || '')}"></label>
        <label class="fl">Steps (one per line)<textarea rows="3" ${b} data-f="exSteps">${esc((ex.steps || []).join('\n'))}</textarea></label>
        <label class="fl">Answer<input class="ans" ${b} data-f="exAnswer" value="${esc(ex.answer || '')}"></label>
        <h4>Practice questions (at least 2 needed)</h4>${(l.quiz || []).map((q, qi) => qForm(q, ui, li, qi)).join('')}
        <div class="row-actions"><button class="btn small" data-act="addMc" data-u="${ui}" data-l="${li}">+ Multiple choice</button><button class="btn small" data-act="addText" data-u="${ui}" data-l="${li}">+ Short answer</button><button class="btn small" data-act="aiQ" data-u="${ui}" data-l="${li}">AI: add 4 questions</button></div>
        <label class="fl">Flashcards (one per line: front | back)<textarea rows="3" ${b} data-f="cards">${esc((l.flashcards || []).map(c => `${c.front} | ${c.back}`).join('\n'))}</textarea></label>
        <div class="row-actions"><button class="btn" data-act="aiDraft" data-u="${ui}" data-l="${li}">Draft this lesson with AI</button><span class="muted" id="aistat"></span></div></div>`;
    };

    const html = () => `<nav class="crumbs"><a href="#/build">Course builder</a> › ${esc(r.title)}</nav>
      <div class="sec-head"><h1>${esc(r.title)}</h1><div class="row-actions"><a class="btn" href="#/course/${r.id}" data-act="preview">Preview course</a><button class="btn" data-act="export">Export file</button><button class="btn danger" data-act="delete">Delete</button></div></div>
      <div id="aipanel">${AI.hasKey() ? '' : aiPanel()}</div>
      <div class="panel form"><h3>Course settings</h3>
        <label>Title<input data-scope="course" data-f="title" value="${esc(r.title)}"></label>
        <div class="two"><label>Subject<input data-scope="course" data-f="subject" value="${esc(r.subject || '')}"></label><label>Level<select data-scope="course" data-f="band">${BANDS.map(b => `<option value="${b}" ${r.band === b ? 'selected' : ''}>${b}</option>`).join('')}</select></label></div>
        <div class="two"><label>Tier<select data-scope="course" data-f="tier">${['Standard', 'Honors', 'AP'].map(t => `<option ${r.tier === t ? 'selected' : ''}>${t}</option>`).join('')}</select></label><label>Short description<input data-scope="course" data-f="blurb" value="${esc(r.blurb || '')}"></label></div></div>
      <div class="sec-head"><h2>Units and lessons</h2><div class="row-actions"><button class="btn small" data-act="aiOutline">AI: suggest outline</button><button class="btn small" data-act="aiAll">AI: draft all empty lessons</button></div></div>
      <div id="aiprog"></div>
      ${r.units.map((u, ui) => `<div class="panel unitedit"><div class="inline"><input class="ans" data-scope="unit" data-u="${ui}" data-f="title" value="${esc(u.title)}" aria-label="Unit title"><button class="btn small" data-act="upU" data-u="${ui}">Up</button><button class="btn small" data-act="downU" data-u="${ui}">Down</button><button class="btn small danger" data-act="delU" data-u="${ui}">Delete</button></div>
        ${(u.lessons || []).map((l, li) => `<div class="lrow ${open && open.u === ui && open.l === li ? 'on' : ''}"><span class="lt">${esc(l.title || 'Untitled lesson')}</span><span class="badge ${ready(l) ? 'm2' : 'm0'}" data-st="${ui}_${li}">${ready(l) ? 'Ready' : 'Incomplete'}</span><button class="btn small" data-act="open" data-u="${ui}" data-l="${li}">${open && open.u === ui && open.l === li ? 'Close' : 'Edit'}</button><button class="btn small" data-act="upL" data-u="${ui}" data-l="${li}">Up</button><button class="btn small" data-act="downL" data-u="${ui}" data-l="${li}">Down</button><button class="btn small danger" data-act="delL" data-u="${ui}" data-l="${li}">Delete</button></div>${open && open.u === ui && open.l === li ? lessonForm(l, ui, li) : ''}`).join('')}
        <div class="row-actions"><button class="btn small" data-act="addL" data-u="${ui}">+ Add lesson</button></div></div>`).join('') || '<p class="muted">No units yet. Add one, or let AI suggest an outline.</p>'}
      <div class="row-actions"><button class="btn primary" data-act="addU">+ Add unit</button></div>
      <p class="muted"><small>Only lessons marked Ready appear in the course. Everything saves automatically in this browser.</small></p>`;

    return {
      html: '<div id="bedit"></div>',
      after() {
        const root = $('#bedit');
        const draw = () => {
          const y = window.scrollY;
          root.innerHTML = html();
          const ap = $('#aipanel', root); if (ap) bindAI(ap, () => { ap.innerHTML = AI.hasKey() ? '' : aiPanel(); });
          window.scrollTo(0, y);
        };
        const L = (u, l) => r.units[u].lessons[l];
        const statusRefresh = () => $$('[data-st]', root).forEach(b => { const [u, l] = b.dataset.st.split('_').map(Number), ok = ready(L(u, l)); b.textContent = ok ? 'Ready' : 'Incomplete'; b.className = 'badge ' + (ok ? 'm2' : 'm0'); });
        const needAI = () => { if (AI.hasKey()) return true; alert('Connect your OpenRouter account to use AI.'); return false; };
        const progress = (t, d, tot) => { const el = $('#aiprog', root); if (el) el.innerHTML = `<div class="cbar wide"><i style="width:${tot ? Math.round(d / tot * 100) : 10}%"></i></div><p class="muted">${esc(t)}</p>`; };
        const draftLesson = async (u, l) => {
          const lesson = L(u, l), r2 = await AI.json(Prompts.SYSTEM, Prompts.lessonPrompt(ctx(), r.units[u].title, lesson.title));
          Object.assign(lesson, { ...r2.json, title: lesson.title });
        };

        root.addEventListener('input', e => {
          const t = e.target, f = t.dataset.f, sc = t.dataset.scope;
          if (!f) return;
          const u = +t.dataset.u, l = +t.dataset.l, q = +t.dataset.q;
          if (sc === 'course') r[f] = t.value;
          else if (sc === 'unit') r.units[u].title = t.value;
          else if (sc === 'lesson') {
            const le = L(u, l);
            if (f === 'title') le.title = t.value;
            else if (f === 'minutes') le.minutes = +t.value || 10;
            else if (f === 'explanation') le.explanation = t.value.split(/\n\s*\n/).map(x => x.trim()).filter(Boolean);
            else if (f === 'terms') le.keyTerms = lines(t.value).map(x => { const i = x.indexOf(':'); return i > 0 ? { term: x.slice(0, i).trim(), definition: x.slice(i + 1).trim() } : null; }).filter(Boolean);
            else if (f === 'exProblem') (le.example = le.example || {}).problem = t.value;
            else if (f === 'exSteps') (le.example = le.example || {}).steps = lines(t.value);
            else if (f === 'exAnswer') (le.example = le.example || {}).answer = t.value;
            else if (f === 'cards') le.flashcards = lines(t.value).map(x => { const i = x.indexOf('|'); return i > 0 ? { front: x.slice(0, i).trim(), back: x.slice(i + 1).trim() } : null; }).filter(Boolean);
          } else if (sc === 'q') {
            const qq = L(u, l).quiz[q];
            if (f === 'correct') qq.answerIndex = +t.value;
            else if (/^opt\d$/.test(f)) qq.options[+f[3]] = t.value;
            else if (f === 'accepted') qq.accepted = t.value.split(',').map(x => x.trim()).filter(Boolean);
            else qq[f] = t.value;
          }
          persist(r); statusRefresh();
        });

        root.addEventListener('click', async e => {
          const b = e.target.closest('[data-act]'); if (!b) return;
          const a = b.dataset.act, u = +b.dataset.u, l = +b.dataset.l, q = +b.dataset.q;
          const move = (arr, i, d) => { const j = i + d; if (j >= 0 && j < arr.length) [arr[i], arr[j]] = [arr[j], arr[i]]; };
          const structural = () => { persist(r, true); draw(); };
          if (a === 'preview') { persist(r, true); return; }
          if (a === 'export') { const x = document.createElement('a'); x.href = URL.createObjectURL(new Blob([JSON.stringify(r, null, 2)], { type: 'application/json' })); x.download = slugify(r.title) + '.json'; x.click(); return; }
          if (a === 'delete') { if (confirm('Delete this course?')) { store().aiCourses = store().aiCourses.filter(x => x !== r); const i = COURSES.findIndex(c => c.id === r.id); if (i >= 0) COURSES.splice(i, 1); Store.save(); location.hash = '#/build'; } return; }
          if (a === 'addU') { r.units.push({ title: `Unit ${r.units.length + 1}`, lessons: [] }); return structural(); }
          if (a === 'delU') { if (confirm('Delete this unit and its lessons?')) { r.units.splice(u, 1); open = null; structural(); } return; }
          if (a === 'upU') { move(r.units, u, -1); open = null; return structural(); }
          if (a === 'downU') { move(r.units, u, 1); open = null; return structural(); }
          if (a === 'addL') { r.units[u].lessons.push({ title: `Lesson ${r.units[u].lessons.length + 1}`, minutes: 10, explanation: [], keyTerms: [], example: { problem: '', steps: [], answer: '' }, quiz: [emptyQ('mc'), emptyQ('mc')], flashcards: [] }); open = { u, l: r.units[u].lessons.length - 1 }; return structural(); }
          if (a === 'delL') { if (confirm('Delete this lesson?')) { r.units[u].lessons.splice(l, 1); open = null; structural(); } return; }
          if (a === 'upL') { move(r.units[u].lessons, l, -1); open = null; return structural(); }
          if (a === 'downL') { move(r.units[u].lessons, l, 1); open = null; return structural(); }
          if (a === 'open') { open = open && open.u === u && open.l === l ? null : { u, l }; return draw(); }
          if (a === 'addMc' || a === 'addText') { (L(u, l).quiz = L(u, l).quiz || []).push(emptyQ(a === 'addMc' ? 'mc' : 'text')); return structural(); }
          if (a === 'delQ') { L(u, l).quiz.splice(q, 1); return structural(); }

          if (!needAI()) return;
          b.disabled = true;
          try {
            if (a === 'aiDraft') { $('#aistat', root).textContent = 'Drafting…'; await draftLesson(u, l); structural(); }
            else if (a === 'aiQ') {
              const le = L(u, l), txt = (le.explanation || []).join('\n');
              const res = await AI.json('You write fair, accurate quiz questions. Reply with one JSON object only.', `Course: ${r.title}. Lesson: ${le.title}.\n${txt ? 'Lesson text:\n' + txt.slice(0, 6000) + '\n' : ''}Write 4 new practice questions. JSON: {"questions":[{"question":"...","options":["A","B","C","D"],"answerIndex":0,"explanation":"why","hint":"hint"},{"question":"...","accepted":["answer"],"explanation":"why","hint":"hint"}]}. Use 3 multiple choice and 1 short answer.`, { max: 4000 });
              (le.quiz = le.quiz || []).push(...(res.json.questions || []).filter(x => Normalize.question(x))); structural();
            } else if (a === 'aiOutline') {
              progress('Designing the outline…');
              const o = await AI.json(Prompts.SYSTEM, Prompts.outlinePrompt(ctx(), 4, 3));
              (o.json.units || []).forEach(un => r.units.push({ title: un.title, lessons: (un.lessons || []).map(t => ({ title: typeof t === 'string' ? t : t.title, minutes: 10, explanation: [], keyTerms: [], quiz: [], flashcards: [] })) }));
              if (!r.blurb) r.blurb = o.json.blurb || ''; structural();
            } else if (a === 'aiAll') {
              const jobs = []; r.units.forEach((un, ui) => (un.lessons || []).forEach((le, li) => { if (!ready(le)) jobs.push([ui, li]); }));
              let done = 0; const total = jobs.length;
              const worker = async () => { while (jobs.length) { const [ui, li] = jobs.shift(); try { await draftLesson(ui, li); } catch (x) { if (x.fatal) throw x; } done++; progress(`Drafting lessons… ${done}/${total}`, done, total); persist(r, true); } };
              await Promise.all([worker(), worker()]); structural();
            }
          } catch (x) { alert(x.message); }
          b.disabled = false;
        });
        draw();
      },
    };
  }

  return { viewHome, viewEditor };
})();
