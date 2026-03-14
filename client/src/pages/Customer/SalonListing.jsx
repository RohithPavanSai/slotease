import { useEffect, useState } from "react";
import axios from "axios";
import SalonCard from "../../components/Customer/SalonCard";

export default function SalonListing() {
  const backendURL = "http://localhost:8080";
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/salons/list`);

        const salonsData = res.data.map((salon) => {
          // Handle empty or missing profilePhoto
          const profilePhoto =
            salon.profilePhoto && salon.profilePhoto.trim() !== ""
              ? `${backendURL}${salon.profilePhoto.startsWith("/") ? "" : "/"}${salon.profilePhoto}`
              : "/salonlogo.png"; // fallback from frontend public folder

          return {
            ...salon,
            rating: salon.rating || 5,
            profilePhoto,
          };
        });

        setSalons(salonsData);
      } catch (err) {
        console.error("Error fetching salons:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalons();
  }, []);

  if (loading) return <p className="p-6">Loading salons...</p>;
  if (!salons.length)
    return <p className="p-6 text-gray-500">No salons available.</p>;

  return (
    <div className="p-6 h-screen overflow-x-hidden">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">
        Available Salons Near You
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {salons.map((salon) => (
          <SalonCard key={salon._id} salon={salon} />
        ))}
      </div>
    </div>
  );
}
