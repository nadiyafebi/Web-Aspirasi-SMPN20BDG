const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');

const BATAS = Number(process.env.BATAS_TERLAMBAT_JAM || 48);
const LEVEL = 'COALESCE(level_guru, level_prioritas)';
const TERLAMBAT = "(status = 'diproses' AND TIMESTAMPDIFF(HOUR, created_at, NOW()) >= ?)";
const KOLOM = `id, inisial, kelas, kategori, judul, status, skor_prioritas, alasan_prioritas,
  level_prioritas, level_guru, ${LEVEL} AS prioritas, created_at, dibalas_at,
  ${TERLAMBAT} AS terlambat,
  TIMESTAMPDIFF(HOUR, created_at, COALESCE(dibalas_at, NOW())) AS jam_respons`;
const URUTAN = `(status = 'diproses') DESC, FIELD(${LEVEL}, 'mendesak', 'tinggi', 'biasa'),
  CASE WHEN status = 'diproses' THEN created_at END ASC, created_at DESC`;

router.use(auth);

const hanyaGuru = (req, res, next) =>
  req.admin.peran === 'guru'
    ? next()
    : res.status(403).json({ message: 'Hanya guru BK yang dapat melakukan ini' });

// Guru: hanya kelasnya. Pimpinan: semua kelas (atau ?kelas=)
function lingkup(req) {
  if (req.admin.peran === 'guru') return { sql: 'kelas = ?', params: [req.admin.kelas] };
  const k = req.query.kelas;
  if (['7', '8', '9'].includes(k)) return { sql: 'kelas = ?', params: [k] };
  return { sql: '1=1', params: [] };
}

const angka = (v) => (v === null || v === undefined ? 0 : Number(v));

// Daftar aspirasi (?status=&prioritas=&terlambat=1&kelas= khusus pimpinan)
router.get('/aspirasi', async (req, res) => {
  try {
    const { status, prioritas, terlambat } = req.query;
    const sc = lingkup(req);
    let sql = `SELECT ${KOLOM} FROM aspirasi WHERE ${sc.sql}`;
    const params = [BATAS, ...sc.params];
    if (status)    { sql += ' AND status = ?'; params.push(status); }
    if (prioritas) { sql += ` AND ${LEVEL} = ?`; params.push(prioritas); }
    if (terlambat === '1') { sql += ` AND ${TERLAMBAT}`; params.push(BATAS); }
    sql += ` ORDER BY ${URUTAN}`;

    const [rows] = await db.query(sql, params);
    // Pimpinan tidak melihat isi: judul dan alasan prioritas disembunyikan
    res.json(
      req.admin.peran === 'pimpinan'
        ? rows.map((r) => ({ ...r, judul: '(disembunyikan)', alasan_prioritas: null }))
        : rows
    );
  } catch (err) {
    console.error('[GET /aspirasi]', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Statistik ringkas
// Statistik ringkas (?periode=minggu|bulan|semester)
router.get('/statistik', async (req, res) => {
  try {
    const sc = lingkup(req);
    const interval = { minggu: '7 DAY', bulan: '1 MONTH', semester: '6 MONTH' }[req.query.periode];
    const where = interval
      ? `${sc.sql} AND created_at >= DATE_SUB(NOW(), INTERVAL ${interval})`
      : sc.sql;

    const [[r]] = await db.query(
      `SELECT COUNT(*) AS total,
              SUM(status = 'diproses') AS diproses,
              SUM(status = 'diterima') AS diterima,
              SUM(${TERLAMBAT}) AS terlambat,
              ROUND(AVG(TIMESTAMPDIFF(MINUTE, created_at, dibalas_at)) / 60, 1) AS rata_jam_respons
       FROM aspirasi WHERE ${where}`,
      [BATAS, ...sc.params]
    );
    const [per_kategori] = await db.query(
      `SELECT kategori, COUNT(*) AS jumlah FROM aspirasi WHERE ${where} GROUP BY kategori`, sc.params);
    const [per_prioritas] = await db.query(
      `SELECT ${LEVEL} AS prioritas, COUNT(*) AS jumlah FROM aspirasi WHERE ${where} GROUP BY prioritas`,
      sc.params);
    // Minggu berjalan: 0 = Senin ... 6 = Minggu
    const [per_hari] = await db.query(
      `SELECT WEEKDAY(created_at) AS hari, COUNT(*) AS jumlah FROM aspirasi
       WHERE ${sc.sql} AND YEARWEEK(created_at, 1) = YEARWEEK(NOW(), 1) GROUP BY hari`,
      sc.params);

    res.json({
      total: angka(r.total),
      diproses: angka(r.diproses),
      diterima: angka(r.diterima),
      terlambat: angka(r.terlambat),
      rata_jam_respons: r.rata_jam_respons === null ? null : Number(r.rata_jam_respons),
      per_kategori,
      per_prioritas,
      per_hari,
    });
  } catch (err) {
    console.error('[GET /statistik]', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Riwayat lengkap + balasan untuk cetak (guru saja)
router.get('/riwayat', hanyaGuru, async (req, res) => {
  try {
    const { status, dari, sampai } = req.query;
    let sql = `SELECT ${KOLOM}, isi FROM aspirasi WHERE kelas = ?`;
    const params = [BATAS, req.admin.kelas];
    if (status) { sql += ' AND status = ?'; params.push(status); }
    if (dari)   { sql += ' AND DATE(created_at) >= ?'; params.push(dari); }
    if (sampai) { sql += ' AND DATE(created_at) <= ?'; params.push(sampai); }
    sql += ` ORDER BY ${URUTAN}`;

    const [rows] = await db.query(sql, params);
    if (rows.length) {
      const [bal] = await db.query(
        `SELECT b.aspirasi_id, b.isi, b.created_at, a.nama AS guru
         FROM balasan b JOIN admin a ON a.id = b.admin_id
         WHERE b.aspirasi_id IN (?) ORDER BY b.created_at`,
        [rows.map((r) => r.id)]
      );
      rows.forEach((r) => (r.balasan = bal.filter((b) => b.aspirasi_id === r.id)));
    }
    res.json(rows);
  } catch (err) {
    console.error('[GET /riwayat]', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Detail + balasan (guru saja)
router.get('/aspirasi/:id', hanyaGuru, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT ${KOLOM}, isi FROM aspirasi WHERE id = ? AND kelas = ?`,
      [BATAS, req.params.id, req.admin.kelas]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Data tidak ditemukan' });

    const [balasan] = await db.query(
      `SELECT b.id, b.isi, b.created_at, a.nama AS guru
       FROM balasan b JOIN admin a ON a.id = b.admin_id
       WHERE b.aspirasi_id = ? ORDER BY b.created_at`,
      [req.params.id]
    );
    res.json({ ...rows[0], balasan });
  } catch (err) {
    console.error('[GET /aspirasi/:id]', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Balas: status otomatis "diterima" dan waktu balasan pertama tercatat
router.post('/aspirasi/:id/balasan', hanyaGuru, async (req, res) => {
  try {
    const { isi } = req.body;
    if (!isi) return res.status(400).json({ message: 'Isi balasan wajib diisi' });

    const [cek] = await db.query(
      'SELECT id FROM aspirasi WHERE id = ? AND kelas = ?',
      [req.params.id, req.admin.kelas]
    );
    if (!cek[0]) return res.status(404).json({ message: 'Data tidak ditemukan' });

    await db.query('INSERT INTO balasan (aspirasi_id, admin_id, isi) VALUES (?,?,?)',
      [req.params.id, req.admin.id, isi]);
    await db.query(
      "UPDATE aspirasi SET status = 'diterima', dibalas_at = COALESCE(dibalas_at, NOW()) WHERE id = ?",
      [req.params.id]
    );
    res.status(201).json({ message: 'Balasan terkirim' });
  } catch (err) {
    console.error('[POST /aspirasi/:id/balasan]', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Penilaian guru atas level prioritas (data pembanding akurasi triase)
router.patch('/aspirasi/:id/prioritas', hanyaGuru, async (req, res) => {
  try {
    const { level } = req.body;
    if (!['biasa', 'tinggi', 'mendesak'].includes(level))
      return res.status(400).json({ message: 'Level tidak valid' });

    const [h] = await db.query(
      'UPDATE aspirasi SET level_guru = ? WHERE id = ? AND kelas = ?',
      [level, req.params.id, req.admin.kelas]
    );
    if (!h.affectedRows) return res.status(404).json({ message: 'Data tidak ditemukan' });
    res.json({ message: 'Penilaian disimpan' });
  } catch (err) {
    console.error('[PATCH /aspirasi/:id/prioritas]', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// Ubah kata sandi (guru & pimpinan)
router.patch('/password', async (req, res) => {
  try {
    const { lama, baru } = req.body;
    if (!lama || !baru)
      return res.status(400).json({ message: 'Kata sandi lama dan baru wajib diisi' });
    if (baru.length < 8)
      return res.status(400).json({ message: 'Kata sandi baru minimal 8 karakter' });

    const [rows] = await db.query('SELECT password FROM admin WHERE id = ?', [req.admin.id]);
    if (!rows[0] || !(await bcrypt.compare(lama, rows[0].password)))
      return res.status(400).json({ message: 'Kata sandi lama salah' });

    const hash = await bcrypt.hash(baru, 10);
    await db.query('UPDATE admin SET password = ? WHERE id = ?', [hash, req.admin.id]);
    res.json({ message: 'Kata sandi berhasil diubah' });
  } catch (err) {
    console.error('[PATCH /password]', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

module.exports = router;