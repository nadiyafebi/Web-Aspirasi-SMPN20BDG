import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import Navbar from './components/Navbar.jsx';
import SplashScreen from './components/SplashScreen.jsx';

const lazyPage = (importFn, minDelay = 500) =>
  lazy(() =>
    Promise.all([importFn(), new Promise((r) => setTimeout(r, minDelay))]).then(
      ([module]) => module
    )
  );

const Home = lazyPage(() => import('./pages/Home.jsx'));
const PilihKategori = lazyPage(() => import('./pages/PilihKategori.jsx'));
const KirimAspirasi = lazyPage(() => import('./pages/KirimAspirasi.jsx'));
const CekAspirasi = lazyPage(() => import('./pages/CekAspirasi.jsx'));
const LacakTiket = lazyPage(() => import('./pages/LacakTiket.jsx'));
const AdminLogin = lazyPage(() => import('./pages/admin/AdminLogin.jsx'));
const AdminDashboard = lazyPage(() => import('./pages/admin/AdminDashboard.jsx'));
const AdminDetail = lazyPage(() => import('./pages/admin/AdminDetail.jsx'));
const AdminRiwayat = lazyPage(() => import('./pages/admin/AdminRiwayat.jsx'));
const AdminStatistik = lazyPage(() => import('./pages/admin/AdminStatistik.jsx'));
const AdminProfil = lazyPage(() => import('./pages/admin/AdminProfil.jsx'));
const Cetak = lazyPage(() => import('./pages/admin/Cetak.jsx'));

const svg = (children) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

// --- NAVIGASI BAWAH SISWA ---
function BottomNav() {
  const { pathname } = useLocation();
  const kirimAktif = pathname === '/pilih-kategori' || pathname === '/kirim';

  return (
    <nav className="bottom-nav mobile-only">
      <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>
        {svg(<><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>)}
        <span>Beranda</span>
      </NavLink>
      <NavLink to="/pilih-kategori" className={kirimAktif ? 'active' : ''}>
        {svg(<><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>)}
        <span>Kirim</span>
      </NavLink>
      <NavLink to="/cek" className={({ isActive }) => (isActive ? 'active' : '')}>
        {svg(<><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>)}
        <span>Lacak</span>
      </NavLink>
    </nav>
  );
}

// --- NAVIGASI BAWAH ADMIN ---
function AdminBottomNav() {
  const guru = localStorage.getItem('peran') !== 'pimpinan';
  const cls = ({ isActive }) => (isActive ? 'active' : '');

  return (
    <nav className="bottom-nav mobile-only">
      <NavLink to="/admin" end className={cls}>
        {svg(<><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></>)}
        <span>Aspirasi</span>
      </NavLink>
      {guru && (
        <NavLink to="/admin/riwayat" className={cls}>
          {svg(<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>)}
          <span>Riwayat</span>
        </NavLink>
      )}
      <NavLink to="/admin/statistik" className={cls}>
        {svg(<><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>)}
        <span>Statistik</span>
      </NavLink>
      <NavLink to="/admin/profil" className={cls}>
        {svg(<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>)}
        <span>Profil</span>
      </NavLink>
    </nav>
  );
}

function Protected({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  const location = useLocation();
  const { token } = useAuth();
  const isAdminPage = location.pathname.startsWith('/admin');

  const [splash, setSplash] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 1800);
    const t2 = setTimeout(() => setSplash(false), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <>
      {splash && <SplashScreen leaving={leaving} />}

      <div className="desktop-only">
        <Navbar />
      </div>

      <main className="container">
        <Suspense fallback={<SplashScreen />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pilih-kategori" element={<PilihKategori />} />
            <Route path="/kirim" element={<KirimAspirasi />} />
            <Route path="/cek" element={<CekAspirasi />} />
            <Route path="/cek/:kode" element={<LacakTiket />} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Protected><AdminDashboard /></Protected>} />
            <Route path="/admin/aspirasi/:id" element={<Protected><AdminDetail /></Protected>} />
            <Route path="/admin/riwayat" element={<Protected><AdminRiwayat /></Protected>} />
            <Route path="/admin/statistik" element={<Protected><AdminStatistik /></Protected>} />
            <Route path="/admin/profil" element={<Protected><AdminProfil /></Protected>} />
            <Route path="/admin/cetak" element={<Protected><Cetak /></Protected>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {!isAdminPage && <BottomNav />}
      {isAdminPage && token && <AdminBottomNav />}
    </>
  );
}