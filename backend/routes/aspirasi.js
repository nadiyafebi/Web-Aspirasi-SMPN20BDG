const router = require('express').Router();
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const db = require('../config/db');
const { buatKode, hashKode } = require('../utils/kode');
const { hitungPrioritas } = require('../utils/triase');

const KATEGORI = [
  'Sarana & Lingkungan',
  'Keamanan & Perlindungan Siswa',
  'Pembelajaran & Pelayanan Sekolah',
];

// Pembanding kode akses (aman dari serangan pengukuran waktu)
const samaKode = (a, b) => {
  const x = crypto.createHash('sha256').update(String(a || '').trim().toUpperCase()).digest();
  const y = crypto.createHash('sha256').update(String(b || '').trim().toUpperCase()).digest();
  return crypto.timingSafeEqual(x, y);
};

// Rate limiter
const batasGagal = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  limit: 10,
  skipSuccessfulRequests: true,
  message: { message: 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.' },
});

const batasCek = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  limit: 30,
  message: { message: 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.' },
});

const batasKirim = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 menit
  limit: 20,
  message: { message: 'Terlalu banyak kiriman. Coba lagi nanti.' },
});

// Siswa kirim aspirasi (wajib kode akses sekolah)
router.post('/', batasGagal, batasKirim, async (req, res) => {
  try {
    if (!process.env.KODE_AKSES_SEKOLAH)
      return res.status(500).json({ message: 'Kode akses belum diatur di server' });
    if (!samaKode(req.body.kode_akses, process.env.KODE_AKSES_SEKOLAH))
      return res.status(403).json({ message: 'Kode akses salah. Tanyakan kode akses kepada guru BK atau wali kelasmu.' });

    const { inisial, kelas, kategori, judul, isi } = req.body;

    if (!/^[A-Za-z]{1,5}$/.test(inisial || ''))
      return res.status(400).json({ message: 'Inisial harus 1-5 huruf' });
    if (!['7', '8', '9'].includes(String(kelas)))
      return res.status(400).json({ message: 'Kelas harus 7, 8, atau 9' });
    if (!KATEGORI.includes(kategori))
      return res.status(400).json({ message: 'Kategori tidak valid' });
    if (!judul || !isi)
      return res.status(400).json({ message: 'Judul dan isi wajib diisi' });
    if (judul.length > 150 || isi.length > 5000)
      return res.status(400).json({ message: 'Judul atau isi terlalu panjang' });

    const t = hitungPrioritas({ kategori, judul, isi });
    const kode = buatKode();

    // Query INSERT yang sudah menyertakan 'kode_tiket' dan 'kode_hash'
    await db.query(
      `INSERT INTO aspirasi
        (kode_tiket, kode_hash, inisial, kelas, kategori, judul, isi, skor_prioritas, level_prioritas, alasan_prioritas)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        kode, 
        hashKode(kode), 
        inisial.toUpperCase(), 
        String(kelas), 
        kategori, 
        judul.trim(), 
        isi.trim(),
        t.skor, 
        t.level, 
        t.alasan
      ]
    );
    res.status(201).json({ message: 'Aspirasi terkirim', kode_tiket: kode });
  } catch (err) {
    console.error("DEBUG ERROR POST /api/aspirasi:", err);
    res.status(500).json({ message: 'Server Error: ' + err.message, sqlMessage: err.sqlMessage || null });
  }
});

// Siswa cek aspirasi + balasan lewat kode tiket
router.get('/kode/:kode', batasCek, async (req, res) => {
  try {
    const kode = req.params.kode.trim().toUpperCase();
    const [rows] = await db.query(
      `SELECT id, inisial, kelas, kategori, judul, isi, status, created_at
       FROM aspirasi WHERE kode_hash = ?`,
      [hashKode(kode)]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Kode tiket tidak ditemukan' });

    const [balasan] = await db.query(
      `SELECT b.isi, b.created_at, a.nama AS guru
       FROM balasan b JOIN admin a ON a.id = b.admin_id
       WHERE b.aspirasi_id = ? ORDER BY b.created_at`,
      [rows[0].id]
    );
    const { id, ...data } = rows[0];
    res.json({ ...data, kode_tiket: kode, balasan });
  } catch (err) {
    console.error("DEBUG ERROR GET /api/aspirasi:", err);
    res.status(500).json({ message: 'Server Error: ' + err.message });
  }
});

module.exports = router;