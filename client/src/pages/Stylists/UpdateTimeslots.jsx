import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const allSlots = [
  "06:00-07:00","07:00-08:00","08:00-09:00","09:00-10:00","10:00-11:00",
  "11:00-12:00","12:00-13:00","13:00-14:00","14:00-15:00","15:00-16:00",
  "16:00-17:00","17:00-18:00","18:00-19:00","19:00-20:00","20:00-21:00","21:00-22:00"
];

export default function UpdateTimeslots() {
  const { id: stylistId } = useParams();
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [existingSlots, setExistingSlots] = useState([]);
  const [error, setError] = useState("");
  const backendURL = "http://localhost:8080";

  // Fetch stylist's services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/services`, {
          params: { stylistId }
        });
        setServices(res.data);
        if (res.data.length > 0) setSelectedService(res.data[0]);
      } catch (err) {
        console.error("❌ Error fetching services:", err.response?.data || err);
        setError("Failed to fetch services");
      }
    };
    fetchServices();
  }, [stylistId]);

  // Fetch existing slots for selected service + date
  useEffect(() => {
    if (!selectedService || !selectedDate) return;

    const fetchSlots = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/slots`, {
          params: { 
            stylistId, 
            specialization: selectedService.serviceName,
            date: selectedDate 
          },
        });

        const times = res.data.map(s => s.time);
        setExistingSlots(times);
        setSelectedSlots(times); // preselect existing slots
      } catch (err) {
        console.error("❌ Error fetching slots:", err.response?.data || err);
        setError("Failed to fetch existing slots");
      }
    };

    fetchSlots();
  }, [selectedService, selectedDate, stylistId]);

  const toggleSlot = (slot) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter(s => s !== slot));
    } else {
      if (selectedSlots.length >= 8) {
        alert("Maximum 8 slots allowed");
        return;
      }
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const saveSlots = async () => {
    if (!selectedDate || !selectedService) {
      setError("Select a date and service first");
      return;
    }

    try {
      await axios.put(`${backendURL}/api/slots`, {
        stylistId,
        salonId: selectedService.salonId,
        serviceId: selectedService._id,
        specialization: selectedService.serviceName,
        date: selectedDate,
        slots: selectedSlots,
      });

      alert("Slots saved successfully");
    } catch (err) {
      console.error("❌ Error saving slots:", err.response?.data || err);
      setError(err.response?.data?.message || "Failed to save slots");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">Update Timeslots</h1>

      <div className="mb-4">
        <label className="mr-2 font-medium">Select Service:</label>
        <select
          value={selectedService?._id || ""}
          onChange={e => {
            const svc = services.find(s => s._id === e.target.value);
            setSelectedService(svc);
            setSelectedSlots([]);
            setExistingSlots([]);
          }}
          className="border px-2 py-1 rounded"
        >
          {services.map(s => (
            <option key={s._id} value={s._id}>{s.serviceName}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="mr-2 font-medium">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="grid grid-cols-4 gap-2 mb-4">
        {allSlots.map(slot => {
          const isSelected = selectedSlots.includes(slot);
          const isExisting = existingSlots.includes(slot);

          return (
            <button
              key={slot}
              onClick={() => toggleSlot(slot)}
              className={`px-3 py-2 rounded border ${
                isSelected
                  ? "bg-purple-600 text-white"
                  : isExisting
                  ? "bg-gray-300 text-gray-700"
                  : "bg-white text-gray-800"
              }`}
            >
              {slot}
            </button>
          );
        })}
      </div>

      <button
        onClick={saveSlots}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Save Slots
      </button>
    </div>
  );
}
