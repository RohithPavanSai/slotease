import { Star, Briefcase } from "lucide-react";

export default function StylistCard({ stylist }) {
  const backendURL = "https://slotease-production-15e5.up.railway.app"; // ✅ backend URL
  const imageSrc = stylist.image
    ? `${backendURL}${stylist.image}`
    : "/default-avatar.png";

  const rating = stylist.rating || 0;

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition cursor-pointer">
      {/* 🖼️ Image */}
      <img
        src={imageSrc}
        alt={stylist.name}
        className="w-full h-40 object-cover rounded-xl mb-4"
      />

      {/* 🧑‍🎨 Name & specialization */}
      <h3 className="text-lg font-semibold text-purple-700">{stylist.name}</h3>
      <p className="text-sm text-gray-500">{stylist.specialization}</p>

      {/* 🧰 Experience */}
      <p className="flex items-center text-gray-600 mt-2">
        <Briefcase size={16} className="mr-2 text-purple-500" />
        {stylist.experience || 0} years experience
      </p>

      {/* ⭐ Rating */}
      <div className="flex items-center mt-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            className={
              i < Math.round(rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating.toFixed(1)} / 5
        </span>
      </div>
    </div>
  );
}
