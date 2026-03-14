import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "customer",
    location: { lat: null, lng: null, name: "" },
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const navigate = useNavigate();
  // Handle location input change
  const handleLocationChange = async (e) => {
    const name = e.target.value;
    setForm({ ...form, location: { ...form.location, name } });

    if (name.length < 3) return; // wait until user types 3+ characters

    try {
      // Use Nominatim API for geocoding
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(name)}`,
      );
      const data = await res.json();
      if (data && data.length > 0) {
        setForm((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          },
        }));
      }
    } catch (err) {
      console.error("Geocoding error:", err);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      ...form,
      locationName: form.location.name,
      lat: form.location.lat,
      lng: form.location.lng,
    };
    // Send full form including lat/lng

    try {
      const res = await fetch(
        "https://slotease-production-15e5.up.railway.app/api/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (res.ok) {
        setSuccess("Signup successful!");
        setForm({
          fullName: "",
          email: "",
          password: "",
          role: "customer",
          location: { lat: null, lng: null, name: "" },
        });
        navigate("/login");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 to-purple-200 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-purple-700">Create Account</h1>
          <p className="text-gray-500">
            Enter your location and we’ll fetch lat/lng automatically.
          </p>
        </div>

        {error && (
          <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
        )}
        {success && (
          <div className="mb-4 text-green-500 text-sm text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              required
              className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
              placeholder="Your Name"
              value={form.fullName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
              placeholder="Password (min 8 characters)"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Register As
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none bg-white"
            >
              <option value="customer">Customer</option>
              <option value="stylist">Stylist</option>
              <option value="salonOwner">Salon Owner</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Location
            </label>
            <input
              type="text"
              name="locationName"
              required
              className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none"
              placeholder="Enter city or place"
              value={form.location.name}
              onChange={handleLocationChange}
            />
            {form.location.lat && form.location.lng && (
              <p className="text-gray-500 text-sm mt-1">
                Latitude: {form.location.lat.toFixed(6)}, Longitude:{" "}
                {form.location.lng.toFixed(6)}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-purple-600 text-white py-3 rounded-xl font-semibold transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700"
            }`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-purple-600 font-semibold hover:underline"
          >
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
}
