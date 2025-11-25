import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [bgImage, setBgImage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Selecciona aleatoriamente 1..4 y arma la ruta desde public/
    const n = Math.floor(Math.random() * 4) + 1;
    setBgImage(`${process.env.PUBLIC_URL}/${n}.png`);

    // Ensure default user exists
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const defaultUserEmail = "jas.perea02@gmail.com";
    if (!existingUsers.find(u => u.email === defaultUserEmail)) {
      const defaultUser = {
        name: "Admin User",
        email: defaultUserEmail,
        password: "admin",
        role: "comprador", // Default to buyer to allow cart access
        appointments: []
      };
      existingUsers.push(defaultUser);
      localStorage.setItem("users", JSON.stringify(existingUsers));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentials.email && credentials.password) {
      // Validar contra "base de datos" (localStorage)
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const user = existingUsers.find(
        (u) => u.email === credentials.email && u.password === credentials.password
      );

      if (user) {
        onLogin({ ...user, role: user.role || "user" });
        setUser(user);
        navigate("/");
        setError("");
      } else {
        setError("Credenciales inválidas");
      }
    } else {
      setError("Por favor, completa todos los campos");
    }
  };

  const onClose = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen relative">
      {/* Fondo aleatorio desde public/1.png..4.png con un degradado superpuesto */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom right, rgba(2,37,77,0.6), rgba(174,132,22,0.12)), url(${bgImage})`,
        }}
      ></div>

      {/* Overlay con patrón */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2)_1px,_transparent_1px)] bg-[size:20px_20px]"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-lg shadow-2xl max-w-md w-full border-2 border-yellow-500/30">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-blue-900">Iniciar Sesión</h2>
            <button
              onClick={onClose}
              className="text-blue-800 hover:text-yellow-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-blue-900 font-medium mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                className="w-full p-3 border-2 border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-yellow-500 bg-white/50"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-blue-900 font-medium mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full p-3 border-2 border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-yellow-500 bg-white/50"
                placeholder="********"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-700 hover:to-blue-800 text-yellow-400 font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl border-2 border-yellow-500/30"
            >
              Ingresar
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4">
            ¿No tienes cuenta?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-800 hover:text-yellow-600 font-medium transition-colors"
            >
              Registrarte aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

