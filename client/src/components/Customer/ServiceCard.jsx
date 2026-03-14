// components/Salons/ServiceCard.jsx
import { useNavigate, useParams } from "react-router-dom";
export default function ServiceCard({ service, salonId }) {
  const { id } = useParams();

  const navigate = useNavigate();
  const backendURL = "https://slotease-production-15e5.up.railway.app"; // ✅ same pattern as StylistCard

  const handleClick = () => {
    navigate(`/customer/${id}/staff/${salonId}/${service.serviceName}`, {
      state: { service },
    });
  };

  // Image handling like StylistCard
  const imageSrc = service.image
    ? `${backendURL}${service.image}`
    : "/default-service.png";

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg cursor-pointer transition"
    >
      <img
        src={imageSrc}
        alt={service.serviceName}
        className="w-full h-32 object-cover rounded-xl mb-3"
      />
      <h3 className="text-lg font-semibold text-gray-800">
        {service.serviceName}
      </h3>
      <p className="text-purple-600 font-bold mt-1">₹ {service.price}</p>
      <p className="text-sm text-gray-500 mt-1">{service.duration} mins</p>
    </div>
  );
}
