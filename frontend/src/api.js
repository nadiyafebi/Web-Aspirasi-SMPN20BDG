const BASE = import.meta.env.VITE_API_URL || '/api';

export const getToken = () => localStorage.getItem('token');

// Utility untuk konversi object ke Query String
const qs = (obj = {}) => {
  const p = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      p.append(k, v);
    }
  });
  const s = p.toString();
  return s ? `?${s}` : '';
};

// Centralized Fetch Helper
async function request(path, { method = 'GET', body, admin = false } = {}) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (admin) headers.Authorization = `Bearer ${getToken()}`;

  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Tidak bisa terhubung ke server. Pastikan backend sudah berjalan.');
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (admin && res.status === 401) {
      ['token', 'nama', 'kelas', 'peran'].forEach((k) => localStorage.removeItem(k));
      window.location.href = '/admin/login';
    }
    throw new Error(data.message || 'Terjadi kesalahan');
  }
  return data;
}

export const labelStatus = (s) => (s === 'diterima' ? 'Aspirasi Diterima' : 'Diproses');

export const api = {
  // ===== Publik (siswa) =====
  kirimAspirasi: (data) => request('/aspirasi', { method: 'POST', body: data }),
  cekKode: (kode) => request(`/aspirasi/kode/${encodeURIComponent(kode.trim())}`),

  // ===== Admin Core =====
  login: (username, password) => request('/auth/login', { method: 'POST', body: { username, password } }),
  daftar: (filter = {}) => request(`/admin/aspirasi${qs(filter)}`, { admin: true }),
  riwayat: (filter = {}) => request(`/admin/riwayat${qs(filter)}`, { admin: true }),
  detail: (id) => request(`/admin/aspirasi/${id}`, { admin: true }),
  balas: (id, isi) => request(`/admin/aspirasi/${id}/balasan`, { method: 'POST', body: { isi }, admin: true }),
  ubahStatus: (id, status) => request(`/admin/aspirasi/${id}/status`, { method: 'PATCH', body: { status }, admin: true }),

  // ===== Admin Tambahan (prioritas, statistik, eskalasi) =====
  aspirasi: (filter = {}) => request(`/admin/aspirasi${qs(filter)}`, { admin: true }),
  statistik: (filter = {}) => request(`/admin/statistik${qs(filter)}`, { admin: true }),
  setPrioritas: (id, level) => request(`/admin/aspirasi/${id}/prioritas`, { method: 'PATCH', body: { level }, admin: true }),
  ubahPassword: (data) => request('/admin/password', { method: 'PATCH', body: data, admin: true }),
};