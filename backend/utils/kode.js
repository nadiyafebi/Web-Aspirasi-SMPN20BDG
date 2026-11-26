const crypto = require('crypto');

exports.buatKode = () => 'ASP-' + crypto.randomBytes(4).toString('hex').toUpperCase();

exports.hashKode = (kode) =>
  crypto
    .createHmac('sha256', process.env.KODE_SECRET)
    .update(String(kode).trim().toUpperCase())
    .digest('hex');