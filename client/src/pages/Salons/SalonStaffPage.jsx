import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import StylistCard from "../../components/Salons/StylistCard.jsx"; // ✅ fixed import path

export default function SalonStaffPage() {
  const { id } = useParams(); // salonId
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendURL = "https://slotease-production-15e5.up.railway.app";

  const [newStylist, setNewStylist] = useState({
    name: "",
    specialization: "",
    experience: "",
    email: "",
    password: "",
    image: null,
  });

  // ✅ Fetch existing stylists for this salon
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${backendURL}/api/stylists?salonId=${id}`);
        const data = await res.json();
        setStylists(data);
      } catch (err) {
        console.error("Error fetching stylists:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchStaff();
  }, [id]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setNewStylist((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  // ✅ Handle adding stylist
  const handleAddStylist = async () => {
    if (!id) return alert("Salon not selected");

    const formData = new FormData();
    formData.append("salonId", id);
    formData.append("name", newStylist.name);
    formData.append("specialization", newStylist.specialization);
    formData.append("experience", newStylist.experience || 0);
    formData.append("email", newStylist.email);
    formData.append("password", newStylist.password);
    if (newStylist.image) formData.append("image", newStylist.image);

    try {
      const res = await fetch(`${backendURL}/api/stylists`, {
        method: "POST",
        body: formData,
      });
      const added = await res.json();

      if (res.ok) {
        setStylists((prev) => [...prev, added]);
        alert("✅ Stylist added successfully!");
        setNewStylist({
          name: "",
          specialization: "",
          experience: "",
          email: "",
          password: "",
          image: null,
        });
      } else {
        alert(added.message || "❌ Failed to add stylist");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding stylist");
    }
  };

  if (loading) return <div className="p-6">Loading staff...</div>;

  return (
    <div className="p-6 h-screen overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">Salon Staff</h1>

      {/* Existing Staff */}
      {stylists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {stylists.map((stylist) => (
            <StylistCard key={stylist._id} stylist={stylist} />
          ))}
        </div>
      ) : (
        <p className="mb-6 text-gray-500">No staff yet. Add one below 👇</p>
      )}

      {/* Add Staff Form */}
      <h2 className="text-2xl mb-4 font-semibold text-purple-600">
        Add New Staff
      </h2>

      <div className="flex flex-wrap gap-2 mb-6 items-center bg-gray-50 p-4 rounded-lg shadow-sm">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newStylist.name}
          onChange={handleChange}
          className="border p-2 rounded w-32"
        />
        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={newStylist.specialization}
          onChange={handleChange}
          className="border p-2 rounded w-32"
        />
        <input
          type="number"
          name="experience"
          placeholder="Experience (yrs)"
          value={newStylist.experience}
          onChange={handleChange}
          className="border p-2 rounded w-28"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newStylist.email}
          onChange={handleChange}
          className="border p-2 rounded w-40"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={newStylist.password}
          onChange={handleChange}
          className="border p-2 rounded w-36"
        />
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="border p-2 rounded w-48"
        />

        <button
          onClick={handleAddStylist}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          ➕ Add Staff
        </button>
      </div>
    </div>
  );
}
