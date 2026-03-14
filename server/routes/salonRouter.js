import express from "express";
import User from "../models/models.js"; // Your User model

const router = express.Router();

// GET /api/salons/list
router.get("/list", async (req, res) => {
  try {
    // Fetch all users with role 'salonOwner'
    const salons = await User.find({ role: "salonOwner" });

    const salonsData = salons.map((salon) => ({
      _id: salon._id,
      name: salon.fullName, // using fullName for salon name
      location: salon.location?.name || "",
      rating: salon.averageRating || 5, // use averageRating or default 5
      profilePhoto: salon.profilePhoto,
      reviews: salon.rating || [], // use rating array as reviews
    }));

    res.json(salonsData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch salons" });
  }
});

export default router;
