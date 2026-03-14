import mongoose from "mongoose";

const stylistSchema = new mongoose.Schema({
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  image: { type: String },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

// Prevent OverwriteModelError
const Stylist = mongoose.models.Stylist || mongoose.model("Stylist", stylistSchema);

export default Stylist;
