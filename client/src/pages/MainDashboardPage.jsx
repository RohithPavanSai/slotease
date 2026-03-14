import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Scissors,
  MapPin,
  Smartphone,
  Clock,
  CreditCard,
  Bell,
  Sparkles,
} from "lucide-react";

export default function MainDashboardPage() {
  const navigate = useNavigate();

  const isLoggedIn = () => {
    return localStorage.getItem("authToken") !== null;
  };

  const handleExploreSalons = () => {
    if (isLoggedIn()) {
      navigate("/customer/salons");
    } else {
      navigate("/login");
    }
  };

  const handleLogin = () => navigate("/login");

  const features = [
    {
      icon: <MapPin className="text-purple-600" size={26} />,
      title: "Location-Based Search",
      desc: "Find salons near you instantly with smart location detection.",
    },
    {
      icon: <Clock className="text-purple-600" size={26} />,
      title: "Real-Time Slot Booking",
      desc: "See available slots and book your appointment on the go.",
    },
    {
      icon: <CreditCard className="text-purple-600" size={26} />,
      title: "Secure Payments",
      desc: "Pay safely through integrated payment gateways like Razorpay or Stripe.",
    },
    {
      icon: <Bell className="text-purple-600" size={26} />,
      title: "Automated Reminders",
      desc: "Get instant SMS/email notifications before your appointment.",
    },
    {
      icon: <Sparkles className="text-purple-600" size={26} />,
      title: "AI Hairstyle Preview",
      desc: "Try virtual hairstyles before booking your stylist!",
    },
  ];

  const services = [
    {
      title: "Haircut & Styling",
      img: "https://images.unsplash.com/photo-1603787906761-1d6d3478f79f?auto=format&fit=crop&w=800&q=80",
      desc: "Trendy haircuts and personalized styling options.",
    },
    {
      title: "Facials & Skincare",
      img: "https://images.unsplash.com/photo-1587017539504-67cf0d13bc1b?auto=format&fit=crop&w=800&q=80",
      desc: "Glowing skin with expert facial and skincare treatments.",
    },
    {
      title: "Massage Therapy",
      img: "https://images.unsplash.com/photo-1600959907703-24963b7f77aa?auto=format&fit=crop&w=800&q=80",
      desc: "Relax and rejuvenate with premium massage services.",
    },
    {
      title: "Manicure & Pedicure",
      img: "https://images.unsplash.com/photo-1590540173936-8269fda3d0d6?auto=format&fit=crop&w=800&q=80",
      desc: "Give your hands and feet the care they deserve.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen text-gray-800 overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 text-white text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Scissors size={42} />
            <h1 className="text-5xl font-extrabold tracking-wide">SlotEase</h1>
          </div>
          <p className="max-w-2xl mx-auto text-lg text-purple-100 mb-8">
            Revolutionizing salon bookings — fast, smart, and effortless.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleLogin}
              className="px-6 py-3 bg-white text-purple-700 font-semibold rounded-xl shadow-md hover:bg-purple-100 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-3 bg-purple-900 text-white font-semibold rounded-xl shadow-md hover:bg-purple-800 transition"
            >
              Register
            </button>
          </div>

          <motion.div
            className="mt-16 text-sm text-purple-200 animate-bounce"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            ↓ Explore our features ↓
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="bg-gray-50 py-16 px-8 text-center">
        <h2 className="text-3xl font-bold text-purple-700 mb-12">
          Why Choose SlotEase?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg transition"
            >
              <div className="bg-purple-100 p-4 rounded-full mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold text-purple-700 mb-2">
                {f.title}
              </h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-white py-20 px-6 md:px-12">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-12">
          Our Popular Services
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-purple-50 rounded-2xl overflow-hidden shadow hover:shadow-lg transition hover:-translate-y-1"
            >
              <img
                src={service.img}
                alt={service.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-purple-700 mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600">{service.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-purple-700 to-indigo-700 py-16 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Book Your Next Slot?</h2>
        <p className="mb-8 text-purple-100">
          Experience the power of digital salon booking with SlotEase today.
        </p>
        <button
          onClick={handleExploreSalons}
          className="px-8 py-3 bg-white text-purple-700 font-semibold rounded-xl shadow-md hover:bg-purple-100 transition"
        >
          Explore Salons
        </button>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-6 text-center text-sm">
        <Smartphone className="inline mr-1 text-purple-400" size={16} />
        © 2025 SlotEase — Revolutionizing Salon Management | RGUKT Basar
      </footer>
    </div>
  );
}
