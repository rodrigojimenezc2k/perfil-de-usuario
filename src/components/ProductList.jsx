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
        <div className="fixed inset-0 bg-blue-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl shadow-yellow-500/20 max-w-md w-full max-h-[90vh] overflow-y-auto border-2 border-yellow-500/30">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-blue-900">{selectedProduct.title}</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-blue-800 hover:text-yellow-600 text-2xl transition-colors"
                >
                  &times;
                </button>
              </div>
              
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
      )}

      {/* Lista de productos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-6 bg-gradient-to-br from-blue-900 via-blue-800 to-yellow-700 min-h-screen">
        {productos.map(producto => (
          <div
            key={producto.id}
            onClick={() => handleProductClick(producto)}
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-yellow-300/20 transition-all duration-300 p-4 flex flex-col items-center text-center border-2 border-yellow-500/30 cursor-pointer transform hover:-translate-y-1"
          >
            <div className="bg-gradient-to-b from-blue-50 to-yellow-50 p-3 rounded-xl mb-3">
              <img
                src={producto.image}
                alt={producto.title}
                className="h-20 w-20 object-contain mb-3"
                style={{ maxHeight: '80px', maxWidth: '80px' }}
              />
            </div>
            <h2 className="text-md font-semibold text-blue-900 mb-1 line-clamp-2">{producto.title}</h2>
            <p className="text-gray-600 text-sm mb-1 line-clamp-2">{producto.description.slice(0, 60)}...</p>
            <p className="text-yellow-600 font-bold text-lg">${producto.price}</p>
            <span className="mt-2 px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">{producto.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;