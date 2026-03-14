import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ServiceCard from "../../components/Salons/ServiceCard";

export default function SalonServices() {
  const { id: salonId } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState(null);

  const [newService, setNewService] = useState({
    serviceName: "",
    price: "",
    duration: "",
    description: "",
    image: null,
  });

  const backendURL = "https://slotease-production-15e5.up.railway.app";

  // Fetch services
  const fetchServices = async () => {
    if (!salonId) return setLoading(false);

    setLoading(true);
    try {
      const res = await fetch(`${backendURL}/api/services?salonId=${salonId}`);
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error("❌ Error fetching services:", err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [salonId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setAddError(null);
    setNewService((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleAddService = async () => {
    setAddError(null);
    if (!salonId) return setAddError("Salon ID is missing.");
    if (
      !newService.serviceName.trim() ||
      !newService.price ||
      !newService.duration
    ) {
      return setAddError("Service Name, Price, and Duration are required.");
    }

    setAdding(true);
    const formData = new FormData();
    formData.append("salonId", salonId);
    formData.append("serviceName", newService.serviceName);
    formData.append("price", newService.price);
    formData.append("duration", newService.duration);
    formData.append("description", newService.description);
    if (newService.image) formData.append("image", newService.image);

    try {
      const res = await fetch(`${backendURL}/api/services`, {
        method: "POST",
        body: formData,
      });
      const added = await res.json();
      if (res.ok) {
        setServices((prev) => [...prev, added]);
        setNewService({
          serviceName: "",
          price: "",
          duration: "",
          description: "",
          image: null,
        });
      } else {
        setAddError(added.message || "Failed to add service");
      }
    } catch (err) {
      console.error("❌ Error adding service:", err);
      setAddError("Network error: Failed to add service.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="p-6">Loading services...</div>;

  return (
    <div className="p-6 h-screen overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">
        Salon Services
      </h1>

      {/* Existing Services */}
      {services.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {services.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              salonId={salonId}
            />
          ))}
        </div>
      ) : (
        <p className="mb-6">No services found.</p>
      )}

      {/* Add New Service */}
      <h2 className="text-2xl mb-4">Add New Service</h2>
      {addError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>⚠️ {addError}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <input
          type="text"
          name="serviceName"
          placeholder="Service Name"
          value={newService.serviceName}
          onChange={handleChange}
          className="border p-2 rounded w-32"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newService.price}
          onChange={handleChange}
          className="border p-2 rounded w-24"
        />
        <input
          type="number"
          name="duration"
          placeholder="Duration (mins)"
          value={newService.duration}
          onChange={handleChange}
          className="border p-2 rounded w-32"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newService.description}
          onChange={handleChange}
          className="border p-2 rounded w-48"
        />
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="border p-2 rounded w-40"
        />
        <button
          onClick={handleAddService}
          disabled={adding}
          className={`px-4 py-2 rounded font-semibold ${
            adding
              ? "bg-purple-300 text-purple-100 cursor-not-allowed"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
        >
          {adding ? "Adding..." : "Add Service"}
        </button>
      </div>
    </div>
  );
}
