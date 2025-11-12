import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

const CartSidebar = ({ onClose }) => {
  const { cartItems, totalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Carrito</h2>
        <button onClick={()=>{navigate('/');}} className="text-2xl font-bold">&times;</button>
      </div>
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Tu carrito está vacío.</p>
      ) : (
        <>
          {cartItems.map(item => (
            <div key={item.id} className="mb-4 border-b pb-2">
              <h3 className="font-semibold">{item.title}</h3>
              <p>Cantidad: {item.quantity}</p>
              <p>Precio unitario: ${item.price}</p>
              <p className="text-sm text-gray-500">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <div className="mt-4 font-bold text-right text-yellow-600">
            Total: ${totalPrice.toFixed(2)}
          </div>
        </>
      )}
    </div>
  );
};

export default CartSidebar;
