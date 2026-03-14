import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customerName: { type: String, required: true },
    mobile: { type: String, required: true },
    serviceName: { type: String, required: true },
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    stylistId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending_payment", "confirmed", "in_progress", "completed", "cancelled"],
      default: "pending_payment",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    referencePhoto: {
      type: String, // URL or filename
      default: null,
    },
    amount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Prevent OverwriteModelError in dev
export  default  mongoose.model("Appointment", appointmentSchema);
