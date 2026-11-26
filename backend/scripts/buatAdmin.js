require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

// ====== UBAH BAGIAN INI ======
const akun = [
  { username: 'bk7', password: 'aspirasi7', nama: 'Guru BK Kelas 7', kelas: '7', peran: 'guru' },
  { username: 'bk8', password: 'aspirasi8', nama: 'Guru BK Kelas 8', kelas: '8', peran: 'guru' },
  { username: 'bk9', password: 'aspirasi9', nama: 'Guru BK Kelas 9', kelas: '9', peran: 'guru' },
];
// =============================

(async () => {
  try {
    for (const a of akun) {
      const hash = await bcrypt.hash(a.password, 10);
      const [ada] = await db.query('SELECT id FROM admin WHERE username = ?', [a.username]);

      if (ada[0]) {
        await db.query(
          'UPDATE admin SET password = ?, nama = ?, kelas = ?, peran = ? WHERE id = ?',
          [hash, a.nama, a.kelas, a.peran, ada[0].id]
        );
        console.log('Diperbarui :', a.username);
      } else {
        await db.query(
          'INSERT INTO admin (username, password, nama, kelas, peran) VALUES (?,?,?,?,?)',
          [a.username, hash, a.nama, a.kelas, a.peran]
        );
        console.log('Dibuat     :', a.username);
      }
    }
  } catch (err) {
    console.error('Gagal:', err.message);
  } finally {
    process.exit();
  }
})();