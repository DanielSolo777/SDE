import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

type User = { id: string; email: string; name?: string; rol?: string };

type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx>({} as any);

// ---- Axios base + helpers ----
const api = axios.create({ baseURL: 'http://localhost:3000' });

function setAuthToken(token?: string) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
}

// Cargar token guardado al iniciar
const saved = localStorage.getItem('token');
if (saved) setAuthToken(saved);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ user: User }>('/auth/me')
      .then(r => setUser(r.data.user))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    setLoading(true);
    try {
      const { data } = await api.post<{ access_token: string; user: User }>(
        '/auth/login',
        { email, password }
      );
      setAuthToken(data.access_token);
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setAuthToken(undefined);
    setUser(null);
  }

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>;
};

export const useAuth = () => useContext(Ctx);
