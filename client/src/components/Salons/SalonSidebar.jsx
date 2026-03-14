import { NavLink, useParams } from "react-router-dom";
import {
  LayoutDashboard,
  Scissors,
  Users,
  Calendar,
  UserCheck,
  Settings,
} from "lucide-react";

export default function SalonSidebar() {
  const { id } = useParams();

  const menuItems = [
    { name: "Dashboard", path: `/salon/${id}`, icon: <LayoutDashboard size={18} />, exact: true },
    { name: "Manage Services", path: `/salon/${id}/services`, icon: <Scissors size={18} /> },
    { name: "Manage Staff", path: `/salon/${id}/staff`, icon: <Users size={18} /> },
    { name: "Booking Management", path: `/salon/${id}/bookings`, icon: <Calendar size={18} /> },
    { name: "Customer Management", path: `/salon/${id}/customers`, icon: <UserCheck size={18} /> },
    { name: "Profile Settings", path: `/salon/${id}/profile`, icon: <Settings size={18} /> },
  ];

  return (
    <div className="h-screen w-64 bg-purple-700 text-white flex flex-col shadow-lg">
      <div className="p-6 text-center border-b border-purple-500">
        <h1 className="text-2xl font-bold">Salon App</h1>
        <p className="text-sm text-purple-200">Salon Owner Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.exact}   // ✅ important fix
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
