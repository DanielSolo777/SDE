import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import '../index.css'; // usaremos estilos globales aquí

export default function LoginPage() {
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/dashboard" replace />;

  const [email, setEmail] = useState('daniel@example.com');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [msg, setMsg] = useState<{type:'error'|'success'; text:string}|null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    try {
      await login(email, password);
      setMsg({ type: 'success', text: 'Autenticación correcta' });
      navigate('/dashboard');
    } catch (err: any) {
      const reason = err?.response?.data?.message ?? 'Error al iniciar sesión';
      setMsg({ type: 'error', text: String(reason) });
    }
  }

  return (
    <div className="login-wrap">
      <div className="card">
        <div className="brand">
          <div className="brand-logo" />
          <h1>SGDD • Acceso</h1>
        </div>

        <h2>Login</h2>
        <p className="helper">Ingresa tus credenciales para continuar</p>

        <form onSubmit={onSubmit} noValidate>
          <div className="field">
            <label className="label" htmlFor="email">Email</label>
            <div className="input">
              <input id="email" type="email" required value={email}
                     onChange={e=>setEmail(e.target.value)} placeholder="correo@empresa.com" />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="password">Contraseña</label>
            <div className="input">
              <input id="password" required
                     type={showPwd ? 'text' : 'password'}
                     value={password} onChange={e=>setPassword(e.target.value)}
                     placeholder="••••••••" />
              <button type="button" className="eye" onClick={()=>setShowPwd(s=>!s)}>
                {showPwd ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        {msg && <div className={msg.type === 'error' ? 'error' : 'success'}>{msg.text}</div>}

        <div className="footer">© {new Date().getFullYear()} SGDD — Accesos seguros</div>
      </div>
    </div>
  );
}
