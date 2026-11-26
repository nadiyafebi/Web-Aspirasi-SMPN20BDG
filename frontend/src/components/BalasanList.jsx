import { tanggal } from '../utils.js';

export default function BalasanList({ balasan = [] }) {
  if (!balasan.length) return <p className="muted">Belum ada balasan.</p>;
  return (
    <div className="balasan-list">
      {balasan.map((b, i) => (
        <div className="balasan" key={b.id ?? i}>
          <div className="balasan-head">
            <strong>{b.guru}</strong>
            <span className="muted">{tanggal(b.created_at)}</span>
          </div>
          <p>{b.isi}</p>
        </div>
      ))}
    </div>
  );
}