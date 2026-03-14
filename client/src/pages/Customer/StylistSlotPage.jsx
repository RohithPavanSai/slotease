import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function StylistSlotPage() {
  const { stylistId, serviceName, id } = useParams(); // serviceName = specialization
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [mobile, setMobile] = useState("");
  const [referencePhoto, setReferencePhoto] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const backendURL = "http://localhost:8080";

  // ✅ Get logged-in user info
  const user = JSON.parse(localStorage.getItem("user"));
  const customerName = user?.fullName || user?.name || "";
  const customerId = id;

  // ✅ Load slots by date, stylist, and specialization
  useEffect(() => {
    if (!stylistId || !serviceName) return;

    const fetchSlots = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/slots`, {
          params: { stylistId, specialization: serviceName, date: selectedDate },
        });

        console.log("res : "  , res.data);

        const matchingSlots = res.data.filter(
          (slot) =>
            slot.specialization &&
            slot.specialization.toLowerCase() === serviceName.toLowerCase()
        );

        setSlots(res.data);
        setFilteredSlots(matchingSlots);
      } catch (err) {
        console.error("Error fetching slots:", err.response?.data || err);
        setError("Failed to fetch slots");
      }
    };

    fetchSlots();
  }, [stylistId, serviceName, selectedDate]);

  const handleSlotSelect = (slot) => {
    if (slot.isBooked) return;
    setSelectedSlot(slot);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setReferencePhoto(file);
  };

  // ✅ Create Razorpay order and initiate payment
  const bookSlot = async () => {
    if (!selectedSlot) return alert("Select a slot first");
    if (!mobile) return alert("Enter your mobile number");
    if (!customerId || !customerName) return alert("User info missing — please login again");

    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      const orderData = {
        serviceName,
        customerId,
        stylistId,
        salonId: selectedSlot.salonId || "",
        startTime: `${selectedDate}T${selectedSlot.time.split("-")[0]}:00`,
        endTime: `${selectedDate}T${selectedSlot.time.split("-")[1]}:00`,
        customerName,
        mobile,
      };

      const response = await axios.post(`${backendURL}/api/payments/create-order`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { razorpayOrderId, order, amount } = response.data;

      // Open Razorpay modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: "INR",
        name: "Salon Slot Ease",
        description: `Payment for ${serviceName}`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          await verifyPayment(response, order._id);
        },
        prefill: {
          name: customerName,
          email: "", // Add email if available
          contact: mobile,
        },
        theme: {
          color: "#7bf6a2",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            alert("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Order creation error:", err.response?.data || err);
      setError("Failed to initiate payment");
      setLoading(false);
    }
  };

  // ✅ Verify payment and complete booking
  const verifyPayment = async (response, orderId) => {
    try {
      const token = localStorage.getItem("authToken");
      const verifyData = {
        orderId,
        paymentId: response.razorpay_payment_id,
        signature: response.razorpay_signature,
      };

      await axios.post(`${backendURL}/api/payments/verify-payment`, verifyData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Upload reference photo if provided
      if (referencePhoto) {
        const formData = new FormData();
        formData.append("referencePhoto", referencePhoto);
        await axios.put(`${backendURL}/api/appointments/${orderId}/upload-photo`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Mark slot as booked
      await axios.put(`${backendURL}/api/slots`, {
        stylistId,
        salonId: selectedSlot.salonId || "",
        serviceId: selectedSlot.serviceId || "",
        specialization: serviceName,
        date: selectedDate,
        slots: [selectedSlot.time],
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Payment successful and appointment booked!");
      setSelectedSlot(null);
      setMobile("");
      setReferencePhoto(null);
      setLoading(false);

      // Refresh slots
      const res = await axios.get(`${backendURL}/api/slots`, {
        params: { stylistId, specialization: serviceName, date: selectedDate },
      });
      const matchingSlots = res.data.filter(
        (slot) =>
          slot.specialization &&
          slot.specialization.toLowerCase() === serviceName.toLowerCase()
      );
      setFilteredSlots(matchingSlots);
    } catch (err) {
      console.error("Payment verification error:", err.response?.data || err);
      setError("Payment verification failed");
      setLoading(false);
    }
  };


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">
        Available Slots for {serviceName}
      </h1>

      {/* Date selector */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>

      {/* Mobile input */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Mobile Number:</label>
        <input
          type="tel"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Enter mobile number"
          className="border px-2 py-1 rounded"
        />
      </div>

      {/* Image upload */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Reference Photo (optional):</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      {/* Slots grid */}
{/* Slots grid */}
{filteredSlots.length === 0 ? (
  <p className="text-gray-600">
    No available slots for {serviceName} on {selectedDate}.
  </p>
) : (
 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
  {filteredSlots.map((slot) => {
    const isBooked = slot.isBooked;
    const isSelected = selectedSlot?.time === slot.time;

    return (
      <div key={slot._id || slot.time} className="flex flex-col items-center">
        <button
          onClick={() => handleSlotSelect(slot)}
          disabled={isBooked}
          className={`w-full px-3 py-2 rounded border text-center transition ${
            isBooked
              ? "bg-red-600 text-white cursor-not-allowed"
              : isSelected
              ? "bg-green-700 text-white"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {slot.time}
        </button>

        {/* Optional badge */}
        {isBooked && (
          <div className="mt-1 px-2 py-1 text-xs bg-red-600 text-white rounded-xl border border-red-700 text-center">
            Booked
          </div>
        )}
      </div>
    );
  })}
</div>)}

{/* Book button */}
      <button
        onClick={bookSlot}
        disabled={!selectedSlot || !mobile || loading}
        className={`px-4 py-2 rounded text-white transition ${
          selectedSlot && mobile && !loading
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {loading ? "Processing Payment..." : "Book Selected Slot"}
      </button>
    </div>
  );
}
