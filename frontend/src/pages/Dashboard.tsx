import { useAuth } from '../auth/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: 24 }}>
      <h2>Hola, {user?.name || user?.email}</h2>
      <p>Rol: {user?.rol ?? '—'}</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
