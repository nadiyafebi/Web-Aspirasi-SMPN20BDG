import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../api';
// Tambahkan PRIORITAS_LABEL pada import dari utils
import { PRIORITAS_LABEL, STATUS_LABEL, tanggal } from '../../utils.js';
import BalasanList from '../../components/BalasanList.jsx';

export default function AdminCetak() {
  const [params] = useSearchParams();
  const status = params.get('status') || '';
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const daftar = await api.daftar({ status });
        const lengkap = await Promise.all(daftar.map((r) => api.detail(r.id)));
        setRows(lengkap);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [status]);

  if (error) return <div className="alert">{error}</div>;
  if (!rows) return <p className="muted">Memuat…</p>;

  return (
    <>
      <div className="row between no-print">
        <Link to="/admin" className="back">← Kembali</Link>
        <button className="btn btn-primary" onClick={() => window.print()}>
          🖨️ Cetak / Simpan PDF
        </button>
      </div>

      <div className="kop">
        <h2>Riwayat Aspirasi Siswa — SMPN 2 Bandung</h2>
        <p>
          {rows[0] ? `Kelas ${rows[0].kelas}` : 'Kelas'} ·{' '}
          {status ? STATUS_LABEL[status] : 'Semua status'} · Dicetak{' '}
          {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}
        </p>
      </div>

      {rows.map((a, i) => (
        <div key={a.id} className="item-cetak">
          <b>{i + 1}. {a.judul}</b>

          {/* PERUBAHAN DI SINI: Kode tiket diganti #${a.id} dan penambahan Prioritas */}
          <p className="meta">
            #{a.id} · {a.inisial} / Kelas {a.kelas} · {a.kategori} ·{' '}
            {STATUS_LABEL[a.status]} (Prioritas: {PRIORITAS_LABEL[a.prioritas] || '-'}) · {tanggal(a.created_at)}
          </p>

          <p className="isi">{a.isi}</p>
          {a.balasan?.length > 0 && (
            <>
              <b>Balasan guru:</b>
              <BalasanList balasan={a.balasan} />
            </>
          )}
        </div>
      ))}
      {!rows.length && <p className="muted">Tidak ada data.</p>}
    </>
  );
}