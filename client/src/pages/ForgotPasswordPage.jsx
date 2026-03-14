import { useState } from "react";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleForgot = (e) => {
    e.preventDefault();
    console.log("Password reset requested for:", email);
    // Call backend API here
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
          <h1 className="text-3xl font-bold text-purple-700">Forgot Password</h1>
          <p className="text-gray-500">
            Enter your email address and we’ll send you reset instructions.
          </p>
        </div>

        <form onSubmit={handleForgot} className="space-y-5">
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

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600 text-sm">
          Remember your password?{" "}
          <a href="/login" className="text-purple-600 font-semibold hover:underline">
            Back to Login
          </a>
        </p>
      </motion.div>
    </div>
  );
}
