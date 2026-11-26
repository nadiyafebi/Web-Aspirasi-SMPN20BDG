import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth.jsx';

const css = `
.al {
  --hm-green: #24574a;
  max-width: 420px;
  width: 100%;
  margin: 0 auto;
}
.al h1, .al h2 { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }

.al-back {
  background: none;
  border: 0;
  padding: 6px;
  cursor: pointer;
  color: var(--ink);
  display: grid;
  place-items: center;
  margin-bottom: 4px;
}
.al-brand { text-align: center; margin-bottom: 22px; }
.al-brand h1 {
  margin: 0;
  font-size: 1.7rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: var(--hm-green);
}
.al-brand p { margin: 2px 0 0; font-size: 0.72rem; color: var(--muted); }

.al-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 20px 16px;
  display: grid;
  gap: 14px;
}
.al-card h2 { margin: 0; font-size: 1.05rem; font-weight: 800; color: var(--ink); }
.al-sub { margin: -8px 0 0; font-size: 0.72rem; color: var(--muted); }

.al-field { display: grid; gap: 6px; font-size: 0.8rem; font-weight: 700; }
.al-field input {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 12px;
  font-size: 0.85rem;
  font-weight: 400;
}
.al-pass { position: relative; }
.al-pass input { width: 100%; padding-right: 42px; }
.al-eye {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: 0;
  padding: 6px;
  cursor: pointer;
  color: var(--muted);
  display: grid;
  place-items: center;
}

.al-error {
  background: color-mix(in srgb, var(--danger) 12%, transparent);
  color: var(--danger);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 0.8rem;
}
.al-submit {
  width: 100%;
  background: var(--hm-green);
  color: #fff;
  border: 0;
  border-radius: 10px;
  padding: 14px;
  font: inherit;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
}
.al-submit:disabled { opacity: 0.6; cursor: wait; }
.al-home {
  display: block;
  text-align: center;
  margin-top: 22px;
  color: var(--hm-green);
  font-weight: 700;
  font-size: 0.8rem;
  text-decoration: none;
}
`;

export default function AdminLogin() {
  const { token, login } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [lihat, setLihat] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (token) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      nav('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{css}</style>

      <section className="al">
        <button type="button" className="al-back" onClick={() => nav('/')} aria-label="Kembali">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div className="al-brand">
          <h1>ASPIRASI</h1>
          <p>SMPN 2 Bandung</p>
        </div>

        <form className="al-card" onSubmit={submit}>
          <h2>Masuk Guru BK</h2>
          <p className="al-sub">Khusus pengelola sekolah.</p>

          <label className="al-field">
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="contoh : bk7"
              autoComplete="username"
              autoFocus
              required
            />
          </label>

          <label className="al-field">
            Kata sandi
            <span className="al-pass">
              <input
                type={lihat ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                autoComplete="current-password"
                required
              />
              <button type="button" className="al-eye" onClick={() => setLihat(!lihat)} aria-label="Tampilkan kata sandi">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {lihat ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <path d="m1 1 22 22" />
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </svg>
              </button>
            </span>
          </label>

          {error && <div className="al-error">{error}</div>}

          <button className="al-submit" disabled={loading}>
            {loading ? 'Masuk…' : 'Masuk'}
          </button>
        </form>

        <Link to="/" className="al-home">Kembali ke halaman siswa</Link>
      </section>
    </>
  );
}