import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import axios from "axios";
import ServiceCard from "../../components/Customer/ServiceCard";

export default function SalonDetails() {
  const { salonId } = useParams(); // get salonId from URL
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendURL = "https://slotease-production-15e5.up.railway.app";

  useEffect(() => {
    const fetchSalonDetails = async () => {
      try {
        // 1️⃣ Fetch salon info
        const salonRes = await axios.get(`${backendURL}/api/salons/list`);
        const salonData = salonRes.data.find((s) => s._id === salonId);
        setSalon(salonData || null);

        if (salonData) {
          // 2️⃣ Fetch services for this salon from backend
          const servicesRes = await axios.get(`${backendURL}/api/services`, {
            params: { salonId },
          });
          setServices(servicesRes.data);
        }
      } catch (err) {
        console.error("Error fetching salon details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalonDetails();
  }, [salonId]);

  if (loading) return <p className="p-6">Loading salon details...</p>;
  if (!salon) return <p className="p-6 text-red-600">Salon not found.</p>;

  return (
    <div className="p-6 h-screen overflow-x-hidden">
      <img
        src={
          salon.profilePhoto
            ? `${backendURL}${salon.profilePhoto}`
            : "/salonlogo.png"
        }
        alt={salon.name}
        className="w-full h-60 object-cover rounded-2xl shadow-lg mb-6"
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-purple-700">{salon.name}</h1>
        <p className="flex items-center text-gray-500 mt-1">
          <MapPin size={18} className="mr-2 text-purple-500" />{" "}
          {salon.location || ""}
        </p>
        <div className="flex items-center mt-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={20}
              className={
                i < Math.round(salon.averageRating || 0)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {(salon.averageRating || 0).toFixed(1)} / 5
          </span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Services & Pricing
        </h2>
        {services.length === 0 ? (
          <p className="text-gray-500">No services found for this salon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                salonId={salon._id}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Customer Reviews
        </h2>
        <div className="space-y-4">
          {salon.rating && salon.rating.length > 0 ? (
            salon.rating.map((review, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-md">
                <p className="font-semibold text-purple-700">
                  {review.user?.fullName || "Anonymous"}
                </p>
                <div className="flex items-center text-yellow-400 mb-1">
                  {[...Array(review.value)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
