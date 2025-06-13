import React, { useState } from 'react';

const FormularioPerfil = ({ actualizarPerfil }) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [edad, setEdad] = useState('');

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!nombre || !correo || !edad) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    actualizarPerfil({ nombre, correo, edad });
    setNombre('');
    setCorreo('');
    setEdad('');
  };

  return (
    <form onSubmit={manejarEnvio} className="bg-gray-100 p-6 rounded shadow-md">
      <h3 className="text-lg font-medium mb-4">Actualizar Perfil</h3>
      <div className="mb-4">
        <label className="block mb-1">Nombre</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Correo</label>
        <input
          type="email"
          className="w-full border p-2 rounded"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Edad</label>
        <input
          type="number"
          className="w-full border p-2 rounded"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Guardar Cambios
      </button>
    </form>
  );
};

export default FormularioPerfil;
