import { useNavigate, useParams } from "react-router-dom";

export default function StylistCard({ stylist ,specialization,salonId}) {
  const navigate = useNavigate();
  const backendURL = "http://localhost:8080";
  const imageSrc = stylist.image ? `${backendURL}${stylist.image}` : "/default-avatar.png";
  const {serviceName} = useParams();
  const {id} = useParams();
  const stylistId = stylist._id;
  const handleClick = () => {
    // Ensure both values exist
    if (!stylist.specialization) {
      alert("This stylist does not have a specialization.");
      return;
    }
    if (!serviceName) {
      alert("Service name is missing.");
      return;
    }

    // Compare specialization with serviceName (case-insensitive)
    if (stylist.specialization.trim().toLowerCase() !== specialization.trim().toLowerCase()) {
      alert(`This stylist does not provide ${serviceName}.`);
      return;
    }

    // Navigate to slot page if matched
    navigate(`/customer/${id}/staff/${salonId}/${serviceName}/${stylistId}/slots`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition cursor-pointer"
    >
      <img
        src={imageSrc}
        alt={stylist.name}
        className="w-full h-40 object-cover rounded-xl mb-4"
      />
      <h3 className="text-lg font-semibold text-purple-700">{stylist.name}</h3>
      <p className="text-sm text-gray-500">{stylist.specialization || "No specialization"}</p>
    </div>
  );
}
