import ServiceSlot from "../models/ServiceSlot.js";
import  Appointment  from "../models/Appointment.js";

// ✅ Update / Create Slots for a Stylist
export const updateSlots = async (req, res) => {
  try {
    const { stylistId, salonId, serviceId, specialization, date, slots } = req.body;

    if (!stylistId || !salonId || !serviceId || !specialization || !date || !slots) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ message: "Select at least one slot" });
    }

    // Remove existing slots for that stylist, service, and date
    await ServiceSlot.deleteMany({ stylistId, serviceId, date });

    // Create new slots
    const newSlots = slots.map((time) => ({
      stylistId,
      salonId,
      serviceId,
      specialization,
      date,
      time,
      isBooked: false,
    }));

    const created = await ServiceSlot.insertMany(newSlots);

    res.status(201).json({ message: "Slots updated successfully", slots: created });
  } catch (err) {
    console.error("❌ Error updating slots:", err);
    res.status(500).json({ message: "Server error while updating slots" });
  }
};

// ✅ Get Slots for a Stylist (marks booked ones)
export const getSlots = async (req, res) => {
  try {
    const { stylistId, date, specialization } = req.query;

    if (!stylistId) return res.status(400).json({ message: "stylistId is required" });

    const filter = { stylistId };
    if (date) filter.date = date;
    if (specialization) filter.specialization = specialization;

    // Step 1: Fetch all slots
    const slots = await ServiceSlot.find(filter).sort({ time: 1 });

    // Step 2: Fetch booked appointments
    const bookedAppointments = await Appointment.find({
      stylistId,
      service: specialization,
      startTime: {
        $gte: new Date(`${date}T00:00:00`),
        $lte: new Date(`${date}T23:59:59`),
      },
    }).lean();

    // Step 3: Convert appointment times to slot time strings (e.g., "10:00-10:30")
    const bookedTimes = new Set(
      bookedAppointments.map((a) => {
        const start = new Date(a.startTime).toISOString().slice(11, 16);
        const end = new Date(a.endTime).toISOString().slice(11, 16);
        return `${start}-${end}`;
      })
    );

    // Step 4: Mark booked slots
    const updatedSlots = slots.map((slot) => ({
      ...slot.toObject(),
      isBooked: bookedTimes.has(slot.time),
    }));

    res.json(updatedSlots);
  } catch (err) {
    console.error("❌ Error fetching slots:", err);
    res.status(500).json({ message: "Server error while fetching slots" });
  }
};
