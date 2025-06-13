/*import  { useState } from 'react';
import Encabezado from './components/Encabezado';
import PerfilUsuario from './components/PerfilUsuario';
import FormularioPerfil from './components/FormularioPerfil';
import PieDePagina from './components/PieDePagina';

function App() {
  const [perfil, setPerfil] = useState({
    nombre: 'María Gómez',
    correo: 'maria.gomez@correo.com',
    edad: 29
  });

  const actualizarPerfil = (nuevosDatos) => {
    setPerfil(nuevosDatos);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Encabezado />
      <PerfilUsuario {...perfil} />
      <FormularioPerfil actualizarPerfil={actualizarPerfil} />
      <PieDePagina />
    </div>
  );
}

export default App;*/

// Ramificación de JorgePardo
/*  */

import "./App.css";
import ProductList from "./components/ProductList";
import CartSidebar from "./components/CartSidebar";
import { CartProvider } from "./components/CartContext";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa"; // icono de carrito

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-100 relative">
        <header className="flex justify-between items-center p-4 bg-white shadow">
          <h1 className="text-3xl font-bold text-orange-400">Tienda C2K</h1>
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-purple-700 hover:text-purple-900 relative"
          >
            <FaShoppingCart size={28} />
          </button>
        </header>

        <ProductList />

        {isCartOpen && <CartSidebar onClose={() => setIsCartOpen(false)} />}
      </div>
    </CartProvider>
  );
}

export default App;
