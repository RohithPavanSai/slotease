import { useParams, useNavigate } from "react-router-dom";
import { CalendarDays, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

export default function StylistDashboard() {
  const { id } = useParams(); // stylist id
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const statusOptions = [
    "Booked",
    "Confirmed",
    "In Progress",
    "Completed",
    "Cancelled",
  ];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(
          `https://slotease-production-15e5.up.railway.app/api/appointments?stylistId=${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!res.ok) throw new Error("Failed to fetch appointments");

        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [id, navigate]);

  const updateStatus = async (appointmentId, newStatus) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `https://slotease-production-15e5.up.railway.app/api/appointments/${appointmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (!res.ok) throw new Error("Failed to update status");

      setAppointments((prev) =>
        prev.map((a) =>
          a._id === appointmentId ? { ...a, status: newStatus } : a,
        ),
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  if (loading) return <p className="p-6">Loading appointments...</p>;

  return (
    <div className="p-6 h-screen overflow-x-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Appointments */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="text-purple-600" size={22} />
          <h2 className="text-xl font-semibold text-gray-800">
            Today’s Appointments
          </h2>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {appointments.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="pb-2">Customer</th>
                <th className="pb-2">Mobile</th>
                <th className="pb-2">Service</th>
                <th className="pb-2">Start Time</th>
                <th className="pb-2">End Time</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Update</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id} className="border-b">
                  <td className="py-2">{a.customer?.name}</td>
                  <td className="py-2">{a.customer?.mobile}</td>
                  <td className="py-2">{a.service}</td>
                  <td className="py-2">
                    {new Date(a.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-2">
                    {new Date(a.endTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-2">{a.status}</td>
                  <td className="py-2">
                    <select
                      value={a.status}
                      onChange={(e) => updateStatus(a._id, e.target.value)}
                      className="border rounded-lg px-2 py-1"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No appointments today.</p>
        )}
      </div>
    </div>
  );
}
