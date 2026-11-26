import { STATUS_LABEL, tanggal } from './utils.js';

const baris = (rows) =>
  rows.map((r, i) => ({
    no: i + 1,
    kode: r.kode_tiket,
    tanggal: tanggal(r.created_at),
    pengirim: `${r.inisial} / Kelas ${r.kelas}`,
    kategori: r.kategori,
    judul: r.judul,
    isi: r.isi,
    status: STATUS_LABEL[r.status] || r.status,
    balasan:
      (r.balasan || []).map((b) => `${b.guru} (${tanggal(b.created_at)}): ${b.isi}`).join('\n') || '-',
  }));

const hariIni = () => new Date().toISOString().slice(0, 10);

export async function exportPDF(rows, info = '') {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  doc.setFontSize(14);
  doc.text('Laporan Aspirasi Siswa SMPN 2', 40, 40);
  doc.setFontSize(9);
  doc.text(`Dicetak: ${tanggal(new Date().toISOString())}  |  Total: ${rows.length} aspirasi${info ? '  |  ' + info : ''}`, 40, 56);

  autoTable(doc, {
    startY: 70,
    head: [['No', 'Kode', 'Tanggal', 'Pengirim', 'Kategori', 'Judul', 'Isi', 'Status', 'Balasan']],
    body: baris(rows).map((r) => [r.no, r.kode, r.tanggal, r.pengirim, r.kategori, r.judul, r.isi, r.status, r.balasan]),
    styles: { fontSize: 8, cellPadding: 4, valign: 'top' },
    headStyles: { fillColor: [15, 92, 77] },
    columnStyles: {
      0: { cellWidth: 24 }, 1: { cellWidth: 58 }, 2: { cellWidth: 62 }, 3: { cellWidth: 56 },
      4: { cellWidth: 70 }, 5: { cellWidth: 80 }, 6: { cellWidth: 150 }, 7: { cellWidth: 52 }, 8: { cellWidth: 150 },
    },
  });

  doc.save(`riwayat-aspirasi-${hariIni()}.pdf`);
}

export async function exportExcel(rows) {
  const mod = await import('exceljs');
  const ExcelJS = mod.default || mod;

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Riwayat Aspirasi');
  ws.columns = [
    { header: 'No', key: 'no', width: 5 },
    { header: 'Kode Tiket', key: 'kode', width: 14 },
    { header: 'Tanggal', key: 'tanggal', width: 20 },
    { header: 'Pengirim', key: 'pengirim', width: 16 },
    { header: 'Kategori', key: 'kategori', width: 28 },
    { header: 'Judul', key: 'judul', width: 30 },
    { header: 'Isi Aspirasi', key: 'isi', width: 50 },
    { header: 'Status', key: 'status', width: 18 },
    { header: 'Balasan', key: 'balasan', width: 50 },
  ];
  ws.addRows(baris(rows));

  ws.eachRow((row) => { row.alignment = { vertical: 'top', wrapText: true }; });
  const head = ws.getRow(1);
  head.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  head.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F5C4D' } };
  ws.views = [{ state: 'frozen', ySplit: 1 }];
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: ws.columns.length } };

  const buf = await wb.xlsx.writeBuffer();
  const url = URL.createObjectURL(
    new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  );
  const a = document.createElement('a');
  a.href = url;
  a.download = `riwayat-aspirasi-${hariIni()}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}