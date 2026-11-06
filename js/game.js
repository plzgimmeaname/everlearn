// gamification: xp, levels, daily goal, quests, badges, celebrations
const Game = (() => {
  const TITLES = ['Beginner', 'Novice', 'Learner', 'Practitioner', 'Proficient', 'Advanced', 'Specialist', 'Expert', 'Master', 'Distinguished'];
  const DAILY_GOAL = 50;
  const today = () => new Date().toLocaleDateString('en-CA');
  const queue = [];

  const levelAt = xp => Math.floor(Math.sqrt(Math.max(0, xp) / 50)) + 1;
  const xpFor = l => 50 * (l - 1) ** 2;
  function level(xp) {
    const l = levelAt(xp), lo = xpFor(l), hi = xpFor(l + 1);
    return { level: l, title: l > 10 ? 'Fellow' : TITLES[l - 1], into: xp - lo, need: hi - lo, pct: Math.round((xp - lo) / (hi - lo) * 100) };
  }

  const G = () => { const S = Store.get(); return (S.game = Object.assign({ days: {}, badges: {}, counters: {}, subjects: {} }, S.game)); };
  const day = () => { const g = G(); return (g.days[today()] = Object.assign({ xp: 0, lessons: 0, cards: 0, perfect: 0, tests: 0, claimed: {} }, g.days[today()])); };

  const QUESTS = [
    { id: 'lessons1', text: 'Finish a lesson', stat: 'lessons', goal: 1, xp: 15 },
    { id: 'lessons2', text: 'Finish 2 lessons', stat: 'lessons', goal: 2, xp: 30 },
    { id: 'cards10', text: 'Review 10 flashcards', stat: 'cards', goal: 10, xp: 20 },
    { id: 'perfect1', text: 'Get a perfect quiz score', stat: 'perfect', goal: 1, xp: 25 },
    { id: 'xp100', text: 'Earn 100 XP', stat: 'xp', goal: 100, xp: 30 },
    { id: 'test1', text: 'Pass a unit test or challenge', stat: 'tests', goal: 1, xp: 40 },
  ];
  function todaysQuests() {
    const seed = today().split('-').reduce((a, b) => a * 31 + +b, 7);
    const out = [];
    for (let i = 0; out.length < 3; i++) { const q = QUESTS[(seed + i * 5) % QUESTS.length]; if (!out.includes(q)) out.push(q); }
    return out;
  }

  const BADGES = [
    { id: 'sprint1', mark: 'R', name: 'First rated sprint', desc: 'Complete a rated sprint', ok: g => g.counters.sprints >= 1 },
    { id: 'r1200', mark: '1200', name: 'Rating 1200', desc: 'Reach an overall rating of 1200', ok: () => Rated.peak() >= 1200 },
    { id: 'r1500', mark: '1500', name: 'Rating 1500', desc: 'Reach an overall rating of 1500', ok: () => Rated.peak() >= 1500 },
    { id: 'r1800', mark: '1800', name: 'Rating 1800', desc: 'Reach an overall rating of 1800', ok: () => Rated.peak() >= 1800 },
    { id: 'exam1', mark: 'EX', name: 'First practice exam', desc: 'Complete an AP practice exam section', ok: g => g.counters.exams >= 1 },
    { id: 'first', mark: '1', name: 'First lesson', desc: 'Complete a lesson', ok: g => g.counters.lessons >= 1 },
    { id: 'five', mark: '5', name: 'Five lessons', desc: 'Complete 5 lessons', ok: g => g.counters.lessons >= 5 },
    { id: 'twenty', mark: '25', name: 'Twenty-five lessons', desc: 'Complete 25 lessons', ok: g => g.counters.lessons >= 25 },
    { id: 'perfect', mark: '100', name: 'Full marks', desc: 'Complete a quiz with no errors or hints', ok: g => g.counters.perfect >= 1 },
    { id: 'perfect10', mark: '10x', name: 'Ten full marks', desc: 'Ten quizzes with no errors or hints', ok: g => g.counters.perfect >= 10 },
    { id: 'tests', mark: 'T', name: 'Assessed', desc: 'Complete a unit test or challenge', ok: g => g.counters.tests >= 1 },
    { id: 'cards', mark: '50', name: 'Fifty cards reviewed', desc: 'Review 50 flashcards', ok: g => g.counters.cards >= 50 },
    { id: 'streak3', mark: '3d', name: 'Three-day streak', desc: 'Study three days in a row', ok: () => Store.streak() >= 3 },
    { id: 'streak7', mark: '7d', name: 'Seven-day streak', desc: 'Study seven days in a row', ok: () => Store.streak() >= 7 },
    { id: 'streak30', mark: '30d', name: 'Thirty-day streak', desc: 'Study thirty days in a row', ok: () => Store.streak() >= 30 },
    { id: 'lvl5', mark: 'L5', name: 'Level 5', desc: 'Reach level 5', ok: () => levelAt(Store.get().points) >= 5 },
    { id: 'lvl10', mark: 'L10', name: 'Level 10', desc: 'Reach level 10', ok: () => levelAt(Store.get().points) >= 10 },
    { id: 'xp1000', mark: '1K', name: '1,000 XP', desc: 'Earn 1,000 XP', ok: () => Store.get().points >= 1000 },
    { id: 'goal', mark: 'G', name: 'Daily goal', desc: 'Reach your daily XP goal', ok: () => day().xp >= DAILY_GOAL },
    { id: 'quest', mark: 'Q', name: 'Daily quest', desc: 'Complete a daily quest', ok: g => g.counters.quests >= 1 },
    { id: 'polymath', mark: '3S', name: 'Three subjects', desc: 'Complete lessons in 3 subjects', ok: g => Object.keys(g.subjects).length >= 3 },
    { id: 'honors', mark: 'H', name: 'Honors lesson', desc: 'Complete an Honors lesson', ok: g => g.counters.honors >= 1 },
    { id: 'ap', mark: 'AP', name: 'AP lesson', desc: 'Complete an AP lesson', ok: g => g.counters.ap >= 1 },
    { id: 'course', mark: 'C', name: 'Course completed', desc: 'Complete every lesson in a course', ok: g => g.counters.courses >= 1 },
    { id: 'ai', mark: 'AI', name: 'AI course', desc: 'Generate a course with AI', ok: g => g.counters.aicourses >= 1 },
    { id: 'notebook', mark: 'N', name: 'First source', desc: 'Add a source to a notebook', ok: g => g.counters.sources >= 1 },
  ];

  const bump = (k, n = 1) => { const g = G(); g.counters[k] = (g.counters[k] || 0) + n; };
  const toast = (title, sub) => queue.push({ title, sub });

  function award(n) {
    if (!n) return;
    const S = Store.get(), before = levelAt(S.points);
    S.points += n;
    day().xp += n;
    Store.touch();
    const after = levelAt(S.points);
    if (after > before) { toast(`Level ${after}: ${level(S.points).title}`, 'Level increased'); }
  }

  // info: {score, first, course, lesson}; types: lesson, test, card, perfect-handled inside
  function event(type, info = {}) {
    const g = G(), d = day();
    if (type === 'lesson') {
      d.lessons++; bump('lessons');
      if (info.score >= 1) { d.perfect++; bump('perfect'); toast('Full marks', 'Quiz completed with no errors or hints'); }
      const c = info.course;
      if (c) {
        g.subjects[c.subject] = 1;
        if (c.tier === 'AP') bump('ap'); else if (c.tier === 'Honors') bump('honors');
        if (info.first && courseStats(c).done >= courseStats(c).total) { bump('courses'); toast('Course completed', c.title); }
      }
    } else if (type === 'test') { d.tests++; bump('tests'); if (info.score >= 1) { d.perfect++; bump('perfect'); } }
    else if (type === 'card') { d.cards++; bump('cards'); }
    else if (type === 'sprint') bump('sprints');
    else if (type === 'exam') bump('exams');
    else if (type === 'aicourse') bump('aicourses');
    else if (type === 'source') bump('sources');
    check();
  }

  function check() {
    const g = G(), d = day();
    todaysQuests().forEach(q => {
      const have = q.stat === 'xp' ? d.xp : d[q.stat];
      if (have >= q.goal && !d.claimed[q.id]) {
        d.claimed[q.id] = true; bump('quests');
        const S = Store.get(); S.points += q.xp; d.xp += q.xp;
        toast('Quest completed', `${q.text} (+${q.xp} XP)`);
      }
    });
    for (let pass = 0; pass < 2; pass++) {
      BADGES.forEach(b => { if (!g.badges[b.id] && b.ok(g)) { g.badges[b.id] = Date.now(); toast(`Badge earned: ${b.name}`, b.desc); } });
    }
  }

  function showToasts() {
    let box = document.getElementById('toasts');
    if (!box) { box = document.createElement('div'); box.id = 'toasts'; box.setAttribute('aria-live', 'polite'); document.body.appendChild(box); }
    queue.splice(0).forEach((t, i) => {
      const el = document.createElement('div');
      el.className = 'toast';
      el.style.animationDelay = i * 0.25 + 's';
      el.innerHTML = `<span><b>${esc(t.title)}</b><small>${esc(t.sub || '')}</small></span>`;
      box.appendChild(el);
      setTimeout(() => el.remove(), 5000 + i * 250);
    });
  }

  // call once after a batch of award/event calls
  function commit() {
    check();
    Store.save();
    const h = document.querySelector('.stats'); if (h) h.outerHTML = header();
    if (queue.length) showToasts();
  }

  function ring(pct, label) {
    return `<div class="ring" style="--p:${Math.min(100, pct)}"><span>${label}</span></div>`;
  }

  function dashboardHtml() {
    const S = Store.get(), L = level(S.points), d = day(), g = G();
    const quests = todaysQuests();
    const strip = Array.from({ length: 28 }, (_, i) => {
      const dt = new Date(Date.now() - (27 - i) * 864e5).toLocaleDateString('en-CA'), x = (g.days[dt] || {}).xp || 0;
      return `<i class="heat h${x === 0 ? 0 : x < 25 ? 1 : x < 60 ? 2 : x < 120 ? 3 : 4}" title="${dt}: ${x} XP"></i>`;
    }).join('');
    const earned = BADGES.filter(b => g.badges[b.id]);
    return `<div class="gamebox">
      ${Rated.summaryHtml()}
      <div class="panel lvl"><div class="lvlnum">${L.level}</div><div class="grow"><b>${esc(L.title)}</b><div class="cbar wide"><i style="width:${L.pct}%"></i></div><small class="muted">${L.into} / ${L.need} XP to level ${L.level + 1} · ${S.points} XP total</small></div></div>
      <div class="panel goalbox">${ring(d.xp / DAILY_GOAL * 100, `${Math.min(d.xp, DAILY_GOAL)}/${DAILY_GOAL}`)}<div><b>Daily goal</b><br><small class="muted">${d.xp >= DAILY_GOAL ? 'Goal reached' : `${DAILY_GOAL - d.xp} XP to go`}</small></div></div>
      <div class="panel"><h3>Today's quests</h3>${quests.map(q => { const have = Math.min(q.goal, q.stat === 'xp' ? d.xp : d[q.stat]); return `<div class="quest ${d.claimed[q.id] ? 'done' : ''}"><span>${esc(q.text)}</span><small class="muted">${have}/${q.goal} · +${q.xp} XP</small></div>`; }).join('')}</div>
      <div class="panel"><h3>Last 4 weeks</h3><div class="heatmap">${strip}</div><small class="muted">${Store.streak()}-day streak</small></div>
      <div class="panel wide"><div class="sec-head"><h3>Badges (${earned.length}/${BADGES.length})</h3></div><div class="badges">${BADGES.map(b => `<div class="bdg ${g.badges[b.id] ? 'on' : ''}" title="${esc(b.desc)}"><span class="mk">${esc(b.mark)}</span><b>${esc(b.name)}</b><small>${esc(b.desc)}</small></div>`).join('')}</div></div></div>`;
  }

  return { level, award, event, commit, dashboardHtml, goal: DAILY_GOAL, todayXp: () => day().xp };
})();
