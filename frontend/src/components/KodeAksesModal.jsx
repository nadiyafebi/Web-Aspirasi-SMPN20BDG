import { useState } from 'react';

export default function KodeAksesModal({ buka, sending, error, onBatal, onKonfirmasi }) {
  const [kode, setKode] = useState('');
  if (!buka) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="judul-kode"
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15,42,61,.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, zIndex: 50,
      }}
    >
      <form
        className="card form"
        style={{ maxWidth: 420, width: '100%' }}
        onSubmit={(e) => { e.preventDefault(); onKonfirmasi(kode.trim()); }}
      >
        <h3 id="judul-kode" style={{ margin: 0 }}>Masukkan Kode Akses Sekolah</h3>
        <p className="muted">
          Kode ini hanya diberikan kepada siswa SMPN 2 Bandung. Tanyakan kepada guru BK atau wali kelasmu.
        </p>
        <input
          autoFocus
          autoComplete="off"
          placeholder="Kode akses"
          value={kode}
          onChange={(e) => setKode(e.target.value)}
          required
        />
        {error && <div className="alert">{error}</div>}
        <div className="row">
          <button type="button" className="btn btn-ghost" onClick={onBatal}>Batal</button>
          <button className="btn btn-primary" disabled={sending}>
            {sending ? 'Mengirim...' : 'Kirim Aspirasi'}
          </button>
        </div>
      </form>
    </div>
  );
}