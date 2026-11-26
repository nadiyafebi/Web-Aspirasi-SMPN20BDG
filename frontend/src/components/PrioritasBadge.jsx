import { PRIORITAS_LABEL } from '../utils.js';

const WARNA = {
    mendesak: { bg: '#FDE2E0', fg: '#8A1C13' },
    tinggi: { bg: '#FFECCB', fg: '#7A4A00' },
    biasa: { bg: '#E3EDF1', fg: '#2A4A5A' },
};
const dasar = { padding: '3px 10px', borderRadius: 999, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' };

export default function PrioritasBadge({ level }) {
    const w = WARNA[level] || WARNA.biasa;
    return <span style={{ ...dasar, background: w.bg, color: w.fg }}>{PRIORITAS_LABEL[level] || level}</span>;
}

export function TerlambatTag({ jam }) {
    const teks = jam >= 24 ? `${Math.floor(jam / 24)} hari` : `${jam} jam`;
    return <span style={{ ...dasar, background: '#8A1C13', color: '#fff' }}>Terlambat {teks}</span>;
}