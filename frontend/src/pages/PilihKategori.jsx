import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const css = `
.pk {
  --hm-green: #24574a;
  --hm-soft: #cfe0d2;
  max-width: 560px;
  width: 100%;
  margin: 0 auto;
}
.pk h2, .pk h3 { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }

.pk-head {
  display: grid;
  grid-template-columns: 36px 1fr 36px;
  align-items: center;
  margin-bottom: 8px;
}
.pk-back {
  background: none;
  border: 0;
  cursor: pointer;
  color: var(--ink);
  padding: 6px;
  display: grid;
  place-items: center;
  justify-self: start;
}
.pk-title {
  margin: 0;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--brand);
}
.pk-sub { margin: 0 0 16px; font-size: 0.85rem; color: var(--ink); }

.pk-list { display: grid; gap: 12px; }
.pk-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
}
.pk-card.open { border: 1.5px solid var(--hm-green); }

.pk-top {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: none;
  border: 0;
  font: inherit;
  color: inherit;
  text-align: left;
  cursor: pointer;
}
.pk-ico { flex: none; display: grid; place-items: center; color: var(--ink); }
.pk-name { display: block; font-weight: 700; font-size: 0.9rem; }
.pk-hint { display: block; font-size: 0.75rem; color: var(--muted); }
.pk-chev { margin-left: auto; flex: none; transition: transform 0.2s ease; }
.pk-card.open .pk-chev { transform: rotate(180deg); }

.pk-body { padding: 0 14px 14px; font-size: 0.82rem; }
.pk-desc { margin: 0 0 12px; line-height: 1.5; }
.pk-label { margin: 0 0 6px; font-weight: 700; }
.pk-chips {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 12px;
}
.pk-chip {
  background: color-mix(in srgb, var(--brand) 8%, var(--surface));
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 0.75rem;
}
.pk-note {
  background: var(--hm-soft);
  color: #1d3b32;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 0.75rem;
  line-height: 1.5;
  margin-bottom: 12px;
}
.pk-btn {
  width: 100%;
  background: var(--hm-green);
  color: #fff;
  border: 0;
  border-radius: 10px;
  padding: 13px;
  font: inherit;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
}
`;

const icon = (children) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const items = [
  {
    name: 'Akademik',
    hint: 'Pelajaran, tugas, dan ujian',
    icon: icon(<><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></>),
    desc: 'Hal yang berkaitan dengan kegiatan belajar, seperti cara mengajar, beban tugas, penilaian, atau jadwal ujian.',
    contoh: ['Tugas terlalu menumpuk', 'Nilai tidak sesuai', 'Jadwal ujian bentrok', 'Materi sulit dipahami'],
    penting: 'Sampaikan dengan jelas dan sopan agar mudah ditindaklanjuti.',
    tombol: 'Laporan Akademik',
  },
  {
    name: 'Fasilitas',
    hint: 'Kelas, toilet, lapangan, perpustakaan',
    icon: icon(<><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" /></>),
    desc: 'Sarana dan prasarana sekolah yang rusak, kurang, atau tidak layak digunakan.',
    contoh: ['Toilet kotor atau rusak', 'Kipas/AC kelas mati', 'Buku perpustakaan kurang', 'Lapangan berlubang'],
    penting: 'Sebutkan lokasi dan kondisinya sedetail mungkin supaya cepat ditangani.',
    tombol: 'Laporan Fasilitas',
  },
  {
    name: 'Perundungan',
    hint: 'Apa itu perundungan (bullying) ?',
    icon: icon(<><path d="M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5z" /><path d="M12 8v4M12 16h.01" /></>),
    desc: 'Ketika seseorang disakiti atau dibuat tidak nyaman berulang kali, korbannya sulit membela diri. Bisa terjadi langsung maupun lewat media sosial.',
    contoh: ['Diejek terus-menerus', 'Barang disembunyikan atau dirusak', 'Dipukul atau didorong', 'Dihina di grup chat'],
    penting: 'Ini bukan salahmu, dan kamu boleh melapor tanpa menyebut namamu. Kalau melihat temanmu mengalaminya, kamu juga boleh melapor.',
    tombol: 'Laporan Perundungan',
  },
  {
    name: 'Saran & Ide',
    hint: 'Usul dan ucapan terima kasih',
    icon: icon(<><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 0-7 7c0 2.4 1.2 4.5 3 5.7V17h8v-2.3c1.8-1.2 3-3.3 3-5.7a7 7 0 0 0-7-7z" /></>),
    desc: 'Ide, usulan, atau ucapan terima kasih untuk membuat sekolah menjadi lebih baik.',
    contoh: ['Usul kegiatan ekstrakurikuler', 'Ide lomba antarkelas', 'Terima kasih untuk guru', 'Saran jadwal piket'],
    penting: 'Ide kecil pun berarti. Tulis dengan jelas supaya mudah dipertimbangkan.',
    tombol: 'Kirim Saran & Ide',
  },
];

export default function PilihKategori() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null); // ganti 'Perundungan' kalau mau terbuka dari awal

  const pilih = (kategori) => {
    navigate(`/kirim?kategori=${encodeURIComponent(kategori)}`);
  };

  return (
    <>
      <style>{css}</style>

      <section className="pk">
        <div className="pk-head">
          <button type="button" className="pk-back" onClick={() => navigate(-1)} aria-label="Kembali">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h2 className="pk-title">Pilih Kategori</h2>
          <span />
        </div>

        <p className="pk-sub">Belum yakin? Ketuk kategori untuk melihat penjelasan dan contohnya.</p>

        <div className="pk-list">
          {items.map((it) => {
            const isOpen = open === it.name;
            return (
              <div key={it.name} className={`pk-card ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className="pk-top"
                  onClick={() => setOpen(isOpen ? null : it.name)}
                  aria-expanded={isOpen}
                >
                  <span className="pk-ico">{it.icon}</span>
                  <span>
                    <span className="pk-name">{it.name}</span>
                    <span className="pk-hint">{it.hint}</span>
                  </span>
                  <svg className="pk-chev" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="pk-body">
                    <p className="pk-desc">{it.desc}</p>
                    <p className="pk-label">Contohnya :</p>
                    <div className="pk-chips">
                      {it.contoh.map((c) => (
                        <span key={c} className="pk-chip">{c}</span>
                      ))}
                    </div>
                    <div className="pk-note">
                      <b>Penting diingat :</b> {it.penting}
                    </div>
                    <button type="button" className="pk-btn" onClick={() => pilih(it.name)}>
                      {it.tombol}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}