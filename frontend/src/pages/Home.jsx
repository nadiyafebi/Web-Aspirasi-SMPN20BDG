import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const css = `
.home {
  --hm-green: #24574a;
  --hm-soft: #cfe0d2;

  max-width: 480px;
  width: 100%;
  margin: 0 auto;
}

/* Judul pakai font sans, bukan serif global */
.home h1,
.home h2,
.home h3 {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
}

/* Header (khusus mobile) */
.home-header { margin-bottom: 12px; }
.home-header h1 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: var(--brand);
}
.home-header p { margin: 2px 0 0; font-size: 0.8rem; color: var(--ink); }

/* Hero hijau */
.home-hero {
  background: var(--hm-green);
  color: #fff;
  border-radius: 14px;
  padding: 18px 16px;
  margin-bottom: 14px;
}
.home-hero h2 {
  margin: 0 0 6px;
  font-size: 1.3rem;
  line-height: 1.3;
  font-weight: 700;
  color: #fff;
}
.home-hero p { margin: 0 0 16px; font-size: 0.72rem; opacity: 0.95; }
.home-hero-btn {
  display: block;
  text-align: center;
  background: #f5f4e4;
  color: var(--hm-green);
  font-weight: 700;
  font-size: 0.95rem;
  padding: 12px;
  border-radius: 10px;
  text-decoration: none;
}

/* Langkah 1-2-3 */
.home-steps {
  display: flex;
  justify-content: space-between;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 14px 10px;
  margin-bottom: 12px;
}
.home-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--ink);
  text-align: center;
}
.home-step b {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--hm-green);
  color: #fff;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Alert privasi */
.home-alert {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--hm-soft);
  color: var(--hm-green);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 20px;
}
.home-alert svg { flex: none; }

/* Kategori */
.home-title {
  margin: 0 0 12px;
  font-size: 1rem;
  font-weight: 700;
  color: var(--brand);
}
.home-categories {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
}
.home-cat {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  height: 78px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-decoration: none;
  color: var(--ink);
  font-weight: 600;
  font-size: 0.8rem;
  transition: transform 0.15s ease, border-color 0.15s ease;
}
.home-cat:active { transform: scale(0.97); }
.home-cat:hover { border-color: var(--brand); }

/* Kode tiket */
.home-ticket {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 14px;
}
.home-ticket h3 { margin: 0 0 2px; font-size: 0.9rem; color: var(--ink); }
.home-ticket p { margin: 0 0 12px; font-size: 0.75rem; color: var(--muted); }
.home-ticket input {
  width: 70%;
  display: block;
  margin: 0 auto;
  text-align: center;
  font-family: ui-monospace, Menlo, monospace;
  font-weight: 700;
  letter-spacing: 2px;
  font-size: 0.8rem;
  padding: 10px;
}

.home-guru {
  display: block;
  text-align: center;
  margin-top: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--muted);
  text-decoration: underline;
}

/* Laptop (di atas 768px, supaya tidak bentrok dengan breakpoint HP di index.css) */
@media (min-width: 769px) {
  .home { max-width: 100%; }
  .home-header { display: none; }
  .home-hero { padding: 28px; }
  .home-hero h2 { font-size: 1.8rem; }
  .home-hero-btn { max-width: 300px; }
  .home-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    align-items: start;
  }
}
`;

const categories = [
  {
    name: 'Akademik',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    name: 'Fasilitas',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="18" rx="1" />
        <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
      </svg>
    ),
  },
  {
    name: 'Perundungan',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5z" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
    ),
  },
  {
    name: 'Saran & Ide',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M12 2a7 7 0 0 0-7 7c0 2.4 1.2 4.5 3 5.7V17h8v-2.3c1.8-1.2 3-3.3 3-5.7a7 7 0 0 0-7-7z" />
      </svg>
    ),
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [kode, setKode] = useState('');

  const cekTiket = (e) => {
    e.preventDefault();
    if (!kode.trim()) return;
    navigate(`/cek/${encodeURIComponent(kode.trim().toUpperCase())}`);
  };

  return (
    <>
      <style>{css}</style>

      <section className="home">
        {/* Header (khusus mobile) */}
        <header className="home-header">
          <h1>ASPIRASI</h1>
          <p>SMPN 2 Bandung</p>
        </header>

        {/* Kartu hijau utama */}
        <div className="home-hero">
          <h2>
            Suaramu penting.
            <br />
            Sampaikan dengan aman.
          </h2>
          <p>Tanpa akun. Identitas tidak wajib diketahui</p>
          <Link to="/pilih-kategori" className="home-hero-btn">
            Kirim Aspirasi
          </Link>
        </div>

        <div className="home-grid">
          {/* Kolom kiri */}
          <div className="home-col">
            <div className="home-steps">
              <div className="home-step">
                <b>1</b>
                <span>Tulis aspirasi</span>
              </div>
              <div className="home-step">
                <b>2</b>
                <span>Dapat kode tiket</span>
              </div>
              <div className="home-step">
                <b>3</b>
                <span>Pantau balasan</span>
              </div>
            </div>

            <div className="home-alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>
                Identitasmu dirahasiakan,
                <br />
                hanya Guru BK yang membaca.
              </span>
            </div>
          </div>

          {/* Kolom kanan */}
          <div className="home-col">
            <h3 className="home-title">Pilih kategori</h3>
            <div className="home-categories">
              {categories.map((c) => (
                <Link
                  key={c.name}
                  to={`/pilih-kategori?kategori=${encodeURIComponent(c.name)}`}
                  className="home-cat"
                >
                  {c.icon}
                  <span>{c.name}</span>
                </Link>
              ))}
            </div>

            <form className="home-ticket" onSubmit={cekTiket}>
              <h3>Punya kode tiket?</h3>
              <p>Masukkan kode tiket untuk melihat balasan Guru BK</p>
              <input
                type="text"
                placeholder="ASP-XXX-XXXX"
                value={kode}
                onChange={(e) => setKode(e.target.value)}
              />
            </form>
          </div>
        </div>

        <Link to={localStorage.getItem('token') ? '/admin' : '/admin/login'} className="home-guru">
          Masuk sebagai Guru BK
        </Link>
      </section>
    </>
  );
}