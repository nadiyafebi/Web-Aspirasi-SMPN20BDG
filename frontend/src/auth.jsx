import { createContext, useContext, useState } from 'react';
import { api } from './api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const KUNCI = ['token', 'nama', 'kelas', 'peran'];

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [nama, setNama] = useState(localStorage.getItem('nama'));

  const login = async (username, password) => {
    const res = await api.login(username, password);
    localStorage.setItem('token', res.token);
    localStorage.setItem('nama', res.nama);
    localStorage.setItem('peran', res.peran);
    localStorage.setItem('kelas', res.kelas ?? '');
    setToken(res.token);
    setNama(res.nama);
  };

  const logout = () => {
    KUNCI.forEach((k) => localStorage.removeItem(k));
    setToken(null);
    setNama(null);
  };

  return <AuthContext.Provider value={{ token, nama, login, logout }}>{children}</AuthContext.Provider>;
}