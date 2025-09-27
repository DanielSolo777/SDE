import { useState, useRef } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import '../styles/login-navy.css'; // <- tu CSS del diseño

export default function LoginPage() {
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/dashboard" replace />;

  const [email, setEmail] = useState('daniel@example.com');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [msg, setMsg] = useState<{type:'error'|'success'; text:string}|null>(null);

  // Modal “¿Olvidaste tu contraseña?”
  const [modalOpen, setModalOpen] = useState(false);
  const [recoverEmail, setRecoverEmail] = useState('');
  const [recoverError, setRecoverError] = useState('');
  const recoverRef = useRef<HTMLInputElement>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const isValid = emailRegex.test(email.trim()) && password.length >= 6;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!isValid) return;
    try {
      await login(email, password);
      setMsg({ type: 'success', text: 'Autenticación correcta' });
      navigate('/dashboard');
    } catch (err: any) {
      const reason = err?.response?.data?.message ?? 'Error al iniciar sesión';
      setMsg({ type: 'error', text: String(reason) });
    }
  }

  function openModal(e?: React.MouseEvent) {
    e?.preventDefault();
    setRecoverEmail('');
    setRecoverError('');
    setModalOpen(true);
    setTimeout(() => recoverRef.current?.focus(), 0);
  }
  function closeModal() { setModalOpen(false); }
  function sendRecover() {
    const val = recoverEmail.trim();
    if (!val) return setRecoverError('Ingresa tu correo.');
    if (!emailRegex.test(val)) return setRecoverError('Ingrese un correo electrónico válido.');
    setRecoverError('');
    alert('Se ha enviado un enlace de recuperación a ' + val);
    setModalOpen(false);
  }

  return (
    <div className="login-container">
      <div className="login-box">
        {/* LOGO del diseño */}
        <img src="/img/imgl.png" alt="Logo" className="login-logo" />

        {/* Títulos iguales a tu HTML de diseño */}
        <h1>SISTEMA DIGITAL EMPRESARIAL</h1>
        <p className="login-subtitle">Ingresa tus credenciales de acceso</p>

        <form id="loginForm" className="login-form" onSubmit={onSubmit} noValidate>
          <div className="input-group">
            <label htmlFor="email">Correo:</label>
            <input
              type="email" id="email" placeholder="correo@ejemplo.com" required
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className={email ? (emailRegex.test(email) ? 'valid' : 'invalid') : ''}
            />
            {!emailRegex.test(email) && email.length > 0 && (
              <div id="emailError" className="email-error show">
                Ingrese un correo electrónico válido.
              </div>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña:</label>
            <div className="password-wrapper">
              <input
                type={showPwd ? 'text' : 'password'}
                id="password" placeholder="••••••••••" required
                value={password} onChange={(e)=>setPassword(e.target.value)}
              />
              <button
                type="button" id="togglePassword" className="toggle-password"
                aria-label="Mostrar/ocultar contraseña"
                onClick={()=>setShowPwd(s=>!s)}
                style={{ display: password ? 'inline' : 'none' }}
              >
                <i className={showPwd ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} />
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading || !isValid}>
            {loading ? 'Entrando…' : 'Ingresar'}
          </button>

          {msg && (
            <div style={{ marginTop: 10, color: msg.type === 'error' ? '#df3e3e' : '#18a957' }}>
              {msg.text}
            </div>
          )}
        </form>

        <footer className="login-footer">
          <p><a href="#" onClick={openModal}>¿Olvidaste tu contraseña?</a></p>
        </footer>
      </div>

      {/* Modal de recuperación (mismo look que tu HTML) */}
      {modalOpen && (
        <div id="forgotModal" className="modal" aria-hidden="false"
             onClick={(e)=>{ if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="rec-title">
            <button className="close" aria-label="Cerrar" onClick={closeModal}>&times;</button>

            <h2 id="rec-title" className="modal-title">Restablecer contraseña</h2>
            <p className="modal-subtitle">
              Ingresa tu correo y recibe un enlace para restablecer tu contraseña
            </p>

            <div className="modal-form">
              <div className="modal-input-group">
                <label htmlFor="recoverEmail" className="modal-label">Correo:</label>
                <input
                  ref={recoverRef}
                  type="email" id="recoverEmail" className="modal-input"
                  placeholder="correo@ejemplo.com" required
                  value={recoverEmail}
                  onChange={(e)=>{ setRecoverEmail(e.target.value); setRecoverError(''); }}
                />
                {recoverError && <div id="recoverError" className="email-error show">{recoverError}</div>}
              </div>

              <button type="button" id="sendRecover" className="login-btn" onClick={sendRecover}>
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
