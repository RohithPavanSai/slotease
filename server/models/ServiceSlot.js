// models/ServiceSlot.js
import mongoose from "mongoose";

const serviceSlotSchema = new mongoose.Schema({
  stylistId: { type: mongoose.Schema.Types.ObjectId, ref: "Stylist", required: true },
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: "Salon", required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  specialization: { type: String, required: true }, // <-- added specialization
  date: { type: String, required: true }, // Format: "YYYY-MM-DD"
  time: { type: String, required: true }, // Example: "06:00-07:00"
  isBooked: { type: Boolean, default: false },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });

export default mongoose.model("ServiceSlot", serviceSlotSchema);
