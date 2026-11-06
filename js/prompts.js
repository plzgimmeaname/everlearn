// prompts shared by the browser generator and tools/generate.cjs
(function (root) {
  const SYSTEM = `You are an expert curriculum designer writing free, accurate lessons for a Khan Academy style website.
Reply with ONE valid JSON object and nothing else: no markdown fences, no commentary.
Rules: plain text and unicode only (use x², ½, √, π, not LaTeX). You may use **bold** and \`code\` inline. Be factually correct and age appropriate.
Write at the reading level of the stated grade band. Be specific and detailed, never vague.`;

  const DEPTH = {
    'K-2': { words: '150 to 250', paras: '3 to 4', mc: 4, sa: 2, cards: '4 to 6' },
    '3-5': { words: '350 to 500', paras: '4 to 5', mc: 5, sa: 2, cards: '5 to 7' },
    '6-8': { words: '600 to 800', paras: '5 to 6', mc: 6, sa: 3, cards: '6 to 8' },
    '9-12': { words: '800 to 1100', paras: '6 to 8', mc: 6, sa: 4, cards: '7 to 9' },
    College: { words: '1000 to 1400', paras: '7 to 9', mc: 7, sa: 4, cards: '8 to 10' },
  };

  const TIER = {
    Honors: { words: '1000 to 1500', paras: '8 to 10', mc: 7, sa: 4, cards: '8 to 10' },
    AP: { words: '1200 to 1800', paras: '9 to 12', mc: 8, sa: 4, cards: '10 to 14' },
  };
  const depthFor = c => TIER[c.tier] || DEPTH[c.band] || DEPTH['9-12'];
  const tierNote = c => (c.tier === 'AP'
    ? `This is an AP (Advanced Placement) course. Align with the College Board course framework for "${c.title}": use its terminology and the skills the exam tests. Questions should look like AP exam items (stimulus-based, multi-step, plausible distractors), and the worked example should model a free-response answer with the reasoning an exam reader would reward.\n`
    : c.tier === 'Honors' ? 'This is an honors course: more rigorous and abstract than a standard course, with multi-step problems and deeper reasoning, but not college-level.\n' : '');

  const srcBlock = src => (src ? `\nBase the course on these source excerpts. Stay faithful to them and only add clarifying context:\n"""\n${src}\n"""\n` : '');

  function outlinePrompt(c, nUnits, nLessons, src) {
    return `Design the outline for the course "${c.title}" (subject: ${c.subject}, level: ${c.level || c.band}, grade band: ${c.band}).
${tierNote(c)}${c.focus ? 'Units and topics to cover, in this order: ' + c.focus + '\n' : ''}${srcBlock(src)}Return JSON: {"blurb":"one sentence","tags":["8-12 lowercase search keywords"],"units":[{"title":"...","lessons":["lesson title", ...]}]}
Use exactly ${nUnits} units with ${nLessons} lessons each, ordered from foundations to advanced. Lesson titles must be specific topics.`;
  }

  function lessonPrompt(c, unit, title, src) {
    const d = depthFor(c);
    return `Write the lesson "${title}" from the unit "${unit}" of the course "${c.title}" (subject: ${c.subject}, grade band: ${c.band}).
${tierNote(c)}${srcBlock(src)}Return JSON exactly in this shape:
{"title":"${title.replace(/"/g, '\\"')}","minutes":10,"searchTerm":"short web search phrase for this topic",
 "explanation":["paragraph 1","paragraph 2"],
 "keyTerms":[{"term":"...","definition":"..."}],
 "example":{"problem":"a worked example or case study","steps":["step 1","step 2"],"answer":"final answer or takeaway"},
 "quiz":[
  {"question":"...","options":["A","B","C","D"],"answerIndex":0,"explanation":"why","hint":"short hint"},
  {"question":"...","accepted":["short answer","alternate form"],"explanation":"why","hint":"short hint"}
 ],
 "flashcards":[{"front":"...","back":"..."}]}
Depth requirements:
- "explanation": ${d.paras} paragraphs, ${d.words} words in total. Teach from the ground up: define every idea, explain WHY it works, give at least two concrete examples, and point out common mistakes and misconceptions.
- "keyTerms": 3 to 6 terms.
- "example": a fully worked problem with every step shown (4 or more steps where it applies).
- "quiz": ${d.mc} multiple choice questions (4 options each, correct index spread across 0-3, wrong options should be plausible mistakes) and ${d.sa} short-answer questions where "accepted" lists every reasonable form of a one-word or number answer. Mix easy, medium and hard. Every explanation says why the answer is right.
- "flashcards": ${d.cards}.
Short-answer questions must have one unambiguous answer.`;
  }

  function deepenPrompt(c, l) {
    const base = (l.body || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 3500);
    return `Expand the lesson "${l.title}" from the course "${c.title}" (subject: ${c.subject}, grade band: ${c.band}${c.tier && c.tier !== 'Standard' ? ', ' + c.tier : ''}) into an in-depth treatment.
${tierNote(c)}Current lesson text, for context (do not repeat it, go deeper):
"""
${base}
"""
Return JSON exactly in this shape:
{"sections":[{"heading":"...","paragraphs":["...","..."]}],
 "examples":[{"problem":"...","steps":["step 1","step 2"],"answer":"..."}],
 "mistakes":["a common misconception and the correction"],
 "tips":["a study or exam tip"],
 "reading":[{"resource":"Khan Academy | OpenStax | LibreTexts | MIT OpenCourseWare | YouTube | Wikipedia","note":"the topic or chapter title to look for"}]}
Requirements: 5 to 8 sections, 1,200 to 1,800 words in total. Build intuition first, then rigor: definitions, why each idea works, connections to other topics, edge cases and history where relevant. Include 3 to 4 fully worked examples with every step shown, 4 to 6 common mistakes, and 3 to 5 tips. Write everything in your own words; do not copy text from any source. For "reading", name only the resource and the topic to search for. Never invent URLs, page numbers or quotations.`;
  }

  const api = { SYSTEM, DEPTH, outlinePrompt, lessonPrompt, deepenPrompt };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Prompts = api;
})(typeof window !== 'undefined' ? window : globalThis);
