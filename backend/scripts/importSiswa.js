require('dotenv').config();
const ExcelJS = require('exceljs');
const db = require('../config/db');

const file = process.argv[2];
if (!file) { console.error('Pakai: node scripts/importSiswa.js <file.xlsx>'); process.exit(1); }

(async () => {
  try {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(file);
    const data = [];
    const dobel = new Map();

    for (const ws of wb.worksheets) {
      const kelas = ws.name.match(/^KELAS\s*(\d)/i)?.[1];   // hanya sheet KELAS 7/8/9
      if (!kelas) continue;
      let rombel = null;

      ws.eachRow((row) => {
        const kol1 = String(row.getCell(1).value ?? '').trim();
        if (/^kelas$/i.test(kol1)) {                          // baris ": VII-A"
          rombel = String(row.getCell(4).value ?? '').replace(':', '').trim();
          return;
        }
        const urt  = row.getCell(1).value;
        const nisn = String(row.getCell(3).value ?? '').trim();
        const nama = String(row.getCell(4).value ?? '').trim();
        if (typeof urt === 'number' && /^\d{10}$/.test(nisn) && nama) {
          if (dobel.has(nisn)) console.warn(`NISN GANDA ${nisn}: ${dobel.get(nisn)} & ${nama}`);
          dobel.set(nisn, nama);
          data.push([nisn, nama, kelas, rombel]);
        }
      });
    }

    await db.query(
      `INSERT INTO siswa (nisn, nama, kelas, rombel) VALUES ?
       ON DUPLICATE KEY UPDATE nama = VALUES(nama), kelas = VALUES(kelas), rombel = VALUES(rombel)`,
      [data]
    );
    console.log(`Selesai: ${data.length} baris diproses.`);
  } catch (err) {
    console.error('Gagal:', err.message);
  } finally {
    process.exit();
  }
})();