import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    salonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Salon",
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "", // ✅ always saves a string (never null)
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    description: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, strict: true }
);

// ✅ Always reuse existing model (no overwrite errors)
export default mongoose.models.Service || mongoose.model("Service", serviceSchema);
