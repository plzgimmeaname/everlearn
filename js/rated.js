// elo-style rated practice: adaptive timed sprints with a rating per subject
const Rated = (() => {
  const START = 1000, LEN = 10, TIME = 45;
  const TIERS = [
    [0, 'Foundation'], [800, 'Developing'], [1000, 'Competent'], [1200, 'Proficient'], [1400, 'Advanced'], [1600, 'Expert'], [1800, 'Distinguished'],
  ];
  const tier = r => TIERS.filter(t => r >= t[0]).pop()[1];
  const tierIdx = r => TIERS.filter(t => r >= t[0]).length - 1;

  const R = () => { const S = Store.get(); return (S.rating = Object.assign({ overall: { r: START, n: 0, peak: START }, subjects: {}, history: [] }, S.rating)); };
  const track = key => { const rt = R(); return key === 'All' ? rt.overall : (rt.subjects[key] = rt.subjects[key] || { r: START, n: 0, peak: START }); };
  const kFor = n => (n < 20 ? 40 : n < 60 ? 28 : 20);

  const baseRating = c => (c.tier === 'AP' ? 1750 : c.tier === 'Honors' ? 1600 : { 'K-2': 700, '3-5': 950, '6-8': 1200, '9-12': 1450, College: 1750 }[c.band] || 1200);

  function pool(subject) {
    const out = [];
    COURSES.filter(c => subject === 'All' || c.subject === subject).forEach(c => {
      const ls = allLessons(c), base = baseRating(c);
      ls.forEach((l, i) => l.quiz.forEach(q => out.push({ q, d: base + Math.round(150 * i / Math.max(1, ls.length - 1)), c, l })));
    });
    return out;
  }
  const subjects = () => [...new Set(COURSES.map(c => c.subject))].filter(s => pool(s).length >= 8).sort();

  const expected = (r, d) => 1 / (1 + Math.pow(10, (d - r) / 400));

  function apply(subject, d, correct, fast) {
    const out = [];
    [track('All'), subject !== 'All' ? track(subject) : null].filter(Boolean).forEach(t => {
      const s = correct ? (fast ? 1 : 0.85) : 0;
      const delta = kFor(t.n) * (s - expected(t.r, d));
      t.r = Math.max(100, Math.round((t.r + delta) * 10) / 10); t.n++; t.peak = Math.max(t.peak, Math.round(t.r));
      out.push(delta);
    });
    return out[out.length - 1];
  }

  function spark(points, w = 560, h = 120) {
    if (points.length < 2) return '<p class="muted">Complete at least two sprints to see your rating history.</p>';
    const min = Math.min(...points) - 20, max = Math.max(...points) + 20;
    const xy = points.map((p, i) => `${(i / (points.length - 1) * (w - 20) + 10).toFixed(1)},${(h - 10 - (p - min) / (max - min) * (h - 20)).toFixed(1)}`);
    return `<svg viewBox="0 0 ${w} ${h}" class="spark" role="img" aria-label="Rating history"><polyline points="${xy.join(' ')}" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="${xy[xy.length - 1].split(',')[0]}" cy="${xy[xy.length - 1].split(',')[1]}" r="4" fill="currentColor"/></svg>
      <div class="sparklbl"><small class="muted">${Math.round(points[0])}</small><small class="muted">${Math.round(points[points.length - 1])}</small></div>`;
  }

  const ratingBlock = (label, t) => `<div class="ratecard"><span class="rt-label">${esc(label)}</span><b class="rt-num t${tierIdx(t.r)}">${Math.round(t.r)}</b><small class="muted">${tier(t.r)}${t.n < 10 ? ' (provisional)' : ''} · ${t.n} answered</small></div>`;

  function summaryHtml() {
    const o = track('All');
    return `<div class="panel"><h3>Rating</h3><div class="ratecard"><b class="rt-num t${tierIdx(o.r)}">${Math.round(o.r)}</b><small class="muted">${tier(o.r)}${o.n < 10 ? ' (provisional)' : ''}</small></div><a class="btn small" href="#/rated">Rated practice</a></div>`;
  }

  /* ---------- views ---------- */

  function viewHome() {
    const rt = R(), subs = subjects();
    const hist = rt.history.filter(h => h.subject === 'All').map(h => h.r);
    return {
      html: `<h1>Rated practice</h1>
        <p class="muted">Timed sprints of ${LEN} questions that adapt to your level. Every question has a difficulty rating, and each answer moves your rating up or down the way a chess rating does: beating hard questions raises it more than easy ones. Ratings are kept for each subject and overall.</p>
        <div class="ratings">${ratingBlock('Overall', track('All'))}${subs.map(s => ratingBlock(s, track(s))).join('')}</div>
        <div class="row-actions"><a class="btn primary big" href="#/rated/All">Start mixed sprint</a></div>
        <h2>Choose a subject</h2>
        <div class="grid">${subs.map(s => `<a class="ccard" href="#/rated/${encodeURIComponent(s)}" style="--c:var(--brand)"><div class="cinfo"><span class="ctag">${rt.subjects[s] ? rt.subjects[s].n : 0} answered</span><h3>${esc(s)}</h3><p>Rating ${Math.round(track(s).r)} · ${tier(track(s).r)}</p></div></a>`).join('')}</div>
        <h2>Overall rating history</h2><div class="panel">${spark(hist)}</div>
        <h2>Recent sprints</h2>
        ${rt.history.some(h => !h.hidden) ? `<table class="tbl"><thead><tr><th>Subject</th><th>Score</th><th>Change</th><th>Rating</th><th>Date</th></tr></thead><tbody>${rt.history.filter(h => !h.hidden).slice(-10).reverse().map(h => `<tr><td>${esc(h.subject)}</td><td>${h.score}/${h.total}</td><td class="${h.delta >= 0 ? 'up' : 'down'}">${h.delta >= 0 ? '+' : ''}${h.delta.toFixed(1)}</td><td>${Math.round(h.r)}</td><td>${new Date(h.t).toLocaleDateString()}</td></tr>`).join('')}</tbody></table>` : '<p class="muted">No sprints yet.</p>'}
        <h2>How ratings work</h2>
        <div class="panel"><ul class="list"><li><span>Starting rating</span><span>${START}</span></li><li><span>Question difficulty</span><span>Set by course level, tier and position (about 700 for K-2 up to 1900 for AP and college)</span></li><li><span>Update rule</span><span>Elo expectation, K = 40 for your first 20 answers, then 28, then 20</span></li><li><span>Speed</span><span>Correct answers inside half the time limit earn full credit, slower ones 85%</span></li><li><span>Time limit</span><span>${TIME} seconds per question; a timeout counts as incorrect</span></li></ul></div>`,
    };
  }

  function viewSprint(subject) {
    const all = pool(subject);
    if (all.length < 8) return viewNotFound();
    return {
      html: `<nav class="crumbs"><a href="#/rated">Rated practice</a> › ${esc(subject === 'All' ? 'Mixed' : subject)}</nav><div id="sprint"></div>`,
      after() {
        const root = $('#sprint'), used = new Set();
        let n = 0, correct = 0, timer = null, startRating = track(subject).r, totalDelta = 0, t0 = 0, times = [];

        const pickNext = () => {
          const rt = track(subject), target = rt.r + rnd(-60, 150);
          const cands = []; for (let i = 0; i < 30; i++) { const c = all[rnd(0, all.length - 1)]; if (!used.has(c.q)) cands.push(c); }
          const cand = (cands.length ? cands : all).sort((a, b) => Math.abs(a.d - target) - Math.abs(b.d - target))[0];
          used.add(cand.q);
          return { ...cand, inst: resolveQ(cand.q) };
        };

        const header = num => {
          const t = track(subject);
          return `<div class="sprinthead"><div><b>${esc(subject === 'All' ? 'Mixed sprint' : subject)}</b><small class="muted"> Question ${num} of ${LEN}</small></div><div class="rt-now"><span class="muted">Rating</span> <b>${Math.round(t.r)}</b></div></div><div class="timer"><i id="tbar"></i></div>`;
        };

        const ask = () => {
          if (n >= LEN) return end();
          const item = pickNext(), q = item.inst;
          root.innerHTML = `${header(n + 1)}<div class="qcard"><div class="qnum">Difficulty ${item.d} · ${esc(item.c.title)}</div><div class="qtext">${esc(q.q)}</div>
            ${q.type === 'mc' ? `<div class="opts">${q.options.map((o, k) => `<button class="opt btn" data-k="${k}">${esc(o)}</button>`).join('')}</div>` : '<form id="tf" class="inline"><input class="ans" autocomplete="off" placeholder="Answer" autofocus><button class="btn primary">Submit</button></form>'}
            <div class="fb" id="fb"></div></div>`;
          t0 = Date.now();
          const bar = $('#tbar'); bar.style.transition = 'none'; bar.style.width = '100%';
          requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.transition = `width ${TIME}s linear`; bar.style.width = '0%'; }));
          clearTimeout(timer); timer = setTimeout(() => answer(item, null), TIME * 1000);
          if (q.type === 'mc') root.onclick = e => { const b = e.target.closest('[data-k]'); if (b) answer(item, b.dataset.k); };
          else { root.onclick = null; $('#tf').onsubmit = e => { e.preventDefault(); const v = $('.ans').value.trim(); if (v) answer(item, v); }; $('.ans').focus(); }
        };

        const answer = (item, val) => {
          clearTimeout(timer); root.onclick = null;
          const q = item.inst, secs = (Date.now() - t0) / 1000;
          const ok = val !== null && isCorrect(q, val), fast = secs <= TIME / 2;
          const delta = apply(subject, item.d, ok, fast);
          totalDelta += delta; if (ok) correct++; times.push(secs); n++;
          Store.save();
          const shown = q.type === 'mc' ? q.options[q.answer] : q.accept[0];
          root.innerHTML = `${header(n)}<div class="qcard ${ok ? 'done' : ''}"><div class="qtext">${esc(q.q)}</div>
            <div class="fb ${ok ? 'good' : 'bad'}"><b>${val === null ? 'Time expired' : ok ? 'Correct' : 'Incorrect'}</b> · rating ${delta >= 0 ? '+' : ''}${delta.toFixed(1)}${ok ? '' : ` · answer: ${esc(shown)}`}<br>${esc(q.explain || '')}</div>
            <div class="qbar"><button class="btn primary" id="nx">${n >= LEN ? 'See results' : 'Next question'}</button></div></div>`;
          $('#nx').onclick = ask; $('#nx').focus();
        };

        const end = () => {
          const rt = R(), t = track(subject);
          rt.history.push({ t: Date.now(), subject, r: Math.round(t.r), delta: totalDelta, score: correct, total: LEN });
          if (subject !== 'All') rt.history.push({ t: Date.now(), subject: 'All', r: Math.round(track('All').r), delta: totalDelta, score: correct, total: LEN, hidden: true });
          rt.history = rt.history.slice(-300);
          Store.touch();
          Game.award(correct * 6);
          Game.event('sprint', { rating: t.r });
          Game.commit();
          const avg = times.reduce((a, b) => a + b, 0) / (times.length || 1);
          root.innerHTML = `<h1>Sprint complete</h1><div class="kpis"><div class="kpi"><b>${correct}/${LEN}</b><span>correct</span></div><div class="kpi"><b>${Math.round(t.r)}</b><span>new rating (${totalDelta >= 0 ? '+' : ''}${totalDelta.toFixed(1)})</span></div><div class="kpi"><b>${avg.toFixed(1)}s</b><span>average time</span></div><div class="kpi"><b>${tier(t.r)}</b><span>tier</span></div></div>
            <div class="row-actions"><a class="btn primary" href="#/rated/${encodeURIComponent(subject)}" id="again">Play again</a><a class="btn" href="#/rated">Back to ratings</a></div>`;
          $('#again').onclick = e => { e.preventDefault(); render(); };
        };

        ask();
      },
    };
  }

  return { viewHome, viewSprint, summaryHtml, rating: () => Math.round(track('All').r), subjectRating: s => Math.round(track(s).r), peak: () => track('All').peak };
})();
