import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { KATEGORI } from '../utils.js';

const css = `
.kr {
  --hm-green: #24574a;
  max-width: 560px;
  width: 100%;
  margin: 0 auto;
}
.kr h2 { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }

.kr-head {
  display: grid;
  grid-template-columns: 36px 1fr 36px;
  align-items: center;
  margin-bottom: 14px;
}
.kr-back {
  background: none;
  border: 0;
  cursor: pointer;
  color: var(--ink);
  padding: 6px;
  display: grid;
  place-items: center;
  justify-self: start;
}
.kr-title {
  margin: 0;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--brand);
}

.kr-form { display: grid; gap: 14px; }
.kr-field { display: grid; gap: 6px; font-weight: 700; font-size: 0.9rem; }
.kr-field input,
.kr-field select,
.kr-field textarea {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 11px 12px;
  font-weight: 400;
  font-size: 0.85rem;
}
.kr-field textarea { resize: vertical; min-height: 130px; }

.kr-group-label { display: block; margin-bottom: 8px; font-weight: 700; font-size: 0.9rem; }
.kr-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.kr-chip {
  font: inherit;
  font-size: 0.8rem;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--ink);
  cursor: pointer;
}
.kr-chip.on {
  background: var(--hm-green);
  border-color: var(--hm-green);
  color: #fff;
}

.kr-attach {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--hm-green);
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  width: fit-content;
}
.kr-attach input { display: none; }
.kr-info {
  background: #cfe0d2;
  color: #1d3b32;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 0.75rem;
  line-height: 1.5;
}
.kr-submit {
  width: 100%;
  background: var(--hm-green);
  color: #fff;
  border: 0;
  border-radius: 10px;
  padding: 14px;
  font: inherit;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
}
.kr-submit:disabled { opacity: 0.6; cursor: wait; }
.kr-error {
  background: color-mix(in srgb, var(--danger) 12%, transparent);
  color: var(--danger);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 0.85rem;
}

/* ===== Tampilan sukses ===== */
.ok-wrap { text-align: center; }
.ok-circle {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: var(--hm-green);
  color: #fff;
  display: grid;
  place-items: center;
  margin: 8px auto 14px;
}
.ok-title {
  margin: 0 0 4px;
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--ink);
}
.ok-sub { margin: 0 0 18px; font-size: 0.8rem; color: var(--muted); }

.ok-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 14px;
}
.ok-card-label { margin: 0 0 10px; font-size: 0.72rem; color: var(--muted); }
.ok-code {
  background: #dcebe0;
  border: 2px dashed var(--hm-green);
  border-radius: 10px;
  padding: 14px 8px;
  margin-bottom: 14px;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: var(--hm-green);
  word-break: break-all;
}
.ok-btn-fill,
.ok-btn-line {
  display: block;
  width: 70%;
  margin: 0 auto 10px;
  border-radius: 8px;
  padding: 10px;
  font: inherit;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
}
.ok-btn-fill { background: var(--hm-green); color: #fff; border: 0; }
.ok-btn-line {
  background: var(--surface);
  color: var(--hm-green);
  border: 1.5px solid var(--hm-green);
  margin-bottom: 0;
}

.ok-warn {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  text-align: left;
  background: #fdeccd;
  color: #7a4f00;
  border: 1px solid #f0cf8f;
  border-radius: 10px;
  padding: 12px;
  font-size: 0.75rem;
  line-height: 1.5;
  margin-bottom: 18px;
}
.ok-warn-ico {
  flex: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #e0a526;
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 0.7rem;
  font-weight: 800;
}

.ok-track {
  display: block;
  width: 100%;
  background: var(--hm-green);
  color: #fff;
  text-align: center;
  text-decoration: none;
  border-radius: 10px;
  padding: 14px;
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 14px;
}
.ok-home {
  display: block;
  text-align: center;
  color: var(--hm-green);
  font-weight: 700;
  font-size: 0.8rem;
  text-decoration: none;
}
`;

const kosong = { nisn: '', inisial: '', kategori: KATEGORI[0], isi: '' };

export default function KirimAspirasi() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(kosong);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [kode, setKode] = useState('');
  const [copied, setCopied] = useState(false);

  // Ambil kategori dari URL
  useEffect(() => {
    const kategoriDariUrl = searchParams.get('kategori');
    if (kategoriDariUrl && KATEGORI.includes(kategoriDariUrl)) {
      setForm((prev) => ({ ...prev, kategori: kategoriDariUrl }));
    }
  }, [searchParams]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!/^[A-Za-z]{1,5}$/.test(form.inisial)) {
      return setError('Inisial harus 1–5 huruf (tanpa spasi/angka).');
    }
    if (!/^\d{10}$/.test(form.nisn.trim())) {
      return setError('NISN harus 10 digit angka.');
    }
    setLoading(true);
    try {
      const res = await api.kirimAspirasi({
        inisial: form.inisial,
        kategori: form.kategori,
        // Desain tidak punya kolom judul, jadi dibuat otomatis dari awal isi
        judul: form.isi.trim().slice(0, 80),
        isi: form.isi,
        nisn: form.nisn.trim(),
      });
      setKode(res.kode_tiket);
      setForm(kosong);
      setFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(kode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  // ================= TAMPILAN SUKSES =================
  if (kode)
    return (
      <>
        <style>{css}</style>

        <section className="kr ok-wrap">
          <div className="ok-circle">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
          </div>
          <h2 className="ok-title">Aspirasi Terkirim</h2>
          <p className="ok-sub">Terima kasih sudah berani bersuara.</p>

          <div className="ok-card">
            <p className="ok-card-label">Kode tiket kamu</p>
            <div className="ok-code">{kode}</div>
            <button type="button" className="ok-btn-fill" onClick={copy}>
              {copied ? 'Tersalin ✓' : 'Salin Kode'}
            </button>
            <button type="button" className="ok-btn-line" onClick={() => window.print()}>
              Simpan sebagai Gambar
            </button>
          </div>

          <div className="ok-warn">
            <span className="ok-warn-ico">!</span>
            <span>
              <b>Simpan kode ini.</b> kode tidak bisa dipulihkan jika hilang dan hanya dengan kode ini kamu bisa melihat balasan.
            </span>
          </div>

          <Link to={`/cek/${kode}`} className="ok-track">Lacak Tiket</Link>
          <Link to="/" className="ok-home">Kembali ke Beranda</Link>
        </section>
      </>
    );

  // ================= TAMPILAN FORM =================
  return (
    <>
      <style>{css}</style>

      <section className="kr">
        <div className="kr-head">
          <button type="button" className="kr-back" onClick={() => navigate(-1)} aria-label="Kembali">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h2 className="kr-title">Kirim Aspirasi</h2>
          <span />
        </div>

        <form className="kr-form" onSubmit={submit}>
          <label className="kr-field">
            NISN
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              placeholder="10 digit NISN"
              value={form.nisn}
              onChange={(e) => setForm({ ...form, nisn: e.target.value.replace(/\D/g, '') })}
              required
            />
          </label>

          <div>
            <span className="kr-group-label">Kategori</span>
            <div className="kr-chips">
              {KATEGORI.map((kat) => (
                <button
                  type="button"
                  key={kat}
                  onClick={() => setForm({ ...form, kategori: kat })}
                  className={`kr-chip ${form.kategori === kat ? 'on' : ''}`}
                >
                  {kat === 'Saran & Ide' ? 'Saran' : kat}
                </button>
              ))}
            </div>
          </div>

          <label className="kr-field">
            Kirim sebagai
            <input
              value={form.inisial}
              onChange={set('inisial')}
              maxLength={5}
              placeholder="contoh : L"
              required
            />
          </label>

          <label className="kr-field">
            Kelas
            <select value={form.kelas} onChange={set('kelas')}>
              <option value="7">Kelas 7</option>
              <option value="8">Kelas 8</option>
              <option value="9">Kelas 9</option>
            </select>
          </label>

          <label className="kr-field">
            Ceritakan aspirasimu
            <textarea
              value={form.isi}
              onChange={set('isi')}
              rows={6}
              placeholder="Tulis dengan jelas apa yang terjadi atau yang kamu usulkan"
              required
            />
          </label>

          <label className="kr-attach">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
            {file ? file.name : 'Tambah Lampiran (opsional)'}
            <input type="file" onChange={(e) => setFile(e.target.files[0] || null)} />
          </label>

          <div className="kr-info">
            Tingkat urgensi dideteksi otomatis dan diteruskan ke Guru BK kelasmu.
          </div>

          {error && <div className="kr-error">{error}</div>}

          <button className="kr-submit" disabled={loading}>
            {loading ? 'Mengirim...' : 'Kirim Aspirasi'}
          </button>
        </form>
      </section>
    </>
  );
}