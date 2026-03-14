import express from "express";
import multer from "multer";
import { bookSlot, cancelSlot, getAppointments } from "../controllers/appointmentController.js";

const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.post("/book/:customerId", upload.single("referencePhoto"), bookSlot);
router.post("/cancel/:appointmentId", cancelSlot);
router.get("/", getAppointments);

export default router;
