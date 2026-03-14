import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save token and user info
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user)); // ✅ includes name

        // Redirect based on role
        const { role, id } = data.user;
        if (role === "customer") navigate(`/customer/${id}`);
        else if (role === "salonOwner") navigate(`/salon/${id}`);
        else if (role === "stylist") navigate(`/stylist/${id}`);
        else setError("Unknown role");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 to-purple-200">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-purple-700">Salon Booking</h1>
          <p className="text-gray-500">Welcome back! Please login.</p>
        </div>

        {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600">Email Address</label>
            <input
              type="email"
              required
              className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              required
              minLength={8}
              className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
              placeholder="Password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-purple-600 text-white py-3 rounded-xl font-semibold transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 text-sm">
          Don’t have an account?{" "}
          <a href="/register" className="text-purple-600 font-semibold hover:underline">
            Sign Up
          </a>
        </p>
      </motion.div>
    </div>
  );
}
