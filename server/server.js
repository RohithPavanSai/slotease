import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import axios from "axios";
import { fileURLToPath } from "url";
import FormData from "form-data";
import { Blob } from "node:buffer"; // <-- NEW
import multer from "multer";
import salonRouter from "./routes/salonRouter.js";
import slotRoutes from "./routes/serviceSlotRoutes.js";

// after your other imports
import profileRouter from "./routes/profileRouter.js";
import paymentRouter from "./routes/paymentRouter.js";


const upload = multer();
// Paths: Calculate __dirname
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

import connectDB from "./db.js";
import userRouter from "./routes/userRouter.js";
import appointmentRouter from "./routes/appointmentRouter.js";
import stylistRouter from "./routes/stylistRouter.js";
import serviceRouter from "./routes/serviceRouter.js";

dotenv.config();
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// ✅ Ensure uploads folders exist
const folders = ["uploads", "uploads/stylists", "uploads/services"];
folders.forEach((folder) => {
  const fullPath = path.join(__dirname, folder);
  if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
});


// ✅ Serve uploaded images

// ✅ Serve default logos and static files (like /userlogo.png)
app.use(express.static(path.join(__dirname, "public")));

// ✅ Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", userRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/stylists", stylistRouter);
app.use("/api/services", serviceRouter);
app.use("/api/profile", profileRouter);
app.use("/api/salons", salonRouter);
app.use("/api/slots", slotRoutes);
app.use("/api/payments", paymentRouter);


// Health check
app.get("/", (req, res) => res.send("💈 Salon API Running Successfully!"));


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
