import React, { useEffect, useState } from 'react';
import { useCart } from './CartContext'

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addToCart } = useCart();

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
    // Lógica para añadir al carrito (a implementar después)
    addToCart(selectedProduct, quantity);
    alert(`Añadido al carrito: ${quantity} ${selectedProduct.title}`);
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
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-900">{selectedProduct.title}</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>
              
              <div className="mt-4 flex justify-center">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.title} 
                  className="h-48 object-contain"
                />
              </div>
              
              <p className="mt-4 text-gray-700">{selectedProduct.description}</p>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Precio:</span>
                  <p className="text-lg font-bold text-pink-600">${selectedProduct.price}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Categoría:</span>
                  <p className="text-sm text-gray-700 capitalize">{selectedProduct.category}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <button
                onClick={handleAddToCart}
                className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-[1.02]"
              >
                Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de productos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-6 bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 min-h-screen">
        {productos.map(producto => (
          <div
            key={producto.id}
            onClick={() => handleProductClick(producto)}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-3 flex flex-col items-center text-center border border-purple-200 cursor-pointer"
          >
            <img
              src={producto.image}
              alt={producto.title}
              className="h-16 w-16 max-h-16 max-w-16 object-contain mb-3"
              style={{ maxHeight: '64px', maxWidth: '64px' }}
            />
            <h2 className="text-md font-semibold text-purple-700 mb-1 line-clamp-2">{producto.title}</h2>
            <p className="text-gray-500 text-sm mb-1 line-clamp-2">{producto.description.slice(0, 60)}...</p>
            <p className="text-pink-600 font-bold text-md">${producto.price}</p>
            <span className="mt-1 text-xs text-gray-400 italic">Categoría: {producto.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;