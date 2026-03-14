import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function MyProfile() {
  const { id } = useParams();
  const backendURL = "http://localhost:8080";

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    location: { lat: null, lng: null, name: "" },
    profilePhoto: null,
  });

  const fileInputRef = useRef(null);

  // Fetch user data
  useEffect(() => {
    axios
      .get(`${backendURL}/api/profile/${id}`)
      .then((res) => {
        setUser(res.data);
        setFormData({
          fullName: res.data.fullName || "",
          location: {
            lat: res.data.location?.lat || null,
            lng: res.data.location?.lng || null,
            name: res.data.location?.name || "",
          },
          profilePhoto: null,
        });
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData((prev) => ({ ...prev, profilePhoto: e.target.files[0] }));
    }
  };

  const handlePhotoClick = () => {
    if (editMode && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleLocationChange = async (e) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, name },
    }));

    if (name.length < 3) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          name
        )}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          },
        }));
      }
    } catch (err) {
      console.error("Geocoding error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("fullName", formData.fullName);
    form.append("location", JSON.stringify(formData.location));
    if (formData.profilePhoto) form.append("profilePhoto", formData.profilePhoto);

    try {
      const res = await axios.put(`${backendURL}/api/profile/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(res.data.user);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword || newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    try {
      await axios.put(`${backendURL}/api/profile/${id}/password`, { password: newPassword });
      alert("Password updated successfully!");
      setNewPassword("");
      setChangePasswordMode(false);
    } catch (err) {
      console.error(err);
      alert("Password update failed.");
    }
  };

  if (!user) return <p>Loading...</p>;

  // Determine default profile image


  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-2xl relative">
      {/* CHANGE PASSWORD MODE */}
      {changePasswordMode ? (
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-bold">Change Password</h2>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
          <div className="flex justify-between w-full">
            <button
              onClick={() => setChangePasswordMode(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handlePasswordChange}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* PROFILE DISPLAY / EDIT MODE */}
          <div className="absolute top-4 right-4">
            {!editMode && (
              <button
                onClick={() => setChangePasswordMode(true)}
                className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm"
              >
                Change Password
              </button>
            )}
          </div>

          <div className="flex flex-col items-center">
            {/* PROFILE PHOTO */}
            <img
              src={
                formData.profilePhoto
                  ? URL.createObjectURL(formData.profilePhoto)
                  : user.role=="salonOwner"?"/salonlogo.png":"/userlogo.png"
              }
              alt="Profile"
              onClick={handlePhotoClick}
              className={`w-32 h-32 rounded-full object-cover mb-4 border cursor-pointer ${
                editMode ? "hover:opacity-80 transition" : ""
              }`}
            />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept="image/*"
            />

            {!editMode && (
              <>
                <h2 className="text-xl font-bold">{user.fullName}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500 mt-1 capitalize">{user.role}</p>
              </>
            )}

            {editMode && (
              <form onSubmit={handleSubmit} className="w-full mt-4 space-y-4">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Full Name"
                  required
                />

                <input
                  type="text"
                  name="locationName"
                  value={formData.location.name}
                  onChange={handleLocationChange}
                  placeholder="Change your place"
                  className="w-full border rounded-lg px-3 py-2"
                />
                {formData.location.lat && formData.location.lng && (
                  <p className="text-gray-500 text-sm mt-1">
                    Latitude: {formData.location.lat.toFixed(6)}, Longitude:{" "}
                    {formData.location.lng.toFixed(6)}
                  </p>
                )}

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Edit Profile
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
