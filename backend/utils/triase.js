const MENDESAK = [
  'bunuh diri', 'ingin mati', 'pengen mati', 'mau mati', 'mengakhiri hidup',
  'melukai diri', 'menyakiti diri', 'diperkosa', 'dilecehkan', 'pelecehan',
  'diancam', 'mengancam', 'senjata tajam', 'pisau', 'narkoba',
  'dikeroyok', 'dipalak', 'dipukul', 'memukul', 'kekerasan',
];
const TINGGI = [
  'bully', 'bullying', 'perundungan', 'diejek', 'dihina', 'dijauhi',
  'diintimidasi', 'berkelahi', 'tawuran', 'tertekan', 'depresi', 'cemas',
  'takut', 'tidak aman', 'merokok', 'vape', 'mencuri', 'dicuri',
  'korsleting', 'listrik', 'roboh', 'berbahaya', 'kebakaran',
];
const SEDANG = [
  'rusak', 'bocor', 'kotor', 'bau', 'licin', 'panas', 'gelap',
  'sampah', 'banjir', 'tidak jelas', 'kurang jelas',
];
const ULANG = ['sering', 'setiap hari', 'berulang', 'terus menerus', 'terus-menerus', 'sudah lama', 'berkali-kali'];

const normal = (t) =>
  ' ' + String(t || '').toLowerCase().replace(/[^a-z0-9\- ]+/g, ' ').replace(/\s+/g, ' ') + ' ';

exports.hitungPrioritas = ({ kategori, judul, isi }) => {
  const teks = normal(`${judul} ${isi}`);
  const cocok = [];
  let skor = 0;
  let kritis = false;

  const cek = (daftar, bobot, penting = false) =>
    daftar.forEach((k) => {
      if (teks.includes(k)) {
        skor += bobot;
        cocok.push(k);
        if (penting) kritis = true;
      }
    });

  cek(MENDESAK, 5, true);
  cek(TINGGI, 3);
  cek(SEDANG, 1);
  if (ULANG.some((k) => teks.includes(k))) { skor += 1; cocok.push('(berulang)'); }
  if (kategori === 'Keamanan & Perlindungan Siswa') skor += 2;

  let level = 'biasa';
  if (kritis || skor >= 8) level = 'mendesak';
  else if (skor >= 3) level = 'tinggi';

  return { skor, level, alasan: cocok.join(', ').slice(0, 250) };
};