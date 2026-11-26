const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await db.query('SELECT * FROM admin WHERE username = ?', [username]);
    const admin = rows[0];
    if (!admin || !(await bcrypt.compare(password, admin.password)))
      return res.status(401).json({ message: 'Username atau password salah' });

    const token = jwt.sign(
        { id: admin.id, nama: admin.nama, kelas: admin.kelas, peran: admin.peran },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
    );
    res.json({ token, nama: admin.nama, kelas: admin.kelas, peran: admin.peran });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

module.exports = router;