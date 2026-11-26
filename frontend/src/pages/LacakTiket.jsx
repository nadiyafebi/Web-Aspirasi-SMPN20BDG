import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const css = `
.lt {
  --hm-green: #24574a;
  max-width: 560px;
  width: 100%;
  margin: 0 auto;
}
.lt h2, .lt h3 { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }

.lt-head {
  display: grid;
  grid-template-columns: 36px 1fr 36px;
  align-items: center;
  margin-bottom: 14px;
}
.lt-back {
  background: none;
  border: 0;
  cursor: pointer;
  color: var(--ink);
  padding: 6px;
  display: grid;
  place-items: center;
  justify-self: start;
}
.lt-title {
  margin: 0;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--ink);
}

.lt-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 14px;
}
.lt-label { margin: 0 0 2px; font-size: 0.72rem; color: var(--muted); }
.lt-code {
  margin: 0 0 8px;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 1px;
  color: var(--ink);
}
.lt-badges { display: flex; gap: 8px; flex-wrap: wrap; }
.lt-badge {
  font-size: 0.68rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid transparent;
}
.lt-badge.urg { background: #fdeccd; color: #8a5a00; border-color: #f0cf8f; }
.lt-badge.kat { background: #dcebe0; color: var(--hm-green); border-color: #b9d4c0; }

.lt-card h3 { margin: 0 0 12px; font-size: 0.95rem; font-weight: 700; color: var(--ink); }

.lt-steps { list-style: none; margin: 0; padding: 0; }
.lt-step {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 14px;
  font-size: 0.8rem;
  color: var(--ink);
}
.lt-step:last-child { padding-bottom: 0; }
.lt-dot {
  position: relative;
  z-index: 1;
  flex: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--hm-green);
}
.lt-step::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 50%;
  width: 2px;
  height: 100%;
  background: var(--hm-green);
}
.lt-step:last-child::before { display: none; }
.lt-step.todo::before { background: var(--line); }
.lt-step.todo .lt-dot { background: color-mix(in srgb, var(--hm-green) 15%, var(--surface)); }
.lt-step.todo { color: var(--muted); }
.lt-step.now { font-weight: 700; }

.lt-section { margin: 20px 0 10px; font-size: 1.05rem; font-weight: 800; color: var(--ink); }
.lt-bubble {
  background: var(--hm-green);
  color: #fff;
  border-radius: 10px;
  padding: 14px;
  font-size: 0.8rem;
  line-height: 1.55;
  margin-bottom: 14px;
}
.lt-empty { color: var(--muted); font-size: 0.85rem; margin-bottom: 14px; }
.lt-reply-label { display: block; font-size: 0.72rem; color: var(--muted); margin-bottom: 6px; }
.lt-reply {
  display: flex;
  gap: 8px;
}
.lt-reply input {
  flex: 1;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 12px;
  font-size: 0.85rem;
}
.lt-send {
  flex: none;
  background: var(--hm-green);
  color: #fff;
  border: 0;
  border-radius: 10px;
  padding: 0 16px;
  font: inherit;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
}
`;

const STATUS = ['Terkirim', 'Dibaca Guru BK', 'Sedang diproses', 'Selesai'];

export default function LacakTiket() {
  const { kode } = useParams();
  const navigate = useNavigate();

  // Data dummy (sementara) - nanti sambungkan ke API
  const [tiket] = useState({
    kode: kode || 'ASP-XXXX-XXXX',
    urgensi: 'Tinggi',
    kategori: 'Perundungan',
    statusIndex: 2, // 0 = Terkirim ... 3 = Selesai
    balasan:
      'Terima kasih sudah berani bercerita. Kami sedang menindaklanjuti dan akan menghubungi wali kelas.',
  });

  const [balas, setBalas] = useState('');

  const kirimBalasan = (e) => {
    e.preventDefault();
    if (!balas.trim()) return;
    // TODO: kirim ke API
    setBalas('');
  };

  return (
    <>
      <style>{css}</style>

      <section className="lt">
        <div className="lt-head">
          <button type="button" className="lt-back" onClick={() => navigate('/')} aria-label="Kembali">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h2 className="lt-title">Lacak Tiket</h2>
          <span />
        </div>

        <div className="lt-card">
          <p className="lt-label">Kode tiket</p>
          <p className="lt-code">{tiket.kode}</p>
          <div className="lt-badges">
            <span className="lt-badge urg">urgensi : {tiket.urgensi}</span>
            <span className="lt-badge kat">{tiket.kategori}</span>
          </div>
        </div>

        <div className="lt-card">
          <h3>Status</h3>
          <ul className="lt-steps">
            {STATUS.map((s, i) => (
              <li
                key={s}
                className={`lt-step ${i > tiket.statusIndex ? 'todo' : ''} ${i === tiket.statusIndex ? 'now' : ''}`}
              >
                <span className="lt-dot" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <h3 className="lt-section">Balasan Guru BK</h3>
        {tiket.balasan ? (
          <div className="lt-bubble">{tiket.balasan}</div>
        ) : (
          <p className="lt-empty">Belum ada balasan.</p>
        )}

        <form onSubmit={kirimBalasan}>
          <label className="lt-reply-label" htmlFor="balas">Dibalas hari ini</label>
          <div className="lt-reply">
            <input
              id="balas"
              type="text"
              placeholder="Tulis balasan..."
              value={balas}
              onChange={(e) => setBalas(e.target.value)}
            />
            <button className="lt-send">Kirim</button>
          </div>
        </form>
      </section>
    </>
  );
}