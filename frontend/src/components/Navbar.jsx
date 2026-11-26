import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function Navbar() {
  const { token, nama, logout } = useAuth();
  const nav = useNavigate();
  const inAdmin = useLocation().pathname.startsWith('/admin');
  const guru = localStorage.getItem('peran') !== 'pimpinan';

  return (
    <header className="navbar">
      <div className="container navbar-in">
        <Link to="/" className="brand">
          <span className="brand-mark">A</span>
          <span>Aspirasi <em>SMPN 2</em></span>
        </Link>
        <nav>
          {inAdmin && token ? (
            /* Menu Jika Sedang Login Sebagai Admin/Guru */
            <>
              <NavLink to="/admin" end>Aspirasi</NavLink>
              {guru && <NavLink to="/admin/riwayat">Riwayat</NavLink>}
              <NavLink to="/admin/statistik">Statistik</NavLink>
              <NavLink to="/admin/profil">Profil</NavLink>
              <span className="nav-user">{nama}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => { logout(); nav('/admin/login'); }}>Keluar</button>
            </>
          ) : (
            /* Menu Untuk Siswa / Umum */
            <>
              <NavLink to="/" end>Beranda</NavLink>
              <NavLink to="/pilih-kategori">Kirim</NavLink>
              <NavLink to="/cek">Lacak</NavLink>
              <NavLink to={token ? '/admin' : '/admin/login'} className="nav-admin">Guru</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}