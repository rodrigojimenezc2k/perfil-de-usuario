import "./App.css";
import ProductList from "./components/ProductList";
import CartSidebar from "./components/CartSidebar";
import { CartProvider, useCart } from "./components/CartContext";
import { useState } from "react";
import Login from "./components/Login";
import { BrowserRouter as Router, Route, Routes, Navigate, Link, useNavigate } from "react-router-dom";
import SignUp from "./components/SignUp";
import { FaShoppingCart, FaTshirt, FaRing, FaConciergeBell, FaPaw, FaLayerGroup, FaUserCircle } from "react-icons/fa";
import { GiConverseShoe } from "react-icons/gi";
import { UserProvider, useUser } from "./context/UserContext";
import UserProfile from "./components/UserProfile";


function Layout({ isAuthenticated, userRole, children, onLogout, activeCategory, setActiveCategory }) {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const { user, clearUser } = useUser();
  const [showProfile, setShowProfile] = useState(false);

  const handleCartClick = () => {
    if (userRole === 'vendedor') {
      alert('Solo los compradores pueden acceder al carrito');
      return;
    }
    navigate('/cart');
  };

  const handleLogout = () => {
    clearUser();
    // avisar al App para actualizar isAuthenticated
    if (typeof onLogout === "function") onLogout();
    setShowProfile(false);
    navigate("/login");
  };

  const categories = [
    { id: "ropa", label: "Ropa", icon: <FaTshirt size={20} /> },
    { id: "zapatos", label: "Zapatos", icon: <GiConverseShoe size={20} /> },
    { id: "accesorios", label: "Accesorios", icon: <FaRing size={20} /> },
    { id: "servicios", label: "Servicios", icon: <FaConciergeBell size={20} /> },
    { id: "mascotas", label: "Mascotas", icon: <FaPaw size={20} /> },
    { id: "variedades", label: "De Todo", icon: <FaLayerGroup size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <header className="flex justify-between items-center p-4 bg-white shadow-lg">
        {/* Logo + User icon */}
        <div className="flex items-center gap-3 relative">
          <Link to="/" className="text-3xl font-bold text-yellow-600 hover:text-yellow-700 transition-colors">
            Tienda FES-A
          </Link>
          <button
            onClick={() => setShowProfile((s) => !s)}
            className="ml-2 text-gray-700 hover:text-yellow-600 transition-colors p-1 rounded-full group"
            aria-label="Perfil"
          >
            <FaUserCircle size={28} className="text-gray-700 group-hover:text-yellow-600 transition-colors" />
          </button>

          {/* Panel de perfil */}
          {showProfile && (
            <div
              className="absolute left-0 top-full mt-3 w-72 bg-white rounded-lg shadow-2xl border-2 border-yellow-200 overflow-hidden z-30 animate-fadeScale"
              onMouseLeave={() => setShowProfile(false)}
            >
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-400 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {user?.name ? user.name[0].toUpperCase() : user?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-blue-900">{user?.name || "Usuario"}</div>
                    <div className="text-xs text-gray-600">{user?.email}</div>
                    <div className="text-xs text-yellow-700 font-medium mt-1 capitalize">{user?.role}</div>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <button
                  onClick={() => { setShowProfile(false); navigate("/profile"); }}
                  className="w-full mb-2 py-2 bg-blue-50 text-blue-800 rounded-md hover:bg-blue-100 transition"
                >
                  Ver perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>

        {/* NavBar de Categorías */}
        <nav className="hidden md:flex items-center gap-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative group"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <button
                onClick={() => {
                  if (activeCategory === category.id) {
                    setActiveCategory(null);
                  } else {
                    setActiveCategory(category.id)
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 transform
                  ${activeCategory === category.id || hoveredCategory === category.id
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg scale-110"
                    : "text-gray-700 hover:text-yellow-600"
                  }
                `}
              >
                <span className={`transition-transform duration-300 ${hoveredCategory === category.id ? "scale-125" : ""}`}>
                  {category.icon}
                </span>
                <span className="font-medium text-sm">{category.label}</span>
              </button>

              {/* Efecto de línea animada */}
              {(activeCategory === category.id || hoveredCategory === category.id) && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full animate-expandWidth"></div>
              )}
            </div>
          ))}
        </nav>

        {/* Carrito */}
        <button
          onClick={handleCartClick}
          className="text-yellow-600 hover:text-blue-800 relative transition-transform duration-300 hover:scale-125 group"
        >
          <FaShoppingCart size={28} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {cartItems.length}
          </span>
        </button>
      </header>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex justify-center p-3 bg-white border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 whitespace-nowrap
                ${activeCategory === category.id
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg"
                  : "text-gray-700 hover:bg-yellow-100"
                }
              `}
            >
              <span>{category.icon}</span>
              <span className="text-xs font-medium">{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {children}

      <style>{`
        @keyframes fadeScale {
          from { opacity: 0; transform: translateY(-6px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeScale { animation: fadeScale 220ms cubic-bezier(.2,.9,.3,1) both; }
        @keyframes expandWidth {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
        .animate-expandWidth {
          animation: expandWidth 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

function ProtectedRoute({ isAuthenticated, userRole, path, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificación adicional para la ruta del carrito
  if (path === '/cart' && userRole === 'vendedor') {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);



  const handleLogin = (credentials) => {
    setIsAuthenticated(true);
    setUserRole(credentials.role);
  };

  return (
    <Router>
      <UserProvider>
        <CartProvider>
          <Routes>
            <Route
              path="/signUp"
              element={

                <SignUp onLogin={handleLogin} onClose={() => { }} />
              }
            />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login onLogin={handleLogin} onClose={() => { }} />
                )
              }
            />

            <Route
              path="/cart"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userRole}
                  path="/cart"
                >
                  <Layout isAuthenticated={isAuthenticated} userRole={userRole} onLogout={() => setIsAuthenticated(false)} activeCategory={activeCategory} setActiveCategory={setActiveCategory}>
                    <CartSidebar onClose={() => { }} />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userRole}
                  path="/profile"
                >
                  <Layout isAuthenticated={isAuthenticated} userRole={userRole} onLogout={() => setIsAuthenticated(false)} activeCategory={activeCategory} setActiveCategory={setActiveCategory}>
                    <UserProfile />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/"
              element={
                <Layout isAuthenticated={isAuthenticated} userRole={userRole} onLogout={() => setIsAuthenticated(false)} activeCategory={activeCategory} setActiveCategory={setActiveCategory}>
                  <ProductList userRole={userRole} activeCategory={activeCategory} />
                </Layout>
              }
            />
          </Routes>
        </CartProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
