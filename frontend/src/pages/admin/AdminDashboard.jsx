import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api';

const css = `
.ad {
  --hm-green: #24574a;
  max-width: 640px;
  width: 100%;
  margin: 0 auto;
}
.ad h2, .ad h3 { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }

.ad-hero {
  background: var(--hm-green);
  color: #fff;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 18px;
}
.ad-hero h2 { margin: 0; font-size: 1.15rem; font-weight: 800; color: #fff; }
.ad-hero p { margin: 2px 0 14px; font-size: 0.72rem; opacity: 0.9; }
.ad-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.ad-stat {
  font: inherit;
  text-align: left;
  border: 0;
  border-radius: 10px;
  padding: 10px 14px;
  cursor: pointer;
  display: grid;
  gap: 2px;
}
.ad-stat span { font-size: 0.72rem; font-weight: 600; }
.ad-stat b { font-size: 1.7rem; font-weight: 800; line-height: 1.1; }
.ad-stat.baru { background: #fff; color: var(--hm-green); }
.ad-stat.telat { background: #111; color: #fff; }
.ad-stat.on { outline: 2px solid #e0a526; outline-offset: 1px; }

.ad-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}
.ad-bar h3 { margin: 0; font-size: 0.9rem; font-weight: 800; color: var(--ink); }
.ad-pdf { font-size: 0.72rem; font-weight: 700; color: var(--hm-green); text-decoration: underline; }

.ad-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
.ad-chip {
  font: inherit;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 5px 14px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--ink);
  cursor: pointer;
}
.ad-chip.on { background: var(--hm-green); border-color: var(--hm-green); color: #fff; }
.ad-select {
  font: inherit;
  font-size: 0.75rem;
  padding: 5px 10px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--surface);
  width: auto;
}

.ad-list { display: grid; gap: 12px; }
.ad-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 14px;
}
.ad-card.mendesak { border: 1.5px solid #b3382c; }
.ad-top { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
.ad-id { font-weight: 800; font-size: 0.85rem; margin-right: auto; }
.ad-tag {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
}
.ad-tag.mendesak { background: #f9d9d5; color: #a02f23; }
.ad-tag.tinggi { background: #fdeccd; color: #8a5a00; }
.ad-tag.biasa { background: #dcebe0; color: var(--hm-green); }
.ad-tag.telat { background: #111; color: #fff; }
.ad-judul { margin: 0 0 10px; font-size: 0.8rem; line-height: 1.5; color: var(--ink); }
.ad-foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.ad-meta { font-size: 0.72rem; color: var(--muted); }
.ad-open {
  background: var(--hm-green);
  color: #fff;
  border: 0;
  border-radius: 8px;
  padding: 8px 12px;
  font: inherit;
  font-weight: 700;
  font-size: 0.75rem;
  cursor: pointer;
  white-space: nowrap;
}
.ad-empty { text-align: center; color: var(--muted); font-size: 0.85rem; padding: 24px 0; }
.ad-error {
  background: color-mix(in srgb, var(--danger) 12%, transparent);
  color: var(--danger);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 0.85rem;
  margin-bottom: 12px;
}
`;

const FILTER = [
  ['', 'Semua'],
  ['mendesak', 'Mendesak'],
  ['tinggi', 'Tinggi'],
  ['biasa', 'Biasa'],
];
const LABEL = { mendesak: 'Mendesak', tinggi: 'Tinggi', biasa: 'Biasa' };

export default function AdminDashboard() {
  const nav = useNavigate();
  const pimpinan = localStorage.getItem('peran') === 'pimpinan';
  const kelasGuru = localStorage.getItem('kelas');

  const [rows, setRows] = useState([]);
  const [stat, setStat] = useState(null);
  const [kelas, setKelas] = useState('');
  const [prioritas, setPrioritas] = useState('');
  const [terlambat, setTerlambat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    const k = pimpinan ? kelas : '';
    Promise.all([
      api.aspirasi({ kelas: k, status: '', prioritas, terlambat: terlambat ? '1' : '' }),
      api.statistik({ kelas: k }),
    ])
      .then(([daftar, s]) => { setRows(daftar); setStat(s); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [kelas, prioritas, terlambat]);

  const waktu = (r) => {
    if (r.terlambat) return `Terlambat ${r.jam_respons} jam`;
    if (r.status === 'diterima') return `Dibalas ${r.jam_respons} jam`;
    return `${r.jam_respons} jam lalu`;
  };

  return (
    <>
      <style>{css}</style>

      <section className="ad">
        <div className="ad-hero">
          <h2>{pimpinan ? 'Pemantauan Pimpinan' : 'Dashboard Guru BK'}</h2>
          <p>
            {pimpinan ? 'Semua kelas. Isi aspirasi disembunyikan.' : `kelas ${kelasGuru || '-'}. Disposisi otomatis`}
          </p>
          <div className="ad-stats">
            <button
              type="button"
              className={`ad-stat baru ${!terlambat ? 'on' : ''}`}
              onClick={() => setTerlambat(false)}
            >
              <span>Aspirasi Baru</span>
              <b>{stat ? stat.diproses : '-'}</b>
            </button>
            <button
              type="button"
              className={`ad-stat telat ${terlambat ? 'on' : ''}`}
              onClick={() => setTerlambat(!terlambat)}
            >
              <span>Terlambat</span>
              <b>{stat ? stat.terlambat : '-'}</b>
            </button>
          </div>
        </div>

        <div className="ad-bar">
          <h3>Perlu ditangani sekarang</h3>
        </div>

        <div className="ad-chips">
          {FILTER.map(([v, l]) => (
            <button
              key={l}
              type="button"
              className={`ad-chip ${prioritas === v ? 'on' : ''}`}
              onClick={() => setPrioritas(v)}
            >
              {l}
            </button>
          ))}
          {pimpinan && (
            <select className="ad-select" value={kelas} onChange={(e) => setKelas(e.target.value)}>
              <option value="">Semua kelas</option>
              <option value="7">Kelas 7</option>
              <option value="8">Kelas 8</option>
              <option value="9">Kelas 9</option>
            </select>
          )}
        </div>

        {error && <div className="ad-error">{error}</div>}
        {loading && <p className="ad-empty">Memuat...</p>}

        {!loading && (
          <div className="ad-list">
            {rows.map((r) => (
              <div key={r.id} className={`ad-card ${r.prioritas === 'mendesak' ? 'mendesak' : ''}`}>
                <div className="ad-top">
                  <span className="ad-id">ASP-{String(r.id).padStart(4, '0')}</span>
                  {r.terlambat ? <span className="ad-tag telat">Terlambat</span> : null}
                  <span className={`ad-tag ${r.prioritas}`}>{LABEL[r.prioritas] || r.prioritas}</span>
                </div>

                <p className="ad-judul">{pimpinan ? <span className="muted">{r.judul}</span> : r.judul}</p>

                <div className="ad-foot">
                  <span className="ad-meta">
                    {r.kategori}, {waktu(r)}
                    {pimpinan ? ` · kelas ${r.kelas}` : ''}
                  </span>
                  {!pimpinan && (
                    <button type="button" className="ad-open" onClick={() => nav(`/admin/aspirasi/${r.id}`)}>
                      {r.status === 'diproses' ? 'Buka & Balas' : 'Buka'}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {!rows.length && !error && <p className="ad-empty">Tidak ada data.</p>}
          </div>
        )}
      </section>
    </>
  );
}