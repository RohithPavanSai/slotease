import { useNavigate } from "react-router-dom";

export default function ServiceCard({ service }) {
  const navigate = useNavigate();
  const backendURL = "http://localhost:8080"; 

  const handleClick = () => {
    // Navigate to edit page in salon dashboard
    navigate(`/salon/services/edit/${service._id}`, { state: { service } });
  };

 const imageSrc =  `${backendURL}${service.image}`;


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
      <h3 className="text-lg font-semibold text-gray-800">{service.serviceName}</h3>
      <p className="text-purple-600 font-bold mt-1">₹ {service.price}</p>
      <p className="text-sm text-gray-500 mt-1">{service.duration} mins</p>
    </div>
  );
}
