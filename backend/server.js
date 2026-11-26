require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/ping', (req, res) => res.json({ message: 'Backend aktif' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/aspirasi', require('./routes/aspirasi'));
app.use('/api/admin', require('./routes/admin'));

app.listen(process.env.PORT, '0.0.0.0', () =>
  console.log(`Server jalan di port ${process.env.PORT}`)
);