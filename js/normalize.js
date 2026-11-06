// turns raw ai-written course json into the course objects the app renders
(function (root) {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`(.+?)`/g, '<code>$1</code>');
  const str = (v, max = 600) => (typeof v === 'string' || typeof v === 'number' ? String(v).trim().slice(0, max) : '');
  const slug = s => str(s, 60).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const BANDS = ['K-2', '3-5', '6-8', '9-12', 'College'];
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#14b8a6', '#8b5cf6', '#3b82f6', '#ef4444', '#22c55e', '#f97316'];

  function question(q) {
    if (!q || typeof q !== 'object') return null;
    const text = str(q.question || q.q, 400);
    if (!text) return null;
    const explain = str(q.explanation || q.explain, 500), hint = str(q.hint, 300);
    const opts = Array.isArray(q.options) ? q.options.map(o => str(o, 200)).filter(Boolean) : [];
    if (opts.length >= 2) {
      let a = Number.isInteger(q.answerIndex) ? q.answerIndex : Number.isInteger(q.answer) ? q.answer : -1;
      if (a < 0 || a >= opts.length) return null;
      return { type: 'mc', q: text, options: opts, answer: a, explain };
    }
    const acc = (Array.isArray(q.accepted) ? q.accepted : Array.isArray(q.accept) ? q.accept : [q.answer]).map(a => str(a, 100)).filter(Boolean);
    if (!acc.length) return null;
    return { type: 'text', q: text, accept: acc, explain, hint };
  }

  function lessonBody(l) {
    const paras = (Array.isArray(l.explanation) ? l.explanation : [l.explanation]).map(p => str(p, 1500)).filter(Boolean);
    let h = paras.map(p => `<p>${inline(p)}</p>`).join('');
    const terms = (Array.isArray(l.keyTerms) ? l.keyTerms : []).filter(t => t && str(t.term) && str(t.definition));
    if (terms.length) h += `<h3>Key terms</h3><ul>${terms.map(t => `<li><b>${esc(str(t.term, 80))}</b>: ${inline(str(t.definition, 300))}</li>`).join('')}</ul>`;
    return h;
  }

  function lessonExample(l) {
    const e = l.example;
    if (!e || typeof e !== 'object' || !str(e.problem)) return '';
    const steps = (Array.isArray(e.steps) ? e.steps : []).map(s => str(s, 400)).filter(Boolean);
    return `<b>${inline(str(e.problem, 500))}</b>${steps.length ? `<ol>${steps.map(s => `<li>${inline(s)}</li>`).join('')}</ol>` : ''}${str(e.answer) ? `<p><b>Answer:</b> ${inline(str(e.answer, 300))}</p>` : ''}`;
  }

  function normalizeCourse(raw, index = 0) {
    if (!raw || typeof raw !== 'object') return null;
    const title = str(raw.title, 100), id = slug(raw.id || title);
    if (!title || !id || !Array.isArray(raw.units)) return null;
    const used = new Set();
    const units = raw.units.map(u => {
      const lessons = (Array.isArray(u && u.lessons) ? u.lessons : []).map(l => {
        const lt = str(l && l.title, 120);
        if (!lt) return null;
        const quiz = (Array.isArray(l.quiz) ? l.quiz : []).map(question).filter(Boolean);
        const cards = (Array.isArray(l.flashcards) ? l.flashcards : []).map(c => [str(c && c.front, 200), str(c && c.back, 400)]).filter(c => c[0] && c[1]);
        if (quiz.length < 2 || !Array.isArray(l.explanation) && !str(l.explanation)) return null;
        let lid = slug(l.id || lt) || 'lesson';
        for (let n = 2; used.has(lid); n++) lid = slug(l.id || lt) + '-' + n;
        used.add(lid);
        const out = {
          id: lid, title: lt, minutes: Math.min(30, Math.max(3, parseInt(l.minutes, 10) || 8)),
          q: str(l.searchTerm, 100) || `${title} ${lt}`, res: ['khan', 'youtube', 'openstax', 'libretexts', 'quizlet'],
          body: lessonBody(l), quiz, cards,
        };
        const ex = lessonExample(l); if (ex) out.example = ex;
        return out;
      }).filter(Boolean);
      return lessons.length && str(u.title) ? { title: str(u.title, 100), lessons } : null;
    }).filter(Boolean);
    if (!units.length) return null;
    const band = BANDS.includes(raw.band) ? raw.band : '9-12';
    const tier = ['Honors', 'AP'].includes(raw.tier) ? raw.tier : 'Standard';
    return {
      id, title, color: COLORS[index % COLORS.length], subject: str(raw.subject, 40) || 'General', band,
      tier, level: str(raw.level, 40) || (tier !== 'Standard' ? tier : band), blurb: str(raw.blurb, 200),
      tags: (Array.isArray(raw.tags) ? raw.tags : []).map(t => str(t, 40).toLowerCase()).filter(Boolean).slice(0, 15),
      channels: [], units, ai: true,
    };
  }

  function deepHtml(d) {
    if (!d || typeof d !== 'object') return '';
    const list = a => (Array.isArray(a) ? a : []);
    let h = list(d.sections).map(s => `<h3>${esc(str(s && (s.heading || s.h), 150))}</h3>${list(s && (s.paragraphs || s.p)).map(p => `<p>${inline(str(p, 2000))}</p>`).join('')}`).join('');
    h += list(d.examples).map(e => `<div class="callout"><div class="ctitle">Worked example</div><b>${inline(str(e && e.problem, 600))}</b>${list(e && e.steps).length ? `<ol>${list(e.steps).map(s => `<li>${inline(str(s, 500))}</li>`).join('')}</ol>` : ''}${str(e && e.answer) ? `<p><b>Answer:</b> ${inline(str(e.answer, 400))}</p>` : ''}</div>`).join('');
    if (list(d.mistakes).length) h += `<h3>Common mistakes</h3><ul>${list(d.mistakes).map(m => `<li>${inline(str(m, 600))}</li>`).join('')}</ul>`;
    if (list(d.tips).length) h += `<h3>Study and exam tips</h3><ul>${list(d.tips).map(m => `<li>${inline(str(m, 500))}</li>`).join('')}</ul>`;
    if (list(d.reading).length) h += `<h3>Further reading</h3><ul>${list(d.reading).map(r => `<li><b>${esc(str(r && r.resource, 60))}</b>: ${esc(str(r && r.note, 200))}</li>`).join('')}</ul>`;
    return h;
  }

  const api = { normalizeCourse, question, deepHtml, BANDS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Normalize = api;
})(typeof window !== 'undefined' ? window : globalThis);
