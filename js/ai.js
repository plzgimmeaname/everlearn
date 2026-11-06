// openrouter client: sign-in creates a key for the user's own account (oauth pkce)
const AI = (() => {
  const API = 'https://openrouter.ai/api/v1';
  const KEY = 'everlearn.orkey', VER = 'everlearn.pkce', CUSTOM = 'everlearn.models';
  const b64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  let pool = null, rr = 0;

  const get = k => { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } };
  const set = (k, v) => { try { v ? localStorage.setItem(k, v) : localStorage.removeItem(k); } catch (e) { /* blocked */ } };

  const callbackUrl = () => location.origin + location.pathname;
  const canLogin = () => /^https?:$/.test(location.protocol) && !!(crypto && crypto.subtle);

  async function login() {
    if (!canLogin()) throw new Error('Sign-in needs the site to be served over http://localhost or https (not opened as a file).');
    const verifier = b64(crypto.getRandomValues(new Uint8Array(48)));
    const challenge = b64(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));
    sessionStorage.setItem(VER, verifier);
    location.href = `https://openrouter.ai/auth?callback_url=${encodeURIComponent(callbackUrl())}&code_challenge=${challenge}&code_challenge_method=S256`;
  }

  // call on page load: swaps the ?code= from openrouter for an api key
  async function finishLogin() {
    const code = new URLSearchParams(location.search).get('code'), verifier = sessionStorage.getItem(VER);
    if (!code || !verifier) return null;
    history.replaceState(null, '', callbackUrl() + '#/studio');
    sessionStorage.removeItem(VER);
    const r = await fetch(API + '/auth/keys', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, code_verifier: verifier, code_challenge_method: 'S256' }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.key) throw new Error(j.error?.message || 'Could not create a key (' + r.status + ')');
    set(KEY, j.key);
    return j.key;
  }

  async function freeModels() {
    if (pool) return pool;
    const custom = get(CUSTOM).split(',').map(s => s.trim()).filter(Boolean);
    if (custom.length) return (pool = custom);
    const r = await fetch(API + '/models');
    const { data } = await r.json();
    const bad = /safety|guard|code|embed|lyria|image|audio|whisper|vl\b|omni/i;
    const size = id => { const m = id.match(/(\d+(?:\.\d+)?)b/i); return m ? parseFloat(m[1]) : 0; };
    pool = data
      .filter(m => m.pricing && +m.pricing.prompt === 0 && +m.pricing.completion === 0 && m.id.endsWith(':free'))
      .filter(m => /->text$/.test((m.architecture || {}).modality || 'text->text') && !bad.test(m.id) && (m.context_length || 0) >= 16000 && (size(m.id) === 0 || size(m.id) >= 20))
      .sort((a, b) => size(b.id) - size(a.id) || b.context_length - a.context_length)
      .map(m => m.id).slice(0, 6);
    if (!pool.length) pool = ['openrouter/free'];
    return pool;
  }

  function extractJson(text) {
    const t = String(text || '').replace(/<think>[\s\S]*?<\/think>/g, '').replace(/```(?:json)?/gi, '');
    const a = t.indexOf('{'), b = t.lastIndexOf('}');
    if (a < 0 || b <= a) throw new Error('no json in reply');
    return JSON.parse(t.slice(a, b + 1));
  }

  // wantJson: parse a json object from the reply and retry on bad output
  async function run(messages, { wantJson = false, max = 9000, temperature = 0.4, tries = 6 } = {}) {
    const key = get(KEY);
    if (!key) throw new Error('Connect your OpenRouter account first.');
    const models = await freeModels(), start = rr++;
    let last;
    for (let i = 0; i < tries; i++) {
      const model = models[(start + i) % models.length];
      try {
        const r = await fetch(API + '/chat/completions', {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json', 'X-Title': 'Everlearn' },
          body: JSON.stringify({ model, messages, temperature, max_tokens: max }),
        });
        if (r.status === 401) { set(KEY, ''); throw Object.assign(new Error('Your OpenRouter key was rejected. Please reconnect.'), { fatal: true }); }
        if (r.status === 402) throw Object.assign(new Error('OpenRouter says this account needs credits for that request.'), { fatal: true });
        if (r.status === 429 || r.status >= 500) { last = new Error(`${model}: busy (${r.status})`); await sleep(3000 * (i + 1)); continue; }
        const j = await r.json();
        if (j.error) { last = new Error(`${model}: ${j.error.message || 'error'}`); await sleep(2000); continue; }
        const text = j.choices[0].message.content || '';
        return { model, text, json: wantJson ? extractJson(text) : null };
      } catch (e) { if (e.fatal) throw e; last = e; await sleep(1500); }
    }
    throw last || new Error('The free models are busy. Try again in a minute.');
  }

  return {
    hasKey: () => !!get(KEY), key: () => get(KEY), setKey: k => set(KEY, String(k).trim()), disconnect: () => set(KEY, ''),
    canLogin, login, finishLogin, freeModels, run,
    customModels: () => get(CUSTOM), setCustomModels: v => { set(CUSTOM, v); pool = null; },
    json: (system, user, o) => run([{ role: 'system', content: system }, { role: 'user', content: user }], { ...o, wantJson: true }),
  };
})();
