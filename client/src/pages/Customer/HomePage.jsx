import { useState } from "react";
import { motion } from "framer-motion";
import { Search, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const featuredServices = [
    { id: 1, name: "Haircut", image: "/Customer/haircut.png" },
    { id: 2, name: "Facial", image: "/Customer/facial.png" },
    { id: 3, name: "Manicure", image: "/Customer/manicure.png" },
    { id: 4, name: "Spa", image: "/Customer/spa.png" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching salons for:", searchQuery);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // remove token
    navigate("/login"); // redirect to login
  };

  return (
    <div className="p-6">
      {/* Header & Logout */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-purple-700">
            Welcome to Salon Booking ✨
          </h1>
          <p className="text-gray-600">
            Book your favorite salon services anytime, anywhere.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </motion.div>

      {/* Search */}
      <motion.form
        onSubmit={handleSearch}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex items-center bg-white shadow-md rounded-2xl overflow-hidden mb-10"
      >
        <input
          type="text"
          className="flex-1 px-4 py-3 outline-none"
          placeholder="Search salons by name, location or service..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-5 py-3 hover:bg-purple-700 transition flex items-center gap-2"
        >
          <Search size={18} /> Search
        </button>
      </motion.form>

      {/* Featured Services */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Featured Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredServices.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-md p-4 cursor-pointer hover:shadow-xl transition"
            >
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-32 object-cover rounded-xl mb-3"
              />
              <h3 className="text-lg font-medium text-gray-700 text-center">
                {service.name}
              </h3>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
