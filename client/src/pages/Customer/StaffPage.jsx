import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StylistCard from "../../components/Customer/StylistCard";
import axios from "axios";

export default function StaffPage() {
  const { serviceName, salonId } = useParams(); // from route
  const [stylists, setStylists] = useState([]);
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const backendURL = "https://slotease-production-15e5.up.railway.app";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStylists = async () => {
      try {
        // 1️⃣ Fetch stylists for this salon
        const res = await axios.get(`${backendURL}/api/stylists`, {
          params: { salonId },
        });

        console.log("Fetched stylists:", res.data);
        console.log("Requested serviceName:", serviceName);

        // 2️⃣ Filter stylists by specialization (serviceName)
        const filtered = res.data.filter(
          (stylist) =>
            stylist.specialization &&
            stylist.specialization.trim().toLowerCase() ===
              serviceName.trim().toLowerCase(),
        );

        // 3️⃣ For each stylist, attach the correct serviceId matching this serviceName
        const stylistsWithServiceId = filtered.map((stylist) => {
          const matchedService = stylist.services?.find(
            (s) =>
              s.serviceName.trim().toLowerCase() ===
              serviceName.trim().toLowerCase(),
          );
          return {
            ...stylist,
            serviceId: matchedService?._id || null,
          };
        });

        console.log("Stylists with serviceId:", stylistsWithServiceId);

        setStylists(stylistsWithServiceId);

        // 4️⃣ Fetch salon info
        const salonRes = await axios.get(`${backendURL}/api/salons/list`);
        const salonData = salonRes.data.find((s) => s._id === salonId);
        setSalon(salonData || null);
      } catch (err) {
        console.error("Error fetching stylists:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStylists();
  }, [serviceName, salonId]);

  if (loading) return <p className="p-6">Loading staff...</p>;
  if (!salon) return <p className="p-6 text-red-600">Salon not found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">
        Specialists for {serviceName} at {salon.name}
      </h1>

      {stylists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {stylists.map((stylist) => (
            <StylistCard
              key={stylist._id}
              stylist={stylist}
              specialization={serviceName} // pass the requested serviceName
              salonId={salonId} // pass salonId for navigation
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">
          No specialists available for {serviceName}.
        </p>
      )}
    </div>
  );
}
