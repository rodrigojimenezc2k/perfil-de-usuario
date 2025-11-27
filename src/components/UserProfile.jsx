import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { FaEdit, FaSave, FaSignOutAlt, FaArrowLeft, FaCalendarAlt, FaShoppingCart, FaGraduationCap, FaClock } from "react-icons/fa";

export default function UserProfile() {
  const { user, setUser, clearUser } = useUser();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [msg, setMsg] = useState("");

  // --- Calendario: estado y utilidades ---
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Modal de entrega
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState(null);

  const prevMonth = () => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // Eventos del usuario (si vienen en el contexto user.appointments)
  const userAppointments = (user && user.appointments) || [];
  const eventsMap = {};
  userAppointments.forEach((ev) => {
    if (!eventsMap[ev.date]) eventsMap[ev.date] = [];
    eventsMap[ev.date].push(ev);
  });

  // --- Lógica de Fechas Importantes ---
  const getDayInfo = (date) => {
    if (!date) return null;
    const dateStr = formatDate(date);
    const dayOfWeek = date.getDay(); // 0 = Domingo

    // Fechas clave
    const sem1Start = "2025-08-11";
    const sem1End = "2025-11-28";
    const sem2Start = "2026-02-03";
    const sem2End = "2026-05-29";

    const examStart = "2025-12-01";
    const examEnd = "2025-12-12";

    // Verificar rangos
    const isSem1 = dateStr >= sem1Start && dateStr <= sem1End;
    const isSem2 = dateStr >= sem2Start && dateStr <= sem2End;
    const isSemester = isSem1 || isSem2;

    const isExam = dateStr >= examStart && dateStr <= examEnd;

    // Vacaciones: Periodo entre fin del sem1 e inicio del sem2, excluyendo exámenes
    const isVacation1 = dateStr > sem1End && dateStr < examStart;
    const isVacation2 = dateStr > examEnd && dateStr < sem2Start;
    const isVacation3 = dateStr > sem2End; // Vacaciones después del sem2
    const isVacation = isVacation1 || isVacation2 || isVacation3;

    let info = { type: "regular", color: "bg-white", icon: null, label: null, canDeliver: true };

    // Domingos no se entrega
    if (dayOfWeek === 0) {
      info.canDeliver = false;
    }

    // Prioridad de estilos: Examen > Vacaciones > Inicio/Fin Semestre > Semestre Regular
    if (isExam) {
      info = { ...info, type: "exam", color: "bg-orange-100 border-orange-300", icon: FaEdit, label: "Exámenes" };
    } else if (isVacation) {
      info = { ...info, type: "vacation", color: "bg-purple-100 border-purple-300", icon: FaSignOutAlt, label: "Vacaciones", canDeliver: false };
    } else if (dateStr === sem1Start || dateStr === sem2Start) {
      info = { ...info, type: "semStart", color: "bg-green-100 border-green-300", icon: FaGraduationCap, label: "Inicio Semestre" };
    } else if (dateStr === sem1End || dateStr === sem2End) {
      info = { ...info, type: "semEnd", color: "bg-green-100 border-green-300", icon: FaGraduationCap, label: "Fin Semestre" };
    } else if (isSemester) {
      info = { ...info, type: "semester", color: "bg-green-50 border-green-200", icon: null, label: null };
    }

    return info;
  };

  const handleDayClick = (date) => {
    if (!date) return;
    const dateStr = formatDate(date);
    const hasEvents = eventsMap[dateStr] && eventsMap[dateStr].length > 0;

    // Solo abrir si hay entregas (citas) para ese día
    if (hasEvents) {
      setSelectedDeliveryDate(date);
      setDeliveryModalOpen(true);
    }
  };

  // Generar matriz de días para el mes actual
  const firstDayIndex = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay(); // 0=Dom
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const monthDays = [];
  for (let i = 0; i < firstDayIndex; i++) monthDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    monthDays.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d));
  }

  // Obtener eventos del día seleccionado para el modal
  const selectedDateStr = selectedDeliveryDate ? formatDate(selectedDeliveryDate) : null;
  const selectedDayEvents = selectedDateStr ? eventsMap[selectedDateStr] || [] : [];

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="bg-white/90 rounded-xl p-8 shadow-xl text-center">
          <p className="text-lg text-gray-700">No hay usuario activo.</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-white rounded-md hover:opacity-90 transition"
          >
            Ir a iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSave = () => {
    if (!form.name || !form.email) {
      setMsg("Completa nombre y correo");
      return;
    }
    setUser({ ...user, name: form.name, email: form.email });
    setMsg("Perfil actualizado");
    setEditing(false);
    setTimeout(() => setMsg(""), 2600);
  };

  const handleLogout = () => {
    clearUser();
    navigate("/login");
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 relative">
      {/* fondo animado sutil tipo futurista */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-800/20 to-yellow-600/10 animate-blobSlow"></div>
        <div className="absolute -left-20 -top-20 w-72 h-72 bg-gradient-to-tr from-yellow-400/30 to-blue-700/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-gradient-to-br from-purple-500/20 to-yellow-400/10 rounded-full blur-3xl animate-blob delay-2000"></div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="absolute -top-6 left-0 text-sm text-blue-800 hover:text-yellow-600 inline-flex items-center gap-2"
        >
          <FaArrowLeft /> Volver
        </button>

        <div className="backdrop-blur-md bg-white/85 border border-yellow-200 rounded-2xl shadow-2xl p-6 md:p-10 transform transition-all duration-400 hover:scale-[1.01]">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-400 to-blue-800 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg">
                {user?.name ? user.name[0].toUpperCase() : user?.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="text-sm text-gray-500">Miembro FES-A</div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-blue-900">{user?.name || "Usuario"}</h2>
                  <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
                  <p className="mt-2 inline-block text-xs font-medium px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 capitalize">
                    {user?.role || "rol desconocido"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-800 rounded-md hover:bg-blue-100 transition"
                    >
                      <FaEdit /> Editar
                    </button>
                  ) : (
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 text-green-800 rounded-md hover:bg-green-100 transition"
                    >
                      <FaSave /> Guardar
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-600">Información</h3>
                  {!editing ? (
                    <div className="mt-3 text-sm text-gray-700">
                      <div><span className="font-medium">Nombre:</span> {user?.name}</div>
                      <div className="mt-1"><span className="font-medium">Correo:</span> {user?.email}</div>
                    </div>
                  ) : (
                    <div className="mt-3 space-y-3">
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Nombre completo"
                      />
                      <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="correo@ejemplo.com"
                      />
                    </div>
                  )}
                </div>

                <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-600">Documentos</h3>
                  <div className="mt-3 text-sm text-gray-700">
                    {user?.document ? (
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm">{user.document.name}</div>
                        <a
                          href={user.document.url || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-800 underline"
                        >
                          Ver
                        </a>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">No hay documentos subidos</div>
                    )}
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={handleLogout}
                      className="w-full inline-flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition"
                    >
                      <FaSignOutAlt /> Cerrar sesión
                    </button>
                  </div>
                </div>
              </div>

              {msg && <div className="mt-4 text-sm text-green-700">{msg}</div>}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          Perfil del usuario
        </div>

        {/* --- Calendario mensual mejorado --- */}
        <section className="mt-8 w-full">
          <div className="relative bg-white/95 border border-yellow-100 rounded-2xl shadow-2xl p-4 md:p-6 backdrop-blur-sm transform transition-all duration-500 hover:scale-[1.01]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-yellow-600" />
                <h3 className="text-xl md:text-2xl font-semibold text-blue-900">Calendario Académico</h3>
                <span className="text-sm text-gray-500 hidden md:inline">Plan Semestral y Entregas</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition">◀</button>
                <div className="px-3 text-sm md:text-base font-medium">
                  {currentMonth.toLocaleString(undefined, { month: "long", year: "numeric" })}
                </div>
                <button onClick={nextMonth} className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition">▶</button>
              </div>
            </div>

            {/* encabezados de días */}
            <div className="grid grid-cols-7 gap-4 text-sm md:text-lg mb-2">
              {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
                <div key={d} className="text-center text-gray-600 font-semibold">{d}</div>
              ))}
            </div>

            {/* REJILLA PRINCIPAL */}
            <div className="grid grid-cols-7 gap-4">
              {monthDays.map((dt, idx) => {
                const dateStr = dt ? formatDate(dt) : null;
                const evs = dateStr ? eventsMap[dateStr] : null;
                const hasEvents = evs && evs.length > 0;
                const dayInfo = getDayInfo(dt);

                // Estilos base
                let cellClass = "min-h-[140px] p-3 rounded-xl transition-all duration-300 border shadow-sm relative overflow-hidden group ";

                if (!dt) {
                  return <div key={idx} className="min-h-[140px]"></div>;
                }

                // Aplicar estilos según el tipo de día
                if (dayInfo.type === "vacation") {
                  cellClass += "bg-purple-50 border-purple-200 hover:bg-purple-100";
                } else if (dayInfo.type === "exam") {
                  cellClass += "bg-orange-50 border-orange-200 hover:bg-orange-100";
                } else if (dayInfo.type === "semStart" || dayInfo.type === "semEnd") {
                  cellClass += "bg-blue-50 border-blue-300 hover:bg-blue-100 ring-2 ring-blue-100";
                } else if (dayInfo.type === "semester") {
                  cellClass += "bg-green-50 border-green-100 hover:bg-green-100 hover:border-green-200";
                } else if (!dayInfo.canDeliver) {
                  cellClass += "bg-gray-50 border-gray-200 opacity-70 cursor-not-allowed";
                } else {
                  cellClass += "bg-white border-gray-100 hover:border-yellow-300 hover:shadow-md cursor-pointer";
                }

                return (
                  <div
                    key={idx}
                    onClick={() => handleDayClick(dt)}
                    className={cellClass}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-lg font-bold ${dayInfo.type === 'vacation' ? 'text-purple-700' : dayInfo.type === 'exam' ? 'text-orange-700' : dayInfo.type === 'semester' || dayInfo.type === 'semStart' || dayInfo.type === 'semEnd' ? 'text-green-800' : 'text-gray-700'}`}>
                        {dt.getDate()}
                      </span>
                      {dayInfo.icon && (
                        <dayInfo.icon className={`text-lg ${dayInfo.type === 'vacation' ? 'text-purple-500' : dayInfo.type === 'exam' ? 'text-orange-500' : 'text-blue-500'}`} />
                      )}
                    </div>

                    {/* Etiqueta del día especial */}
                    {dayInfo.label && (
                      <div className={`mt-1 text-xs font-semibold px-2 py-0.5 rounded-full inline-block ${dayInfo.type === 'vacation' ? 'bg-purple-200 text-purple-800' : dayInfo.type === 'exam' ? 'bg-orange-200 text-orange-800' : dayInfo.type === 'semester' || dayInfo.type === 'semStart' || dayInfo.type === 'semEnd' ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'}`}>
                        {dayInfo.label}
                      </div>
                    )}

                    {/* Eventos/Citas del usuario */}
                    <div className="mt-2 space-y-1">
                      {evs && evs.map((e, i) => (
                        <div key={i} className="text-xs bg-yellow-100 text-yellow-800 p-1 rounded border border-yellow-200 truncate">
                          {e.title}
                        </div>
                      ))}
                    </div>

                    {/* Hover effect for delivery - SOLO si hay eventos */}
                    {hasEvents && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-green-600/10 backdrop-blur-[1px]">
                        <span className="bg-white text-green-700 text-xs font-bold px-2 py-1 rounded-full shadow-sm border border-green-200">
                          Ver Detalles
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Leyenda */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm justify-center bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span> <span>Semestre (Activo)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span> <span>Exámenes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500"></span> <span>Vacaciones</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-300"></span> <span>No disponible (Domingos)</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* MODAL DE DETALLES DE ENTREGA */}
      {deliveryModalOpen && selectedDeliveryDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-scaleIn border-2 border-green-400">
            {/* Header con gradiente */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white relative">
              <button
                onClick={() => setDeliveryModalOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl font-bold transition-colors"
              >
                &times;
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-full backdrop-blur-md">
                  <FaShoppingCart className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Detalles de Entrega</h3>
                  <p className="text-white/90 text-sm">
                    {selectedDeliveryDate.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {selectedDayEvents.length > 0 ? (
                  selectedDayEvents.map((event, idx) => (
                    <div key={idx} className="space-y-4 border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                          <FaClock className="text-blue-500" /> {event.title}
                        </h4>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-sm font-medium text-green-700">Confirmado</span>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                        <h4 className="font-semibold text-yellow-800 mb-2">Información de Entrega</h4>
                        <div className="space-y-2 text-sm text-gray-700">
                          <div className="flex justify-between border-b border-yellow-200 pb-1">
                            <span className="font-medium">Horario:</span>
                            <span>{event.time || "Por definir"}</span>
                          </div>
                          {event.location && (
                            <div className="flex justify-between border-b border-yellow-200 pb-1">
                              <span className="font-medium">Lugar:</span>
                              <span>{event.location}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="font-medium">ID Pedido:</span>
                            <span className="text-xs font-mono">{event.id}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No hay detalles disponibles para esta fecha.
                  </div>
                )}

                <button
                  className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
                  onClick={() => setDeliveryModalOpen(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes blob {
          0% { transform: translateY(0) scale(1); }
          33% { transform: translateY(-8px) scale(1.03); }
          66% { transform: translateY(6px) scale(0.98); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes blobSlow {
          0% { transform: rotate(0deg); opacity: .9; }
          50% { transform: rotate(12deg); opacity: .75; }
          100% { transform: rotate(0deg); opacity: .9; }
        }
        .animate-blob { animation: blob 6s ease-in-out infinite; }
        .animate-blobSlow { animation: blobSlow 10s ease-in-out infinite; }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}
