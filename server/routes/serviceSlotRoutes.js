import express from "express";
import { getSlots, updateSlots } from "../controllers/serviceSlotController.js";

const router = express.Router();

// PUT /api/slots → create/update slots for a stylist
router.put("/", updateSlots);

// GET /api/slots → fetch slots for a stylist (by stylistId, date, specialization)
router.get("/", getSlots);

export default router;
