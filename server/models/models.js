import mongoose from "mongoose";

// User Schema


const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  passwordHash: { type: String },
  role: { type: String, enum: ["customer", "stylist", "salonOwner"], default: "customer" },
  isActive: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  location: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
    name: { type: String, default: "" }
  },
  profilePhoto: { type: String, default: "/userlogo.png" },

  // Rating only for stylist and salonOwner
  rating: {
    type: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        value: { type: Number, min: 1, max: 5 },
        comment: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    default: function() {
      return this.role === "stylist" || this.role === "salonOwner" ? [] : undefined;
    }
  },
  averageRating: {
    type: Number,
    default: function() {
      return this.role === "stylist" || this.role === "salonOwner" ? 0 : undefined;
    }
  }
}, { timestamps: true });

// Calculate averageRating before save
userSchema.pre("save", function(next) {
  if (this.rating && this.rating.length > 0) {
    const sum = this.rating.reduce((acc, r) => acc + r.value, 0);
    this.averageRating = sum / this.rating.length;
  }
  next();
});

const User = mongoose.model("User", userSchema);
export default User;




// Salon Schema
const salonSchema = new mongoose.Schema({
  salonName: { type: String, required: true },
  location: {
    address: { type: String },
    geo: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  contactNumber: { type: String },
  email: { type: String },
  description: { type: String },
  imageUrl: { type: String },
  status: { type: String, enum: ["approved", "pending", "suspended"], default: "pending" }
}, { timestamps: true });

const Salon = mongoose.model("Salon", salonSchema);

// Service Schema
// const serviceSchema = new mongoose.Schema({
//   salonId: { type: mongoose.Schema.Types.ObjectId, ref: "Salon", required: true },
//   serviceName: { type: String, required: true },
//   description: { type: String },
//   price: { type: Number, required: true },
//   duration: { type: Number, required: true }, // in minutes
//   imageUrl: { type: String },
//   isActive: { type: Boolean, default: true }
// }, { timestamps: true });

// const Service = mongoose.model("Service", serviceSchema);

// Stylist Schema
// const stylistSchema = new mongoose.Schema({
//   salonId: { type: mongoose.Schema.Types.ObjectId, ref: "Salon", required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   name: { type: String },
//   bio: { type: String },
//   specialization: [{ type: String }],
//   profileImageUrl: { type: String },
//   availabilitySchedule: [{
//     day: { type: String },
//     slots: [{ type: String }]
//   }]
// }, { timestamps: true });

// const Stylist = mongoose.model("Stylist", stylistSchema);

// Appointment Schema
// const appointmentSchema = new mongoose.Schema({
//   customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   salonId: { type: mongoose.Schema.Types.ObjectId, ref: "Salon", required: true },
//   stylistId: { type: mongoose.Schema.Types.ObjectId, ref: "Stylist" },
//   serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
//   appointmentDate: { type: Date, required: true },
//   slotTime: { type: String, required: true },
//   status: { type: String, enum: ["booked", "completed", "cancelled"], default: "booked" },
//   paymentStatus: { type: String, enum: ["pending", "paid", "refunded"], default: "pending" }
// }, { timestamps: true });

// const Appointment = mongoose.model("Appointment", appointmentSchema);

// // Payment Schema
// const paymentSchema = new mongoose.Schema({
//   appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
//   customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   amount: { type: Number, required: true },
//   paymentMethod: { type: String, required: true },
//   transactionId: { type: String },
//   paymentDate: { type: Date },
//   status: { type: String, enum: ["success", "failed", "pending"], default: "pending" }
// }, { timestamps: true });

// const Payment = mongoose.model("Payment", paymentSchema);

// // Review & Rating Schema
// const reviewSchema = new mongoose.Schema({
//   customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   salonId: { type: mongoose.Schema.Types.ObjectId, ref: "Salon", required: true },
//   stylistId: { type: mongoose.Schema.Types.ObjectId, ref: "Stylist" },
//   serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
//   rating: { type: Number, min: 1, max: 5, required: true },
//   comments: { type: String },
//   dateCreated: { type: Date, default: Date.now }
// });

// const Review = mongoose.model("Review", reviewSchema);

// // Notification Schema
// const notificationSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   type: { type: String, enum: ["email", "sms"], required: true },
//   content: { type: String, required: true },
//   sentTime: { type: Date },
//   status: { type: String, enum: ["sent", "failed"], default: "sent" }
// }, { timestamps: true });

// const Notification = mongoose.model("Notification", notificationSchema);

export {
  User,
  Salon,
  // Service,
//  Stylist,
//  Appointment,
  //Payment,
  //Review,
  //Notification
};
