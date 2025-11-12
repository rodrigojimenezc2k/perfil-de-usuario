import React, { useEffect, useState } from 'react';
import { useCart } from './CartContext'
import { FaHeart, FaStar, FaShoppingCart, FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { addToCart } = useCart();

  // Generar vendedor aleatorio basado en el producto
  const generateSeller = (productId) => {
    const sellers = [
      { name: "Carlos López", rating: 4.8, reviews: 342, location: "CDMX", email: "carlos@tienda.com" },
      { name: "María García", rating: 4.9, reviews: 521, location: "Monterrey", email: "maria@tienda.com" },
      { name: "Juan Rodríguez", rating: 4.7, reviews: 298, location: "Guadalajara", email: "juan@tienda.com" },
      { name: "Ana Martínez", rating: 4.95, reviews: 614, location: "Puebla", email: "ana@tienda.com" },
      { name: "Luis Fernández", rating: 4.6, reviews: 187, location: "Cancún", email: "luis@tienda.com" },
    ];
    return sellers[productId % sellers.length];
  };

  // Generar URL de avatar
  const getAvatarUrl = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200`;
 
  // Añade al carrito mostrando un toast animado en lugar de alert()
  const addProductToCartWithToast = (producto, qty = 1) => {
    addToCart(producto, qty);
    setToastMessage(`Añadido al carrito: ${qty} ${producto.title}`);
    setToastVisible(true);
    // auto-hide
    setTimeout(() => setToastVisible(false), 2600);
  };

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
        setProductos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar productos:', err);
        setLoading(false);
      });
  }, []);

  const handleProductClick = (producto) => {
    setSelectedProduct(producto);
    setIsModalOpen(true);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    addProductToCartWithToast(selectedProduct, quantity);
    setIsModalOpen(false);
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setQuantity(value);
  };

  if (loading) {
    return <div className="text-center text-lg p-10">Cargando productos...</div>;
  }

  return (
    <div className="relative">
      {/* Modal de detalle de producto */}
      {isModalOpen && selectedProduct && (() => {
        const seller = generateSeller(selectedProduct.id);
        return (
          <div className="fixed inset-0 bg-blue-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl shadow-yellow-500/20 max-w-2xl w-full max-h-[95vh] overflow-y-auto border-2 border-yellow-500/30 my-8">
              <div className="p-6 md:p-8">
                {/* Header con botón cerrar */}
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-blue-900 flex-1">{selectedProduct.title}</h2>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="text-blue-800 hover:text-yellow-600 text-2xl transition-colors ml-4"
                  >
                    &times;
                  </button>
                </div>
                
                {/* Producto e Imagen */}
                <div className="mt-4 flex justify-center">
                  <div className="bg-gradient-to-b from-blue-50 to-yellow-50 p-6 rounded-xl shadow-inner">
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.title} 
                      className="h-48 object-contain"
                    />
                  </div>
                </div>
                
                <p className="mt-6 text-blue-900/80 leading-relaxed">{selectedProduct.description}</p>
                
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <span className="text-sm text-blue-700">Precio:</span>
                    <p className="text-lg font-bold text-yellow-600">${selectedProduct.price}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <span className="text-sm text-blue-700">Categoría:</span>
                    <p className="text-sm text-blue-800 font-medium capitalize">{selectedProduct.category}</p>
                  </div>
                </div>

                {/* SECCIÓN VENDEDOR */}
                <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-blue-50 rounded-xl border border-yellow-200 seller-card">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <img 
                        src={getAvatarUrl(seller.name)} 
                        alt={seller.name}
                        className="w-16 h-16 rounded-full shadow-md border-2 border-yellow-400 object-cover transform transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    
                    {/* Info vendedor */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-blue-900">{seller.name}</h3>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="flex gap-0.5">
                              {Array.from({length: Math.floor(seller.rating)}).map((_,i)=>(
                                <FaStar key={i} className="text-yellow-400 text-sm" />
                              ))}
                            </div>
                            <span className="text-xs text-gray-600 ml-2">{seller.rating} ({seller.reviews} reseñas)</span>
                          </div>
                        </div>
                      </div>

                      {/* Ubicación y contacto */}
                      <div className="mt-3 space-y-2 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-red-500 flex-shrink-0" />
                          <span>{seller.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="text-blue-600 flex-shrink-0" />
                          <span className="text-xs text-blue-600 hover:underline cursor-pointer">{seller.email}</span>
                        </div>
                      </div>

                      {/* Botones */}
                      <div className="mt-3 flex gap-2">
                        <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition transform hover:scale-105">
                          Seguir
                        </button>
                        <button className="px-3 py-1 text-xs border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition">
                          Contactar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cantidad */}
                <div className="mt-6">
                  <label htmlFor="quantity" className="block text-sm font-medium text-blue-900 mb-2">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-full p-3 border-2 border-yellow-500/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-yellow-500 bg-white/50 text-blue-900"
                  />
                </div>
                
                <button
                  onClick={handleAddToCart}
                  className="mt-6 w-full bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-700 hover:to-blue-800 text-yellow-400 font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl border-2 border-yellow-500/30"
                >
                  Añadir al carrito
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Toast notificación */}
      <div
        aria-live="polite"
        className={`fixed right-6 bottom-6 z-50 transform transition-all duration-400 ${toastVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
      >
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white border border-white/10">
          <FaShoppingCart className="w-5 h-5" />
          <div className="text-sm font-medium">{toastMessage}</div>
        </div>
      </div>

      {/* Lista de productos mejorada */}
      <div className="p-6 bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-700 min-h-screen">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {productos.map(producto => {
            const seller = generateSeller(producto.id);
            return (
              <article
                key={producto.id}
                onClick={() => handleProductClick(producto)}
                className="relative group perspective cursor-pointer"
              >
                {/* Animated gradient border */}
                <div className="card-border rounded-3xl p-[2px]">
                  <div className="card-bg rounded-3xl bg-white/95 backdrop-blur-sm p-5 flex flex-col h-full transition-transform duration-500 transform-gpu group-hover:scale-[1.02] group-hover:-translate-y-2 shadow-lg">
                    {/* image + floating */}
                    <div className="relative flex items-center justify-center">
                      <div className="img-wrap w-40 h-40 flex items-center justify-center rounded-2xl bg-gradient-to-b from-blue-50 to-yellow-50 shadow-inner -mt-10 transform transition-all duration-700 group-hover:translate-y-[-6px]">
                        <img src={producto.image} alt={producto.title} className="max-h-32 max-w-32 object-contain transform transition-transform duration-700 group-hover:scale-105" />
                      </div>
                      {/* quick action overlay */}
                      <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button onClick={(e)=>{ e.stopPropagation(); addProductToCartWithToast(producto,1); }} title="Añadir al carrito" className="action-btn bg-yellow-500 text-white shadow-md">
                          <FaShoppingCart />
                        </button>
                        <button onClick={(e)=>{ e.stopPropagation(); addProductToCartWithToast(producto,1); }} title="Favorito" className="action-btn bg-pink-500 text-white shadow-md">
                          <FaHeart />
                        </button>
                      </div>
                    </div>

                    {/* content */}
                    <header className="mt-3 flex-1">
                      <h3 className="text-base md:text-lg font-semibold text-blue-900 leading-snug line-clamp-2">{producto.title}</h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-3">{producto.description}</p>
                    </header>

                    {/* VENDEDOR CARD - Mini */}
                    <div className="mt-3 p-3 bg-gradient-to-r from-yellow-50 to-blue-50 rounded-lg border border-yellow-200/50 seller-mini">
                      <div className="flex items-center gap-2">
                        <img 
                          src={getAvatarUrl(seller.name)}
                          alt={seller.name}
                          className="w-8 h-8 rounded-full flex-shrink-0 border border-yellow-400"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-blue-900 truncate">{seller.name}</p>
                          <div className="flex items-center gap-1">
                            <FaStar className="text-yellow-400 text-xs flex-shrink-0" />
                            <span className="text-xs text-gray-600">{seller.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <footer className="mt-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-yellow-600 font-extrabold text-lg">${producto.price}</div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-sm text-gray-600 px-2 py-1 bg-blue-50 rounded-full">
                            {producto.category}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 justify-end">
                          {Array.from({length: Math.round(producto.rating?.rate || 4)}).map((_,i)=>(
                            <FaStar key={i} className="text-yellow-400 text-xs md:text-sm" />
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{producto.rating?.count || 0} vendidos</div>
                      </div>
                    </footer>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
     </div>
   );
 };
 
 export default ProductList;
 
/* estilos locales animados para las cards */
/* filepath: c:\Users\Rodrigo.Jimenez\perfil-de-usuario\src\components\ProductList.jsx (styles) */
/* Añade al final del archivo un <style> inyectado si usas CSS-in-JS, o pega estas clases en tu CSS global */
/*
.perspective { perspective: 1200px; }
.card-border {
  background: linear-gradient(90deg, rgba(250,204,21,0.95), rgba(10,63,121,0.9), rgba(250,204,21,0.8));
  background-size: 300%;
  animation: gradientMove 6s linear infinite;
}
.card-bg { }
.img-wrap { transition: transform .6s cubic-bezier(.2,.9,.3,1); }
.action-btn {
  width: 40px; height: 40px; display:flex; align-items:center; justify-content:center;
  border-radius:8px; box-shadow:0 6px 18px rgba(2,6,23,0.12);
  transition: transform .2s ease, box-shadow .2s ease;
}
.action-btn:hover { transform: translateY(-4px) scale(1.05); box-shadow:0 10px 24px rgba(2,6,23,0.16); }
@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
*/
/* Añadir estas clases a tu CSS global (o descomentar y pegarlas) para animación adicional:
.action-btn { width: 40px; height: 40px; display:flex; align-items:center; justify-content:center; border-radius:8px; box-shadow:0 6px 18px rgba(2,6,23,0.12); transition: transform .2s ease, box-shadow .2s ease; }
.action-btn:hover { transform: translateY(-4px) scale(1.05); box-shadow:0 10px 24px rgba(2,6,23,0.16); }
*/