import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { useUser } from '../context/UserContext';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const CartSidebar = ({ onClose }) => {
  const { cartItems, totalPrice, removeFromCart, removeItems } = useCart();
  const { user, addAppointment } = useUser();
  const navigate = useNavigate();

  const [schedulingFor, setSchedulingFor] = useState(null); // { sellerName, items }
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingLocation, setMeetingLocation] = useState("Punto Medio FES-A");

  // Agrupar por vendedor
  const groupedItems = cartItems.reduce((acc, item) => {
    const sellerName = item.seller?.name || "Vendedor Desconocido";
    if (!acc[sellerName]) acc[sellerName] = [];
    acc[sellerName].push(item);
    return acc;
  }, {});

  const handleScheduleClick = (sellerName, items) => {
    if (!user) {
      alert("Debes iniciar sesión para agendar un encuentro.");
      navigate("/login");
      return;
    }
    setSchedulingFor({ sellerName, items });
  };

  const handleConfirmMeeting = () => {
    if (!meetingDate || !meetingTime) {
      alert("Por favor selecciona fecha y hora.");
      return;
    }

    const appointment = {
      id: Date.now(),
      title: `Encuentro con ${schedulingFor.sellerName}`,
      date: meetingDate,
      time: meetingTime,
      location: meetingLocation,
      items: schedulingFor.items,
      type: "appointment",
      seller: schedulingFor.sellerName
    };

    addAppointment(appointment);

    // Remover items del carrito
    const itemIds = schedulingFor.items.map(i => i.id);
    removeItems(itemIds);

    alert(`¡Encuentro agendado con ${schedulingFor.sellerName} para el ${meetingDate} a las ${meetingTime}!`);
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
          Object.entries(groupedItems).map(([sellerName, items]) => (
            <div key={sellerName} className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-bold text-blue-900 border-b pb-2 mb-3 flex justify-between items-center">
                <span>{sellerName}</span>
                <span className="text-xs font-normal text-gray-500">{items.length} items</span>
              </h3>

              {items.map(item => (
                <div key={item.id} className="mb-3 flex justify-between items-start text-sm">
                  <div>
                    <div className="font-medium text-gray-800">{item.title}</div>
                    <div className="text-gray-500">Cant: {item.quantity} x ${item.price}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-gray-700">${(item.price * item.quantity).toFixed(2)}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-red-500 hover:text-red-700 mt-1"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="font-bold text-gray-700">Subtotal:</span>
                <span className="font-bold text-yellow-600 text-lg">
                  ${items.reduce((acc, i) => acc + i.price * i.quantity, 0).toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => handleScheduleClick(sellerName, items)}
                className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition flex items-center justify-center gap-2"
              >
                <FaCalendarAlt /> Agendar Encuentro
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-200 shadow-inner">
        <div className="flex justify-between items-center text-xl font-bold text-blue-900 mb-2">
          <span>Total Global:</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <p className="text-xs text-gray-500 text-center">
          * El pago se realiza durante el encuentro con cada vendedor.
        </p>
      </div>

      {/* Modal de Agendamiento */}
      {schedulingFor && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm animate-scaleIn">
            <h3 className="text-lg font-bold text-blue-900 mb-4">
              Acordar encuentro con {schedulingFor.sellerName}
            </h3>

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
    </div>
  );
};

export default CartSidebar;
