import { useEffect, useState } from 'react';
import { api } from '../../api';

const css = `
.st { --hm-green: #24574a; max-width: 640px; width: 100%; margin: 0 auto; }
.st h2, .st h3 { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
.st-head h2 { margin: 0; font-size: 1.1rem; font-weight: 800; color: var(--hm-green); }
.st-head p { margin: 0 0 12px; font-size: 0.7rem; color: var(--muted); }
.st-chips { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
.st-chip {
  font: inherit; font-size: 0.72rem; padding: 4px 14px; border-radius: 999px;
  border: 1px solid var(--ink); background: transparent; color: var(--ink); cursor: pointer;
}
.st-chip.on { background: var(--hm-green); border-color: var(--hm-green); color: #fff; }
.st-card {
  background: var(--surface); border: 1px solid var(--line);
  border-radius: 12px; padding: 14px 16px; margin-bottom: 14px;
}
.st-card h3 { margin: 0 0 14px; text-align: center; font-size: 0.85rem; font-weight: 800; color: var(--ink); }
.st-row { display: grid; grid-template-columns: 82px 1fr 24px; align-items: center; gap: 10px; margin-bottom: 12px; font-size: 0.75rem; }
.st-row:last-child { margin-bottom: 0; }
.st-track { height: 8px; background: color-mix(in srgb, var(--hm-green) 15%, var(--surface)); border-radius: 99px; overflow: hidden; }
.st-fill { height: 100%; background: var(--hm-green); border-radius: 99px; transition: width 0.3s ease; }
.st-num { text-align: right; font-weight: 700; }
.st-bars { display: flex; align-items: flex-end; justify-content: space-between; height: 130px; gap: 6px; }
.st-col { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; gap: 4px; font-size: 0.7rem; }
.st-col b { font-weight: 700; }
.st-bar { width: 70%; max-width: 22px; background: var(--hm-green); border-radius: 3px 3px 0 0; min-height: 3px; transition: height 0.3s ease; }
.st-col span { color: var(--muted); }
.st-error { background: color-mix(in srgb, var(--danger) 12%, transparent); color: var(--danger); border-radius: 10px; padding: 10px 14px; font-size: 0.85rem; margin-bottom: 12px; }
`;

const PERIODE = [['minggu', 'Minggu ini'], ['bulan', 'Bulan ini'], ['semester', 'Semester']];
const KATEGORI = ['Akademik', 'Fasilitas', 'Perundungan', 'Saran & Ide'];
const HARI = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export default function AdminStatistik() {
  const pimpinan = localStorage.getItem('peran') === 'pimpinan';
  const [periode, setPeriode] = useState('minggu');
  const [kelas, setKelas] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    api.statistik({ kelas: pimpinan ? kelas : '', periode })
      .then(setData)
      .catch((e) => setError(e.message));
  }, [periode, kelas]);

  const kat = KATEGORI.map((k) => ({
    nama: k,
    jumlah: Number(data?.per_kategori?.find((x) => x.kategori === k)?.jumlah || 0),
  }));
  const maxKat = Math.max(1, ...kat.map((k) => k.jumlah));

  const hari = HARI.map((h, i) => ({
    nama: h,
    jumlah: Number(data?.per_hari?.find((x) => Number(x.hari) === i)?.jumlah || 0),
  }));
  const maxHari = Math.max(1, ...hari.map((h) => h.jumlah));

  return (
    <>
      <style>{css}</style>
      <section className="st">
        <div className="st-head">
          <h2>Statistik</h2>
          <p>Kinerja layanan BK</p>
        </div>

        <div className="st-chips">
          {PERIODE.map(([v, l]) => (
            <button key={v} type="button" className={`st-chip ${periode === v ? 'on' : ''}`} onClick={() => setPeriode(v)}>
              {l}
            </button>
          ))}
          {pimpinan && (
            <select className="st-chip" value={kelas} onChange={(e) => setKelas(e.target.value)}>
              <option value="">Semua kelas</option>
              <option value="7">Kelas 7</option>
              <option value="8">Kelas 8</option>
              <option value="9">Kelas 9</option>
            </select>
          )}
        </div>

        {error && <div className="st-error">{error}</div>}

        <div className="st-card">
          <h3>Aspirasi per-kategori</h3>
          {kat.map((k) => (
            <div className="st-row" key={k.nama}>
              <span>{k.nama}</span>
              <div className="st-track"><div className="st-fill" style={{ width: `${(k.jumlah / maxKat) * 100}%` }} /></div>
              <b className="st-num">{k.jumlah}</b>
            </div>
          ))}
        </div>

        <div className="st-card">
          <h3>Aspirasi masuk per-hari</h3>
          <div className="st-bars">
            {hari.map((h) => (
              <div className="st-col" key={h.nama}>
                <b>{h.jumlah}</b>
                <div className="st-bar" style={{ height: `${(h.jumlah / maxHari) * 85}px` }} />
                <span>{h.nama}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}