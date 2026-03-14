import  Appointment  from "../models/Appointment.js";
import { User } from "../models/models.js"; // To get customer name

// ✅ BOOK APPOINTMENT
export const bookSlot = async (req, res) => {
  try {
    const { customerId } = req.params;
    const {
      stylistId,
      salonId,
      serviceName,
      startTime,
      endTime,
      mobile,
      amount,
    } = req.body;

    // ✅ Basic validations
    if (!customerId || !stylistId || !salonId || !serviceName || !startTime || !endTime || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Fetch customer name from DB
    const customerUser = await User.findById(customerId).select("fullName");
    if (!customerUser) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // ✅ Check for overlapping appointments
    const conflict = await Appointment.findOne({
      stylistId,
      startTime: { $lte: new Date(endTime) },
      endTime: { $gte: new Date(startTime) },
      status: { $ne: "Cancelled" },
    });

    if (conflict) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    // ✅ Handle uploaded reference photo (if any)
    let referencePhoto = null;
    if (req.file) {
      referencePhoto = `/uploads/${req.file.filename}`;
    }

    // ✅ Create new appointment
    const appointment = new Appointment({
      customer: {
        id: customerId,
        name: customerUser.fullName,
        mobile,
      },
      service: serviceName,
      salonId,
      stylistId,
      startTime,
      endTime,
      referencePhoto, // ✅ Save uploaded image path
      amount: amount || 0,
      status: "Booked",
      payment: false,
    });

    await appointment.save();
    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (err) {
    console.error("❌ Error booking appointment:", err);
    res.status(500).json({ message: "Server error while booking appointment" });
  }
};

// ✅ CANCEL APPOINTMENT
export const cancelSlot = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = "Cancelled";
    await appointment.save();

    res.json({ message: "Appointment cancelled successfully", appointment });
  } catch (err) {
    console.error("❌ Error cancelling appointment:", err);
    res.status(500).json({ message: "Server error while cancelling appointment" });
  }
};

// ✅ FETCH APPOINTMENTS (by stylist or customer)
// Fetch appointments (by salon, optionally by stylist)
export const getAppointments = async (req, res) => {
  try {
    const { salonId, stylistId, customerId } = req.query;
    const filter = {};

    // Mandatory: filter by salonId if provided
    if (salonId) filter.salonId = salonId;

    // Optional: filter by stylistId
    if (stylistId) filter.stylistId = stylistId;

    // Optional: filter by customer
    if (customerId) filter["customer.id"] = customerId;

    const appointments = await Appointment.find(filter)
      .populate("salonId", "fullName email")
      .populate("stylistId", "fullName email")
      .sort({ startTime: 1 });

    res.json(appointments);
  } catch (err) {
    console.error("❌ Error fetching appointments:", err);
    res.status(500).json({ message: "Server error while fetching appointments" });
  }
};

