import Razorpay from "razorpay";
import crypto from "crypto";
import Appointment from "../models/Appointment.js";
import Service from "../models/Service.js";


console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID); // Debugging line
console.log("Razorpay Secret Key:", process.env.RAZORPAY_SECRET_KEY); // Debugging line
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_RVnn9ZCkeFPT8w",
  key_secret: process.env.RAZORPAY_SECRET_KEY || "XWfLuMid1n5bt0MkbnxUgGwz",
});

// Create a new order for salon booking
const createOrder = async (req, res) => {
  try {
    const { serviceName, customerId, stylistId, salonId, startTime, endTime, customerName, mobile } = req.body;

    // Fetch service details to get price
    const service = await Service.findOne({ serviceName });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const amount = service.price * 100; // Razorpay expects amount in paise

    // Create Razorpay order
    const razorpayOrder = await razorpayInstance.orders.create({
      amount,
      currency: "INR",
      receipt: `appointment_${Date.now()}`,
      payment_capture: 1,
    });

    // Create appointment with pending payment status
    const newAppointment = new Appointment({
      customerId,
      stylistId,
      salonId,
      serviceName,
      startTime,
      endTime,
      customerName,
      mobile,
      status: "pending_payment",
      razorpayOrderId: razorpayOrder.id,
      amount: service.price,
    });

    await newAppointment.save();

    return res.status(201).json({
      message: "Order created successfully",
      order: newAppointment,
      razorpayOrderId: razorpayOrder.id,
      amount: service.price,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Verify payment
const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    const appointment = await Appointment.findById(orderId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(`${appointment.razorpayOrderId}|${paymentId}`)
      .digest("hex");

    if (expectedSignature === signature) {
      appointment.status = "confirmed";
      appointment.razorpayPaymentId = paymentId;
      await appointment.save();

      return res.status(200).json({
        message: "Payment verified and appointment confirmed",
        appointment,
      });
    } else {
      return res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export { createOrder, verifyPayment };