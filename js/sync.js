const Sync = (() => {
  const cfg = window.EVERLEARN_CONFIG && window.EVERLEARN_CONFIG.firebase;
  const V = '10.12.2';
  let db = null, auth = null, user = null, timer = null, pulling = false;
  const status = { enabled: !!cfg, user: null };

  const load = src => new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s);
  });

  async function init(onChange) {
    if (!cfg) return;
    const base = `https://www.gstatic.com/firebasejs/${V}/firebase-`;
    await load(base + 'app-compat.js');
    await Promise.all([load(base + 'auth-compat.js'), load(base + 'firestore-compat.js')]);
    firebase.initializeApp(cfg);
    auth = firebase.auth(); db = firebase.firestore();
    auth.onAuthStateChanged(async u => {
      user = u; status.user = u ? { name: u.displayName, email: u.email } : null;
      if (u) await pull();
      onChange && onChange();
    });
    Store.onSave(() => { if (!user || pulling) return; clearTimeout(timer); timer = setTimeout(push, 1500); });
  }

  async function pull() {
    pulling = true;
    try {
      const snap = await db.collection('users').doc(user.uid).get();
      if (snap.exists) {
        const remote = JSON.parse(snap.data().json);
        const local = Store.get();
        if ((remote.updatedAt || 0) > (local.updatedAt || 0)) Store.replace(remote);
        else await push();
      } else await push();
    } finally { pulling = false; }
  }
  async function push() {
    if (!user) return;
    await db.collection('users').doc(user.uid).set({ json: Store.export() });
  }

  return {
    status, init,
    signIn: () => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()),
    signOut: () => auth.signOut(),
  };
})();
