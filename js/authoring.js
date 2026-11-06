// authoring helpers: MC, T, G, L, U, course (see readme)
const MC = (q, options, answer, explain = '') => ({ type: 'mc', q, options, answer, explain });
const T = (q, accept, explain = '', hint = '') => ({ type: 'text', q, accept, explain, hint });
const G = gen => ({ type: 'gen', gen });
const L = (id, title, body, quiz, cards, extra = {}) => ({
  id, title, body, quiz, cards, minutes: extra.minutes || 8, q: extra.q || title, res: extra.res || ['khan', 'youtube', 'quizlet'], ...extra,
});
const U = (title, lessons) => ({ title, lessons });
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = arr => arr[rnd(0, arr.length - 1)];
const course = c => (window.COURSES = window.COURSES || []).push(c);

const BANDS = ['K-2', '3-5', '6-8', '9-12', 'College'];
