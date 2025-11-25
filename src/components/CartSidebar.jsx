import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { useUser } from '../context/UserContext';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const CartSidebar = ({ onClose }) => {
  const { cartItems, totalPrice, removeFromCart, removeItems } = useCart();
  const { user, addAppointment } = useUser();
  const navigate = useNavigate();

  const [schedulingFor, setSchedulingFor] = useState(null); // { product }
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingLocation, setMeetingLocation] = useState("Punto Medio FES-A");

  const handleScheduleClick = (product) => {
    if (!user) {
      alert("Debes iniciar sesión para agendar un encuentro.");
      navigate("/login");
      return;
    }
    setSchedulingFor(product);
  };

  const handleConfirmMeeting = () => {
    if (!meetingDate || !meetingTime) {
      alert("Por favor selecciona fecha y hora.");
      return;
    }

    const appointment = {
      id: Date.now(),
      title: `Encuentro - ${schedulingFor.title}`,
      date: meetingDate,
      time: meetingTime,
      location: meetingLocation,
      product: schedulingFor,
      type: "appointment",
      seller: schedulingFor.seller?.name || "Vendedor",
      sellerInfo: schedulingFor.seller
    };

    addAppointment(appointment);

    // Remover producto del carrito
    removeItems([schedulingFor.id]);

    alert(`¡Encuentro agendado para ${schedulingFor.title} el ${meetingDate} a las ${meetingTime}!`);
    setSchedulingFor(null);
    setMeetingDate("");
    setMeetingTime("");
  };

  return (
    <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-2xl z-50 flex flex-col border-l-4 border-yellow-500">
      <div className="p-4 bg-blue-900 text-white flex justify-between items-center shadow-md">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FaCalendarAlt /> Carrito
        </h2>
        <button onClick={() => navigate('/')} className="text-2xl hover:text-yellow-400 transition">&times;</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>Tu carrito está vacío.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                {/* Imagen del producto */}
                <div className="flex gap-3 mb-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-contain rounded bg-gray-50"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-sm line-clamp-2">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Vendedor: {item.seller?.name || "Desconocido"}
                    </p>
                  </div>
                </div>

                {/* Detalles de precio */}
                <div className="flex justify-between items-center text-sm mb-3">
                  <div>
                    <div className="text-gray-600">Cantidad: {item.quantity}</div>
                    <div className="text-gray-600">Precio: ${item.price}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-yellow-600 text-lg">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleScheduleClick(item)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition flex items-center justify-center gap-2 text-sm"
                  >
                    <FaCalendarAlt /> Agendar
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 rounded-md text-sm transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-200 shadow-inner">
        <div className="flex justify-between items-center text-xl font-bold text-blue-900 mb-2">
          <span>Total Global:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <p className="text-xs text-gray-500 text-center">
          * Cada producto requiere una cita individual con su vendedor.
        </p>
      </div>

      {/* Modal de Agendamiento */}
      {schedulingFor && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm animate-scaleIn">
            <h3 className="text-lg font-bold text-blue-900 mb-2">
              Agendar Encuentro
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {schedulingFor.title}
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Vendedor: {schedulingFor.seller?.name || "Desconocido"}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                <input
                  type="time"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lugar (Sugerido)</label>
                <div className="flex items-center gap-2 p-2 bg-gray-100 rounded text-gray-700">
                  <FaMapMarkerAlt className="text-red-500" />
                  <input
                    type="text"
                    value={meetingLocation}
                    onChange={(e) => setMeetingLocation(e.target.value)}
                    className="bg-transparent w-full focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSchedulingFor(null)}
                className="flex-1 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmMeeting}
                className="flex-1 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded font-bold shadow-md"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CartSidebar;
