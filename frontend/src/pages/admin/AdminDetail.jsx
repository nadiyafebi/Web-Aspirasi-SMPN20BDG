import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../api';
import { PRIORITAS_LABEL, tanggal } from '../../utils.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import PrioritasBadge, { TerlambatTag } from '../../components/PrioritasBadge.jsx';
import BalasanList from '../../components/BalasanList.jsx';

export default function AdminDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isi, setIsi] = useState('');
  const [nilai, setNilai] = useState('biasa');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [sending, setSending] = useState(false);

  const muat = () =>
    api.detail(id)
      .then((d) => { setData(d); setNilai(d.level_guru || d.level_prioritas); })
      .catch((e) => setError(e.message));
  useEffect(() => { muat(); }, [id]);

  const kirim = async (e) => {
    e.preventDefault();
    setError(''); setInfo(''); setSending(true);
    try {
      await api.balas(id, isi);
      setIsi('');
      setInfo('Balasan terkirim.');
      await muat();
    } catch (err) { setError(err.message); }
    finally { setSending(false); }
  };

  const simpanNilai = async () => {
    setError(''); setInfo('');
    try {
      await api.setPrioritas(id, nilai);
      setInfo('Penilaian prioritas disimpan.');
      await muat();
    } catch (err) { setError(err.message); }
  };

  if (!data) return error ? <div className="alert">{error}</div> : <p className="muted">Memuat...</p>;

  return (
    <>
      <Link to="/admin" className="back">← Kembali</Link>
      <div className="card">
        <div className="row between">
          <span className="ticket sm">#{data.id}</span>
          <div className="row">
            {data.terlambat ? <TerlambatTag jam={data.jam_respons} /> : null}
            <PrioritasBadge level={data.prioritas} />
            <StatusBadge status={data.status} />
          </div>
        </div>
        <h2>{data.judul}</h2>
        <p className="meta">{data.kategori} · {data.inisial} / Kelas {data.kelas} · {tanggal(data.created_at)}</p>
        <p className="isi">{data.isi}</p>
      </div>

      <div className="card">
        <h3>Prioritas</h3>
        <p className="muted">
          Saran sistem: <b>{PRIORITAS_LABEL[data.level_prioritas]}</b>
          {data.alasan_prioritas ? ` (terdeteksi: ${data.alasan_prioritas})` : ''}. Ini hanya alat bantu urutan,
          penilaian akhir tetap ada pada guru.
        </p>
        <div className="row">
          <select value={nilai} onChange={(e) => setNilai(e.target.value)}>
            {Object.entries(PRIORITAS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <button type="button" className="btn btn-ghost btn-sm" onClick={simpanNilai}>Simpan penilaian</button>
        </div>
      </div>

      <div className="card">
        <h3>Balasan</h3>
        <BalasanList balasan={data.balasan} />
        <form onSubmit={kirim} className="form">
          <label>Tulis balasan
            <textarea rows={4} value={isi} onChange={(e) => setIsi(e.target.value)} required />
          </label>
          {error && <div className="alert">{error}</div>}
          {info && <div className="alert ok">{info}</div>}
          <button className="btn btn-primary" disabled={sending}>{sending ? 'Mengirim...' : 'Kirim balasan'}</button>
        </form>
      </div>
    </>
  );
}