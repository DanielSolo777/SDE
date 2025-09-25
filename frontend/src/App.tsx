import { useState } from "react";
import api from "./api";

function App() {
  const [email, setEmail] = useState("daniel@example.com");
  const [password, setPassword] = useState("Admin1234");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      setMessage(`✅ Bienvenido ${res.data.user.nombre}, rol: ${res.data.user.rol}`);
      localStorage.setItem("token", res.data.access_token);
    } catch (err: any) {
      setMessage("❌ Error en login");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20, border: "1px solid #ccc" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 10 }}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 10 }}
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
