import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { FaEdit, FaSave, FaSignOutAlt, FaArrowLeft, FaCalendarAlt, FaShoppingCart, FaGraduationCap , FaClock} from "react-icons/fa";

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

  const prevMonth = () => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // Eventos estáticos del plan semestral UNAM (ejemplos; ajustar según necesites)
  const year = currentMonth.getFullYear();
  const unamPlanEvents = [
    { date: formatDate(new Date(year, 0, 20)), title: "Inicio de semestre", type: "unam" },
    { date: formatDate(new Date(year, 2, 15)), title: "Vacaciones intersemestrales", type: "unam" },
    { date: formatDate(new Date(year, 4, 10)), title: "Evaluaciones parciales", type: "unam" },
    { date: formatDate(new Date(year, 5, 20)), title: "Fin de semestre", type: "unam" },
  ];

  // Eventos del usuario (si vienen en el contexto user.appointments), si no, ejemplo vacío
  const userAppointments = (user && user.appointments) || [
    // ejemplos de citas (se pueden eliminar si ya existen en user)
    { date: formatDate(new Date(year, currentMonth.getMonth(), 5)), title: "Cita de compra - Zapatos", type: "appointment" },
    { date: formatDate(new Date(year, currentMonth.getMonth(), 12)), title: "Venta - Ropa", type: "appointment" },
  ];

  // Eventos generales (otros)
  const generalEvents = [
    { date: formatDate(new Date(year, currentMonth.getMonth(), 8)), title: "Feria universitaria", type: "general" },
  ];

  // Mapear eventos por fecha
  const eventsMap = {};
  [...unamPlanEvents, ...userAppointments, ...generalEvents].forEach((ev) => {
    if (!eventsMap[ev.date]) eventsMap[ev.date] = [];
    eventsMap[ev.date].push(ev);
  });

  // Generar matriz de días para el mes actual (array de fechas o null para celdas vacías)
  const firstDayIndex = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay(); // 0=Dom
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const monthDays = [];
  // añadir celdas vacías previas
  for (let i = 0; i < firstDayIndex; i++) monthDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    monthDays.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d));
  }
  // --- fin calendario ---

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

        {/* --- Calendario mensual grande con overlay semestral rojo --- */}
        <section className="mt-8 w-full">
          <div className="relative bg-white/95 border border-yellow-100 rounded-2xl shadow-2xl p-4 md:p-6 backdrop-blur-sm transform transition-all duration-500 hover:scale-[1.01]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-yellow-600" />
                <h3 className="text-xl md:text-2xl font-semibold text-blue-900">Calendario</h3>
                <span className="text-sm text-gray-500">Vista mensual — Plan semestral resaltado</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition">◀</button>
                <div className="px-3 text-sm md:text-base font-medium">
                  {currentMonth.toLocaleString(undefined, { month: "long", year: "numeric" })}
                </div>
                <button onClick={nextMonth} className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition">▶</button>
              </div>
            </div>

            {/* encabezados de días (más grandes) */}
            <div className="grid grid-cols-7 gap-4 text-sm md:text-lg">
              {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
                <div key={d} className="text-center text-gray-600 font-semibold">{d}</div>
              ))}
            </div>

            {/* contenedor relativo que aloja la rejilla + overlay rojo */}
            <div className="relative mt-3">
              {/* REJILLA PRINCIPAL (interactiva) */}
              <div className="grid grid-cols-7 gap-4 mt-2 z-10">
                {monthDays.map((dt, idx) => {
                  const dateStr = dt ? formatDate(dt) : null;
                  const evs = dateStr ? eventsMap[dateStr] : null;
                  return (
                    <div
                      key={idx}
                      className={`min-h-[160px] p-4 rounded-lg transition-transform transform hover:scale-[1.02] bg-white border border-transparent shadow-sm`}
                    >
                      {dt ? (
                        <>
                          <div className="flex items-start justify-between">
                            <div className="text-base md:text-lg font-semibold text-gray-700">{dt.getDate()}</div>
                          </div>

                          <div className="mt-3 flex flex-col gap-2 text-sm">
                            {evs ? evs.slice(0, 3).map((e, i) => {
                              const key = `${dateStr}-${i}`;

                              // Different styles for different event types
                              let bgColor, borderColor, textColor, Icon;

                              if (e.type === "unam") {
                                bgColor = "bg-red-50";
                                borderColor = "border-red-300";
                                textColor = "text-red-700";
                                Icon = FaGraduationCap;
                              } else if (e.type === "appointment") {
                                bgColor = "bg-gradient-to-r from-yellow-50 to-orange-50";
                                borderColor = "border-yellow-400";
                                textColor = "text-yellow-800";
                                Icon = FaShoppingCart;
                              } else {
                                bgColor = "bg-blue-50";
                                borderColor = "border-blue-300";
                                textColor = "text-blue-700";
                                Icon = FaCalendarAlt;
                              }

                              return (
                                <div
                                  key={key}
                                  title={e.seller ? `${e.title}\nVendedor: ${e.seller}` : e.title}
                                  className={`flex items-start gap-2 p-2 rounded-md border ${bgColor} ${borderColor} transform transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer`}
                                >
                                  <Icon className={`text-sm mt-0.5 flex-shrink-0 ${textColor}`} />
                                  <div className="flex-1 min-w-0">
                                    <div className={`text-xs font-medium ${textColor} truncate`}>{e.title}</div>
                                    {e.seller && (
                                      <div className="text-xs text-gray-600 mt-0.5 truncate">
                                        {e.seller}
                                      </div>
                                    )}
                                    {e.time && (
                                      <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                        <FaClock className="text-xs" /> {e.time}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            }) : (
                              <div className="text-xs text-gray-300">—</div>
                            )}
                          </div>
                        </>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              {/* OVERLAY SEMESTRAL ROJO (transparente, encima de la rejilla) */}
              <div className="absolute inset-0 z-20 pointer-events-none">
                <div className="grid grid-cols-7 gap-4 mt-2 h-full">
                  {monthDays.map((dt, idx) => {
                    const dateStr = dt ? formatDate(dt) : null;
                    const hasUnam = dateStr ? unamPlanEvents.some(u => u.date === dateStr) : false;
                    return (
                      <div key={`overlay-${idx}`} className="min-h-[160px] p-0">
                        {hasUnam ? (
                          <div className="h-full flex items-start justify-center">
                            <div className="w-full mx-2 -mt-2 rounded-lg bg-red-500/20 border border-red-300/40 backdrop-blur-sm transform transition-all duration-700 animate-fadeInUp" />
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* leyenda más grande y con efecto */}
            <div className="mt-5 flex items-center gap-4 flex-wrap text-base md:text-lg">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-red-500/90 inline-block shadow-sm" /> <span className="text-gray-700">Plan semestral UNAM</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-yellow-500 inline-block shadow-sm" /> <span className="text-gray-700">Citas compras/ventas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-500 inline-block shadow-sm" /> <span className="text-gray-700">Eventos generales</span>
              </div>
            </div>
          </div>
        </section>
        {/* --- fin calendario --- */}
      </div>

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
        .animate-pulse { animation: pulse 1.6s infinite; }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.25); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
