// ap exam practice: timed multiple-choice section and self-scored free-response questions
const Exam = (() => {
  const MC_MAX = 30, SECS_PER_Q = 72;
  const est = pct => (pct >= 0.8 ? 5 : pct >= 0.65 ? 4 : pct >= 0.5 ? 3 : pct >= 0.35 ? 2 : 1);
  const E = () => { const S = Store.get(); return (S.exams = S.exams || {}); };
  const log = (cid, rec) => { const e = E(); (e[cid] = e[cid] || []).push({ t: Date.now(), ...rec }); e[cid] = e[cid].slice(-30); };

  const frqsFor = c => (window.FRQS && window.FRQS[c.id]) || [];
  const poolFor = c => allLessons(c).flatMap(l => l.quiz.map(q => ({ q, l })));

  function panel(c) {
    const hist = (E()[c.id] || []).slice(-1)[0];
    return `<div class="panel"><h3>AP exam practice</h3>
      <p class="muted"><small>Timed multiple-choice section with a score estimate, plus ${frqsFor(c).length} free-response questions with scoring guides.</small></p>
      ${hist ? `<p class="muted"><small>Last attempt: ${hist.mc != null ? `${hist.mc}/${hist.mcTotal} multiple choice (estimated AP ${hist.est})` : `FRQ ${hist.frq}/${hist.frqTotal}`}</small></p>` : ''}
      <a class="btn primary" href="#/exam/${c.id}">Open practice exam</a></div>`;
  }

  function viewExam(cid) {
    const c = courseById(cid);
    if (!c) return viewNotFound();
    const pool = poolFor(c), frqs = frqsFor(c), n = Math.min(MC_MAX, pool.length);
    const hist = E()[c.id] || [];
    return {
      html: `<nav class="crumbs"><a href="#/course/${c.id}">${esc(c.title)}</a> › Practice exam</nav>
        <h1>${esc(c.title)} practice exam</h1>
        <div class="tabs" id="et"><button class="tab on" data-t="mc">Multiple choice</button><button class="tab" data-t="frq">Free response (${frqs.length})</button></div>
        <div id="ebody"></div>
        ${hist.length ? `<h2>Attempts</h2><table class="tbl"><thead><tr><th>Date</th><th>Section</th><th>Score</th><th>Estimate</th></tr></thead><tbody>${hist.slice().reverse().slice(0, 8).map(h => `<tr><td>${new Date(h.t).toLocaleDateString()}</td><td>${h.mc != null ? 'Multiple choice' : 'Free response'}</td><td>${h.mc != null ? `${h.mc}/${h.mcTotal}` : `${h.frq}/${h.frqTotal}`}</td><td>${h.est ? 'AP ' + h.est : ''}</td></tr>`).join('')}</tbody></table>` : ''}`,
      after() {
        const body = $('#ebody');
        const drawMc = () => {
          body.innerHTML = `<div class="panel"><p>${n} questions drawn at random from every lesson in this course, ${Math.round(n * SECS_PER_Q / 60)} minutes. Questions mix multiple choice and short answer. When time ends or you submit, your answers are scored and explained. The estimated AP score is a rough guide only: real exams are curved differently each year.</p><button class="btn primary big" id="begin">Begin timed section</button></div>`;
          $('#begin').onclick = start;
        };
        const start = () => {
          const items = pool.sort(() => Math.random() - 0.5).slice(0, n).map(p => ({ ...p, inst: resolveQ(p.q) }));
          let left = n * SECS_PER_Q, done = false;
          body.innerHTML = `<div class="sprinthead"><b id="clock"></b><button class="btn" id="sub">Submit section</button></div><div class="timer"><i id="tb"></i></div>
            ${items.map((it, i) => `<div class="qcard" data-i="${i}"><div class="qnum">Question ${i + 1} of ${n}</div><div class="qtext">${esc(it.inst.q)}</div>
              ${it.inst.type === 'mc' ? `<div class="opts">${it.inst.options.map((o, k) => `<label class="opt"><input type="radio" name="e${i}" value="${k}"><span>${esc(o)}</span></label>`).join('')}</div>` : '<input class="ans" placeholder="Answer" autocomplete="off">'}</div>`).join('')}`;
          const total = left, clock = $('#clock'), bar = $('#tb');
          const tick = setInterval(() => {
            left--; clock.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')} remaining`; bar.style.width = (left / total * 100) + '%';
            if (left <= 0) finish();
          }, 1000);
          clock.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')} remaining`;
          const finish = () => {
            if (done) return; done = true; clearInterval(tick);
            let ok = 0;
            const review = items.map((it, i) => {
              const card = $(`.qcard[data-i="${i}"]`, body); let val = null;
              if (it.inst.type === 'mc') { const r = $('input:checked', card); val = r ? r.value : null; } else { const v = $('.ans', card).value.trim(); val = v || null; }
              const correct = val !== null && isCorrect(it.inst, val); if (correct) ok++;
              const ans = it.inst.type === 'mc' ? it.inst.options[it.inst.answer] : it.inst.accept[0];
              return `<div class="qcard ${correct ? 'done' : ''}"><div class="qnum">Question ${i + 1} · ${correct ? 'Correct' : val === null ? 'Unanswered' : 'Incorrect'}</div><div class="qtext">${esc(it.inst.q)}</div><div class="fb ${correct ? 'good' : 'bad'}">${correct ? '' : `Correct answer: ${esc(ans)}. `}${esc(it.inst.explain || '')}<br><small>Lesson: ${esc(it.l.title)}</small></div></div>`;
            }).join('');
            const pct = ok / n, e = est(pct);
            log(c.id, { mc: ok, mcTotal: n, est: e });
            Store.touch(); Game.award(Math.round(ok * 3)); Game.event('exam'); Game.commit();
            body.innerHTML = `<div class="kpis"><div class="kpi"><b>${ok}/${n}</b><span>correct (${Math.round(pct * 100)}%)</span></div><div class="kpi"><b>${e}</b><span>estimated AP score</span></div></div>
              <p class="muted">Review each question below, then revisit the lessons you missed. Repeat the exam for a fresh random set.</p><div class="row-actions"><button class="btn primary" id="again">Take another section</button></div>${review}`;
            $('#again').onclick = drawMc;
          };
          $('#sub').onclick = finish;
        };
        const drawFrq = () => {
          if (!frqs.length) { body.innerHTML = '<p class="muted">No free-response questions for this course yet.</p>'; return; }
          body.innerHTML = `<p class="muted">Write a full response in the box, then reveal the scoring guide and award yourself each point honestly. Writing the answer first is what builds exam skill.</p>` + frqs.map((f, i) => `
            <div class="panel frq" data-i="${i}"><div class="qnum">Free response ${i + 1} · ${f.points.reduce((a, p) => a + p.pts, 0)} points</div><h3>${esc(f.title)}</h3><div class="prose">${md(f.prompt)}</div>
              <textarea rows="8" placeholder="Write your response here"></textarea>
              <div class="qbar"><button class="btn" data-reveal>Show scoring guide</button></div><div class="guide" hidden>
                <h4>Scoring guide</h4>${f.points.map((p, k) => `<label class="opt"><input type="checkbox" data-pts="${p.pts}"><span><b>${p.pts} pt${p.pts > 1 ? 's' : ''}</b> · ${esc(p.text)}</span></label>`).join('')}
                <h4>Sample response</h4><div class="prose">${md(f.sample)}</div><p class="muted" id="sc${i}"></p></div></div>`).join('');
          body.onclick = e => {
            const r = e.target.closest('[data-reveal]'); if (r) { $('.guide', r.closest('.frq')).hidden = false; r.hidden = true; }
          };
          body.onchange = e => {
            const card = e.target.closest('.frq'); if (!card || !e.target.dataset.pts) return;
            const pts = $$('[data-pts]', card).filter(x => x.checked).reduce((a, x) => a + +x.dataset.pts, 0), max = $$('[data-pts]', card).reduce((a, x) => a + +x.dataset.pts, 0);
            $(`#sc${card.dataset.i}`).textContent = `Score: ${pts} of ${max}`;
            const f = $$('.frq', body); let tot = 0, mx = 0;
            f.forEach(cd => { tot += $$('[data-pts]', cd).filter(x => x.checked).reduce((a, x) => a + +x.dataset.pts, 0); mx += $$('[data-pts]', cd).reduce((a, x) => a + +x.dataset.pts, 0); });
            const hist = E()[c.id] || [], last = hist[hist.length - 1];
            if (last && last.frq != null && Date.now() - last.t < 6e5) { last.frq = tot; last.frqTotal = mx; } else log(c.id, { frq: tot, frqTotal: mx });
            Store.save();
          };
        };
        $('#et').onclick = e => { const b = e.target.closest('[data-t]'); if (!b) return; $$('#et .tab').forEach(x => x.classList.toggle('on', x === b)); body.onclick = body.onchange = null; (b.dataset.t === 'mc' ? drawMc : drawFrq)(); };
        drawMc();
      },
    };
  }

  return { panel, viewExam };
})();
