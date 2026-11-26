import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { tanggal } from '../utils.js';
import StatusBadge from '../components/StatusBadge.jsx';
import BalasanList from '../components/BalasanList.jsx';

export default function CekAspirasi() {
  const { kode: kodeUrl } = useParams();
  const nav = useNavigate();
  const [kode, setKode] = useState(kodeUrl || '');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cari = async (k) => {
    setError('');
    setData(null);
    setLoading(true);
    try {
      setData(await api.cekKode(k));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (kodeUrl) { setKode(kodeUrl); cari(kodeUrl); }
  }, [kodeUrl]);

  const submit = (e) => {
    e.preventDefault();
    if (kode.trim()) nav(`/cek/${kode.trim().toUpperCase()}`);
  };

  return (
    <>
      <form className="card form" onSubmit={submit}>
        <h2>Cek Tiket</h2>
        <p className="muted">Masukkan kode tiket yang kamu dapat setelah mengirim aspirasi.</p>
        <div className="row">
          <input className="grow" value={kode} onChange={(e) => setKode(e.target.value)} placeholder="ASP-XXXXXX" />
          <button className="btn btn-primary" disabled={loading}>{loading ? 'Mencari…' : 'Cari'}</button>
        </div>
        {error && <div className="alert">{error}</div>}
      </form>

      {data && (
        <div className="card">
          <div className="row between">
            <span className="ticket sm">{data.kode_tiket}</span>
            <StatusBadge status={data.status} />
          </div>
          <h2>{data.judul}</h2>
          <p className="meta">{data.kategori} · {data.inisial} / Kelas {data.kelas} · {tanggal(data.created_at)}</p>
          <p className="isi">{data.isi}</p>
          <h3>Balasan guru</h3>
          <BalasanList balasan={data.balasan} />
        </div>
      )}
    </>
  );
}