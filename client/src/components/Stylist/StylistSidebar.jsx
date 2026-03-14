import { NavLink, useParams } from "react-router-dom";
import { BookOpen, User, Calendar, Home } from "lucide-react";

export default function StylistSidebar() {
  const { id } = useParams(); // matches your route param in App.jsx

  const menuItems = [
    { name: "Dashboard", path: `/stylist/${id}`, icon: <Home size={18} /> },
    { name: "Bookings", path: `/stylist/${id}/bookings`, icon: <BookOpen size={18} /> },
    { name: "Update Timeslots", path: `/stylist/${id}/schedule`, icon: <Calendar size={18} /> },
    { name: "Profile", path: `/stylist/${id}/myprofile`, icon: <User size={18} /> },
  ];

  return (
    <div className="h-screen w-64 bg-purple-700 text-white flex flex-col shadow-lg">
      {/* Logo / Brand */}
      <div className="p-6 text-center border-b border-purple-500">
        <h1 className="text-2xl font-bold">Salon App</h1>
        <p className="text-sm text-purple-200">Stylist Dashboard</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-xl transition ${
                isActive
                  ? "bg-white text-purple-700 font-semibold"
                  : "hover:bg-purple-600"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
