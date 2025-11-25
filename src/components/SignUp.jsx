import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUpload, FaTimes } from "react-icons/fa";

const SignUp = ({ onLogin }) => {
  const navigate = useNavigate();
  const [bgImage, setBgImage] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [document, setDocument] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const n = Math.floor(Math.random() * 4) + 1;
    setBgImage(`${process.env.PUBLIC_URL}/${n}.png`);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/png", "image/jpeg", "application/pdf"];
      if (!validTypes.includes(file.type)) {
        setError("Solo se permiten PNG, JPG o PDF");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("El archivo no debe exceder 5MB");
        return;
      }
      setDocument(file);
      setError("");

      // Preview para imágenes
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => setDocumentPreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setDocumentPreview(null);
      }
    }
  };

  const removeDocument = () => {
    setDocument(null);
    setDocumentPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.nombre || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Por favor, completa todos los campos");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (!document) {
      setError("Por favor, sube un documento de autenticación");
      return;
    }

    // Guardar usuario en "base de datos" (localStorage)
    const newUser = {
      id: Date.now(),
      name: formData.nombre,
      email: formData.email,
      password: formData.password,
      role: "user", // Rol por defecto
      document: {
        name: document.name,
        // En una app real, aquí iría la URL del archivo subido.
        // Simulamos una URL local para el preview si es imagen
        url: documentPreview || "#"
      },
      appointments: []
    };

    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    if (existingUsers.some(u => u.email === newUser.email)) {
      setError("El correo electrónico ya está registrado");
      return;
    }

    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));

    setSuccess("¡Registro completado! Redirigiendo al login...");
    setTimeout(() => navigate("/login"), 2000);
  };

  const onClose = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo aleatorio */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom right, rgba(2,37,77,0.6), rgba(174,132,22,0.12)), url(${bgImage})`,
        }}
      ></div>

      {/* Overlay con patrón */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2)_1px,_transparent_1px)] bg-[size:20px_20px]"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-8">
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-lg shadow-2xl max-w-2xl w-full border-2 border-yellow-500/30 animate-fadeIn">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-blue-900">Crear Cuenta</h2>
            <button
              onClick={onClose}
              className="text-blue-800 hover:text-yellow-600 transition-colors text-2xl"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div className="animate-slideInDown" style={{ animationDelay: "0.1s" }}>
              <label htmlFor="nombre" className="block text-blue-900 font-medium mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full p-3 border-2 border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-yellow-500 bg-white/50 transition-all"
                placeholder="Juan Pérez"
              />
            </div>

            {/* Email */}
            <div className="animate-slideInDown" style={{ animationDelay: "0.2s" }}>
              <label htmlFor="email" className="block text-blue-900 font-medium mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border-2 border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-yellow-500 bg-white/50 transition-all"
                placeholder="tu@email.com"
              />
            </div>

            {/* Contraseña */}
            <div className="animate-slideInDown" style={{ animationDelay: "0.3s" }}>
              <label htmlFor="password" className="block text-blue-900 font-medium mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border-2 border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-yellow-500 bg-white/50 transition-all"
                placeholder="Mín. 6 caracteres"
              />
            </div>

            {/* Confirmar Contraseña */}
            <div className="animate-slideInDown" style={{ animationDelay: "0.4s" }}>
              <label htmlFor="confirmPassword" className="block text-blue-900 font-medium mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border-2 border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-yellow-500 bg-white/50 transition-all"
                placeholder="Confirma tu contraseña"
              />
            </div>

            {/* Carga de Documentos */}
            <div className="animate-slideInDown" style={{ animationDelay: "0.6s" }}>
              <label className="block text-blue-900 font-medium mb-2">
                Sube un documento de autenticación
              </label>
              <p className="text-sm text-gray-600 mb-3">
                (Autenticación, Historia Académica, INE, Credencial UNAM, etc.)
              </p>

              {!document ? (
                <label className="relative border-2 border-dashed border-yellow-500/50 rounded-lg p-6 text-center cursor-pointer hover:border-yellow-500 hover:bg-blue-50/30 transition-all group">
                  <input
                    type="file"
                    onChange={handleDocumentChange}
                    accept=".png,.jpg,.jpeg,.pdf"
                    className="hidden"
                  />
                  <FaUpload className="mx-auto text-yellow-600 mb-2 group-hover:scale-110 transition-transform" size={24} />
                  <p className="text-blue-900 font-medium">Haz clic para subir</p>
                  <p className="text-sm text-gray-500">PNG, JPG o PDF (máx. 5MB)</p>
                </label>
              ) : (
                <div className="relative border-2 border-yellow-500 rounded-lg p-4 bg-blue-50 animate-scaleIn">
                  {documentPreview ? (
                    <img src={documentPreview} alt="Preview" className="w-full max-h-48 object-cover rounded mb-3" />
                  ) : (
                    <div className="bg-gray-200 h-32 rounded mb-3 flex items-center justify-center">
                      <p className="text-gray-600">📄 {document.name}</p>
                    </div>
                  )}
                  <p className="text-sm text-blue-900 font-medium mb-2">{document.name}</p>
                  <button
                    type="button"
                    onClick={removeDocument}
                    className="w-full flex items-center justify-center gap-2 p-2 bg-red-500/20 hover:bg-red-500/30 text-red-600 rounded transition-colors"
                  >
                    <FaTimes /> Cambiar documento
                  </button>
                </div>
              )}
            </div>

            {/* Mensajes de Error y Éxito */}
            {error && (
              <div className="animate-slideDown p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="animate-slideDown p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
                {success}
              </div>
            )}

            {/* Botón Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-700 hover:to-blue-800 text-yellow-400 font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl border-2 border-yellow-500/30 animate-slideInUp"
            >
              Crear Cuenta
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4">
            ¿Ya tienes cuenta?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-800 hover:text-yellow-600 font-medium transition-colors"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideInDown {
          animation: slideInDown 0.5s ease-out forwards;
          opacity: 0;
        }
        .animate-slideInUp {
          animation: slideInUp 0.5s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SignUp;

