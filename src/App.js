import "./App.css";
import ProductList from "./components/ProductList";
import CartSidebar from "./components/CartSidebar";
import { CartProvider } from "./components/CartContext";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import Login from "./components/Login";
import { BrowserRouter as Router, Route, Routes, Navigate, Link, useNavigate } from "react-router-dom";

function Layout({ isAuthenticated, userRole, children }) {
  const navigate = useNavigate();

  const handleCartClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (userRole === 'vendedor') {
      alert('Solo los compradores pueden acceder al carrito');
      return;
    }
    
    if (userRole === 'comprador' || userRole === 'vendedor-comprador') {
      navigate('/cart');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <Link to="/" className="text-3xl font-bold text-yellow-600">Tienda FES-A</Link>
        <button
          onClick={handleCartClick}
          className="text-purple-700 hover:text-purple-900 relative"
        >
          <FaShoppingCart size={28} />
        </button>
      </header>
      {children}
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

  const handleLogin = (credentials) => {
    setIsAuthenticated(true);
    setUserRole(credentials.role);
  };

  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLogin={handleLogin} onClose={() => {}} />
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
                <Layout isAuthenticated={isAuthenticated} userRole={userRole}>
                  <CartSidebar onClose={() => {}} />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/"
            element={
              <Layout isAuthenticated={isAuthenticated} userRole={userRole}>
                <ProductList userRole={userRole} />
              </Layout>
            }
          />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;
