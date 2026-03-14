import { NavLink, useParams } from "react-router-dom";
import {
  Home,
  List,
  Info,
  Calendar,
  CreditCard,
  BookOpen,
  Star,
  User
} from "lucide-react";
export default function CustomerSidebar() {
  const {id} = useParams();
  const menuItems = [
    { name: "Home", path: `/customer/${id}`, icon: <Home size={18} /> },
    { name: "Salon Listing", path: `/customer/${id}/salons`, icon: <List size={18} /> },
    { name: "My Bookings", path: `/customer/${id}/bookings`, icon: <BookOpen size={18} /> },
    { name: "Reviews & Ratings", path: `/customer/${id}/reviews`, icon: <Star size={18} /> },
    { name: "Profile", path: `/customer/${id}/myprofile`, icon: <User size={18} /> },
  ];

  return (
    <div className="h-screen w-64 bg-purple-700 text-white flex flex-col shadow-lg">
      {/* Logo / Brand */}
      <div className="p-6 text-center border-b border-purple-500">
        <h1 className="text-2xl font-bold">Salon App</h1>
        <p className="text-sm text-purple-200">Customer Dashboard</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
{menuItems.map((item) => (
  <NavLink
    key={item.name}
    to={item.path}
    end={item.name === "Home"}  
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
