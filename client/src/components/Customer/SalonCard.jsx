import { Star, MapPin } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function SalonCard({ salon }) {
  const navigate = useNavigate();
  const {id} = useParams();
  // Safe profile image: use fallback if missing or empty
  const profileImage =
    salon.profilePhoto && salon.profilePhoto.trim() !== ""
      ? salon.profilePhoto
      : process.env.PUBLIC_URL + "/salonlogo.png";

  // 🔹 Log the image URL
  console.log("Salon image URL:", profileImage);

  return (
    <div
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
      onClick={() => navigate(`/customer/${id}/salon-details/${salon._id}`)}
    >
      {/* Salon Image */}
      <img
        src={profileImage}
        alt={salon.name}
        className="w-full h-40 object-cover"
      />

      {/* Content */}
      <div className="p-4">
        <h2 className="text-xl font-semibold text-purple-700">{salon.name}</h2>

        <p className="flex items-center text-gray-500 text-sm mt-1">
          <MapPin size={16} className="mr-1 text-purple-500" />
          {salon.location}
        </p>

        <div className="flex items-center mt-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              className={
                i < Math.round(salon.rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {salon.rating.toFixed(1)} / 5
          </span>
        </div>

        <div className="mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/customer/${id}/salon-details/${salon._id}`);
            }}
            className="w-full bg-purple-600 text-white py-2 rounded-xl font-semibold hover:bg-purple-700 transition"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
