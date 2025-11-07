import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStore, FaShoppingBag, FaExchangeAlt } from "react-icons/fa";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");

  const roles = [
    { id: "vendedor", label: "Vendedor", icon: <FaStore size={24} /> },
    { id: "comprador", label: "Comprador", icon: <FaShoppingBag size={24} /> },
    {
      id: "vendedor-comprador",
      label: "Vendedor/Comprador",
      icon: <FaExchangeAlt size={24} />,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentials.email && credentials.password && credentials.role) {
      onLogin(credentials);
      navigate("/");
      setError("");
    } else {
      setError("Por favor, completa todos los campos y selecciona un rol");
    }
  };

  const handleRoleSelect = (roleId) => {
    setCredentials((prev) => ({
      ...prev,
      role: roleId,
    }));
  };

  const onClose = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen relative">
      {/* Fondo con gradiente universitario */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-700"></div>
      
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

            <div>
              <label className="block text-blue-900 font-medium mb-2">
                Selecciona tu rol
              </label>
              <div className="grid grid-cols-3 gap-4">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleSelect(role.id)}
                    className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center gap-2 transition-all
                    ${
                      credentials.role === role.id
                        ? "border-yellow-500 bg-blue-50 text-blue-800"
                        : "border-yellow-500/30 hover:border-yellow-500/50 hover:bg-blue-50/50"
                    }`}
                  >
                    {role.icon}
                    <span className="text-sm font-medium">{role.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-700 hover:to-blue-800 text-yellow-400 font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl border-2 border-yellow-500/30"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
