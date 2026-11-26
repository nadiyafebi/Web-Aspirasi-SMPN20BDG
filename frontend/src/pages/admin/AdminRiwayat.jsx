import { useState } from 'react';
import { api } from '../../api.js';
import { STATUS, STATUS_LABEL, tanggal } from '../../utils.js';
import { exportPDF, exportExcel } from '../../export.js';

const css = `
.rw { --hm-green: #24574a; max-width: 640px; width: 100%; margin: 0 auto; }
.rw-title { margin: 0 0 14px; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; font-size: 1.1rem; font-weight: 800; color: var(--hm-green); }
.rw-filter {
  background: var(--surface); border: 1px solid var(--line); border-radius: 12px;
  padding: 14px; display: grid; gap: 10px; margin-bottom: 14px;
}
.rw-filter select, .rw-filter input { font-size: 0.8rem; padding: 10px 12px; border-radius: 10px; width: 100%; }
.rw-dates { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.rw-dates label { display: grid; gap: 4px; font-size: 0.72rem; font-weight: 700; }
.rw-btns { display: flex; gap: 8px; flex-wrap: wrap; }
.rw-btn {
  font: inherit; font-weight: 700; font-size: 0.8rem; padding: 10px 14px; border-radius: 10px;
  cursor: pointer; border: 1.5px solid var(--hm-green); background: var(--surface); color: var(--hm-green);
}
.rw-btn.fill { background: var(--hm-green); color: #fff; flex: 1; }
.rw-btn:disabled { opacity: 0.6; cursor: wait; }
.rw-count { font-size: 0.75rem; color: var(--muted); margin: 0 0 10px; }
.rw-card { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 14px; margin-bottom: 12px; }
.rw-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px; }
.rw-id { font-weight: 800; font-size: 0.85rem; }
.rw-tag { font-size: 0.68rem; font-weight: 700; padding: 3px 10px; border-radius: 999px; background: #fdeccd; color: #8a5a00; }
.rw-tag.diterima { background: #dcebe0; color: var(--hm-green); }
.rw-judul { margin: 0 0 4px; font-size: 0.82rem; font-weight: 700; }
.rw-meta { margin: 0 0 8px; font-size: 0.7rem; color: var(--muted); }
.rw-isi { margin: 0; font-size: 0.78rem; line-height: 1.5; white-space: pre-wrap; }
.rw-bal { background: var(--hm-green); color: #fff; border-radius: 8px; padding: 10px 12px; margin-top: 10px; font-size: 0.75rem; line-height: 1.5; }
.rw-bal small { display: block; opacity: 0.8; margin-bottom: 2px; }
.rw-error { background: color-mix(in srgb, var(--danger) 12%, transparent); color: var(--danger); border-radius: 10px; padding: 10px 14px; font-size: 0.85rem; margin-bottom: 12px; }
`;

export default function AdminRiwayat() {
  const [f, setF] = useState({ status: '', dari: '', sampai: '' });
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const info = [
    f.status && `Status: ${STATUS_LABEL[f.status] || f.status}`,
    f.dari && `Dari: ${f.dari}`,
    f.sampai && `Sampai: ${f.sampai}`,
  ].filter(Boolean).join(', ');

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const tampilkan = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try { setRows(await api.riwayat(f)); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <>
      <style>{css}</style>
      <section className="rw">
        <h2 className="rw-title">Riwayat Aspirasi</h2>

        <form className="rw-filter" onSubmit={tampilkan}>
          <select value={f.status} onChange={set('status')}>
            <option value="">Semua status</option>
            {STATUS.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
          <div className="rw-dates">
            <label>Dari <input type="date" value={f.dari} onChange={set('dari')} /></label>
            <label>Sampai <input type="date" value={f.sampai} onChange={set('sampai')} /></label>
          </div>
          <div className="rw-btns">
            <button className="rw-btn fill" disabled={loading}>{loading ? 'Memuat…' : 'Tampilkan'}</button>
            {rows?.length > 0 && (
              <>
                <button type="button" className="rw-btn" onClick={() => exportPDF(rows, info)}>PDF</button>
                <button type="button" className="rw-btn" onClick={() => exportExcel(rows)}>Excel</button>
              </>
            )}
          </div>
        </form>

        {error && <div className="rw-error">{error}</div>}

        {rows && (
          <div>
            <p className="rw-count">{rows.length} aspirasi</p>
            {rows.map((r) => (
              <article className="rw-card" key={r.id}>
                <div className="rw-top">
                  <span className="rw-id">{r.kode_tiket || `ASP-${String(r.id).padStart(4, '0')}`}</span>
                  <span className={`rw-tag ${r.status}`}>{STATUS_LABEL[r.status] || r.status}</span>
                </div>
                <p className="rw-judul">{r.judul}</p>
                <p className="rw-meta">{r.kategori} · {r.inisial} / Kelas {r.kelas} · {tanggal(r.created_at)}</p>
                <p className="rw-isi">{r.isi}</p>
                {r.balasan?.map((b, i) => (
                  <div className="rw-bal" key={i}>
                    <small>{b.guru} · {tanggal(b.created_at)}</small>
                    {b.isi}
                  </div>
                ))}
              </article>
            ))}
            {!rows.length && <p className="rw-count">Tidak ada data untuk filter ini.</p>}
          </div>
        )}
      </section>
    </>
  );
}