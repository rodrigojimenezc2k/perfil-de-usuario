const PerfilUsuario = (perfil) => {
  
  return (
  <section className="bg-white p-6 rounded shadow-md mb-4">
    <h2 className="text-xl font-semibold mb-2">Datos del Usuario</h2>
    <p><strong>Nombre:</strong> {perfil.nombre}</p>
    <p><strong>Correo:</strong> {perfil.correo}</p>
    <p><strong>Edad:</strong> {perfil.edad} años</p>
  </section>
);
}

export default PerfilUsuario;
