import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth.jsx';
import { api } from '../../api.js';

const css = `
.pf { --hm-green: #24574a; max-width: 640px; width: 100%; margin: 0 auto; }
.pf-title { margin: 0 0 18px; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-size: 1.1rem; font-weight: 800; color: var(--hm-green); }
.pf-top { text-align: center; margin-bottom: 18px; }
.pf-avatar {
  width: 68px; height: 68px; border-radius: 50%; background: var(--hm-green); color: #fff;
  display: grid; place-items: center; margin: 0 auto 10px; font-weight: 800; font-size: 1.3rem;
}
.pf-name { margin: 0 0 6px; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-size: 1rem; font-weight: 800; color: var(--ink); }
.pf-role { display: inline-block; background: #cfe0d2; color: var(--hm-green); font-size: 0.68rem; font-weight: 700; padding: 3px 12px; border-radius: 999px; }
.pf-list { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; margin-bottom: 18px; }
.pf-item {
  width: 100%; display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px; font: inherit; font-size: 0.8rem; color: var(--ink);
  background: none; border: 0; border-bottom: 1px solid var(--line); text-align: left;
}
.pf-item:last-child { border-bottom: 0; }
button.pf-item { cursor: pointer; }
.pf-val { color: var(--muted); font-size: 0.75rem; }
.pf-switch { width: 40px; height: 22px; border-radius: 99px; border: 0; background: var(--line); position: relative; cursor: pointer; padding: 0; transition: background 0.2s; }
.pf-switch::after { content: ''; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform 0.2s; }
.pf-switch.on { background: var(--hm-green); }
.pf-switch.on::after { transform: translateX(18px); }
.pf-out {
  width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
  background: var(--surface); color: #b3382c; border: 1.5px solid #b3382c; border-radius: 10px;
  padding: 12px; font: inherit; font-weight: 700; font-size: 0.9rem; cursor: pointer;
}

/* Pop-up */
.pf-overlay {
  position: fixed; inset: 0; z-index: 2000; background: rgba(0, 0, 0, 0.5);
  display: grid; place-items: center; padding: 20px;
}
.pf-modal {
  background: var(--surface); border-radius: 18px; padding: 24px 20px;
  width: 100%; max-width: 340px; text-align: center;
}
.pf-modal-ico {
  width: 46px; height: 46px; border-radius: 50%; background: #f9d9d5; color: #b3382c;
  display: grid; place-items: center; margin: 0 auto 12px;
}
.pf-modal h3 { margin: 0 0 6px; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-size: 1rem; font-weight: 800; color: var(--ink); }
.pf-modal p { margin: 0 0 18px; font-size: 0.78rem; line-height: 1.5; color: var(--ink); }
.pf-m-danger, .pf-m-fill, .pf-m-line {
  display: block; width: 100%; padding: 12px; border-radius: 10px;
  font: inherit; font-weight: 700; font-size: 0.9rem; cursor: pointer;
}
.pf-m-danger { background: #b3382c; color: #fff; border: 0; margin-bottom: 10px; }
.pf-m-fill { background: var(--hm-green); color: #fff; border: 0; margin-bottom: 10px; }
.pf-m-fill:disabled { opacity: 0.6; cursor: wait; }
.pf-m-line { background: var(--surface); color: var(--hm-green); border: 1.5px solid var(--hm-green); }

/* Form ubah sandi */
.pf-form { display: grid; gap: 12px; text-align: left; margin-bottom: 16px; }
.pf-form label { display: grid; gap: 5px; font-size: 0.75rem; font-weight: 700; }
.pf-form input { font-size: 0.85rem; font-weight: 400; padding: 11px 12px; border-radius: 10px; }
.pf-msg { border-radius: 10px; padding: 10px 12px; font-size: 0.78rem; text-align: left; margin-bottom: 12px; }
.pf-msg.err { background: color-mix(in srgb, var(--danger) 12%, transparent); color: var(--danger); }
.pf-msg.ok { background: #dcebe0; color: var(--hm-green); }
`;

export default function AdminProfil() {
  const { nama, logout } = useAuth();
  const nav = useNavigate();
  const pimpinan = localStorage.getItem('peran') === 'pimpinan';
  const kelas = localStorage.getItem('kelas');

  const [notif, setNotif] = useState(() => localStorage.getItem('notif_mendesak') !== '0');
  const [modal, setModal] = useState(null); // null | 'keluar' | 'sandi'

  const [lama, setLama] = useState('');
  const [baru, setBaru] = useState('');
  const [ulang, setUlang] = useState('');
  const [pesan, setPesan] = useState(null); // { tipe: 'err' | 'ok', teks }
  const [loading, setLoading] = useState(false);

  const inisial = (nama || 'GB')
    .split(' ').filter(Boolean).slice(0, 2).map((s) => s[0].toUpperCase()).join('');

  const toggle = () => {
    const v = !notif;
    setNotif(v);
    try { localStorage.setItem('notif_mendesak', v ? '1' : '0'); } catch {}
  };

  const keluar = () => {
    logout();
    nav('/admin/login');
  };

  const tutup = () => {
    setModal(null);
    setLama(''); setBaru(''); setUlang('');
    setPesan(null);
  };

  const simpanSandi = async (e) => {
    e.preventDefault();
    setPesan(null);
    if (baru.length < 8) return setPesan({ tipe: 'err', teks: 'Kata sandi baru minimal 8 karakter.' });
    if (baru !== ulang) return setPesan({ tipe: 'err', teks: 'Konfirmasi kata sandi tidak sama.' });
    setLoading(true);
    try {
      await api.ubahPassword({ lama, baru });
      setPesan({ tipe: 'ok', teks: 'Kata sandi berhasil diubah.' });
      setLama(''); setBaru(''); setUlang('');
    } catch (err) {
      setPesan({ tipe: 'err', teks: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <section className="pf">
        <h2 className="pf-title">Profil</h2>

        <div className="pf-top">
          <div className="pf-avatar">{inisial}</div>
          <p className="pf-name">{nama || 'Guru BK'}</p>
          <span className="pf-role">{pimpinan ? 'Pimpinan' : `Guru BK · Kelas ${kelas || '-'}`}</span>
        </div>

        <div className="pf-list">
          <div className="pf-item">
            <span>Peran</span>
            <span className="pf-val">{pimpinan ? 'Pimpinan' : 'Guru BK'}</span>
          </div>
          <div className="pf-item">
            <span>Kelas yang ditangani</span>
            <span className="pf-val">{pimpinan ? 'Semua kelas' : `Kelas ${kelas || '-'}`}</span>
          </div>
          <div className="pf-item">
            <span>Notifikasi aspirasi mendesak</span>
            <button type="button" className={`pf-switch ${notif ? 'on' : ''}`} onClick={toggle} aria-label="Notifikasi" />
          </div>
          <button type="button" className="pf-item" onClick={() => setModal('sandi')}>
            <span>Ubah kata sandi</span>
            <span className="pf-val">›</span>
          </button>
        </div>

        <button type="button" className="pf-out" onClick={() => setModal('keluar')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Keluar
        </button>
      </section>

      {/* Pop-up konfirmasi keluar */}
      {modal === 'keluar' && (
        <div className="pf-overlay" onClick={tutup}>
          <div className="pf-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pf-modal-ico">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
            <h3>Keluar dari akun?</h3>
            <p>Kamu perlu masuk lagi untuk melihat dan membalas aspirasi siswa.</p>
            <button type="button" className="pf-m-danger" onClick={keluar}>Ya, Keluar</button>
            <button type="button" className="pf-m-line" onClick={tutup}>Batal</button>
          </div>
        </div>
      )}

      {/* Pop-up ubah kata sandi */}
      {modal === 'sandi' && (
        <div className="pf-overlay" onClick={tutup}>
          <div className="pf-modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: 14 }}>Ubah kata sandi</h3>
            <form onSubmit={simpanSandi}>
              <div className="pf-form">
                <label>Kata sandi lama
                  <input type="password" value={lama} onChange={(e) => setLama(e.target.value)} autoComplete="current-password" required />
                </label>
                <label>Kata sandi baru <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(min. 8 karakter)</span>
                  <input type="password" value={baru} onChange={(e) => setBaru(e.target.value)} autoComplete="new-password" required />
                </label>
                <label>Ulangi kata sandi baru
                  <input type="password" value={ulang} onChange={(e) => setUlang(e.target.value)} autoComplete="new-password" required />
                </label>
              </div>
              {pesan && <div className={`pf-msg ${pesan.tipe}`}>{pesan.teks}</div>}
              <button className="pf-m-fill" disabled={loading}>{loading ? 'Menyimpan…' : 'Simpan'}</button>
              <button type="button" className="pf-m-line" onClick={tutup}>
                {pesan?.tipe === 'ok' ? 'Tutup' : 'Batal'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}