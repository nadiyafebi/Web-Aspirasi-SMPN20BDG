export const KATEGORI = [
  'Sarana & Lingkungan',
  'Keamanan & Perlindungan Siswa',
  'Pembelajaran & Pelayanan Sekolah',
];

export const STATUS = ['diproses', 'diterima'];

export const STATUS_LABEL = {
  diproses: 'Diproses',
  diterima: 'Aspirasi Diterima',
};

export const PRIORITAS_LABEL = {
  mendesak: 'Mendesak',
  tinggi: 'Tinggi',
  biasa: 'Biasa',
};

/**
 * Mengubah string ISO / timestamp menjadi format tanggal teralokasi lokal Indonesia.
 * Menangani kasus input invalid / null secara aman.
 */
export const tanggal = (iso) => {
  if (!iso) return '-';

  const date = new Date(iso);
  // Mengecek apakah string tanggal valid
  if (isNaN(date.getTime())) return '-';

  return date.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

