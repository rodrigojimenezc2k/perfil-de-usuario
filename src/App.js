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

import "./App.css";
import ProductList from "./components/ProductList";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center py-6 text-orange-700">
        Tienda C2K
      </h1>
      <ProductList />
    </div>
  );
}

export default App;


