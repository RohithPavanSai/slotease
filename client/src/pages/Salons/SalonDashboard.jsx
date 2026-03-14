import { useParams, useNavigate } from "react-router-dom";
import { CalendarDays, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

export default function SalonDashboard() {
  const { id } = useParams(); // salon id from URL
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const statusOptions = ["Booked", "Confirmed", "In Progress", "Completed", "Cancelled"];

  // Fetch salon bookings from backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login"); // redirect if no token
          return;
        }

        const res = await fetch(`http://localhost:8080/api/appointments?salonId=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch bookings");

        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [id, navigate]);

  // Update booking status
  const updateStatus = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`http://localhost:8080/api/appointments/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      // Update local state
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  if (loading) return <p className="p-6">Loading bookings...</p>;

  return (
    <div className="p-6 h-screen overflow-x-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700">Salon Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Today’s Appointments */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="text-purple-600" size={22} />
          <h2 className="text-xl font-semibold text-gray-800">Today’s Appointments</h2>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {bookings.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="pb-2">Customer</th>
                <th className="pb-2">Mobile</th>
                <th className="pb-2">Service</th>
                <th className="pb-2">Stylist</th>
                <th className="pb-2">Start Time</th>
                <th className="pb-2">End Time</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Update</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b">
                  <td className="py-2">{b.customer?.name || "N/A"}</td>
                  <td className="py-2">{b.customer?.mobile || "N/A"}</td>
                  <td className="py-2">{b.service || "N/A"}</td>
                  <td className="py-2">{b.stylistId?.fullName || "N/A"}</td>
                  <td className="py-2">
                    {b.startTime ? new Date(b.startTime).toLocaleTimeString() : "N/A"}
                  </td>
                  <td className="py-2">
                    {b.endTime ? new Date(b.endTime).toLocaleTimeString() : "N/A"}
                  </td>
                  <td className="py-2">{b.status || "N/A"}</td>
                  <td className="py-2">
                    <select
                      value={b.status || "Booked"}
                      onChange={(e) => updateStatus(b._id, e.target.value)}
                      className="border rounded-lg px-2 py-1"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No bookings today.</p>
        )}
      </div>
    </div>
  );
}
