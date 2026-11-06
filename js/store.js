const Store = (() => {
  const KEY = 'everlearn.v1';
  const blank = () => ({ name: '', points: 0, streak: { last: '', count: 0 }, prog: {}, tests: {}, cards: {}, custom: [], notebooks: [], aiCourses: [], game: { days: {}, badges: {}, counters: {}, subjects: {} }, exams: {}, fw: {}, deep: {}, theme: '', updatedAt: 0 });
  let S = blank();
  const listeners = [];

  try { S = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {  }

  const today = () => new Date().toLocaleDateString('en-CA');
  const save = () => {
    S.updatedAt = Date.now();
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {  }
    listeners.forEach(f => f(S));
  };

  return {
    get: () => S,
    save,
    onSave: f => listeners.push(f),
    replace(next) { S = Object.assign(blank(), next); save(); },
    reset() { S = blank(); save(); },
    export: () => JSON.stringify(S, null, 2),
    touch() {
      const t = today();
      if (S.streak.last === t) return;
      const y = new Date(Date.now() - 864e5).toLocaleDateString('en-CA');
      S.streak.count = S.streak.last === y ? S.streak.count + 1 : 1;
      S.streak.last = t;
    },
    streak() {
      const t = today(), y = new Date(Date.now() - 864e5).toLocaleDateString('en-CA');
      return S.streak.last === t || S.streak.last === y ? S.streak.count : 0;
    },
  };
})();
