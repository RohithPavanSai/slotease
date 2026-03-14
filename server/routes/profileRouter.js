import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import User from "../models/models.js";

const router = express.Router();

// ✅ Ensure folder exists for user photos
const userUploadsDir = "uploads/users";
if (!fs.existsSync(userUploadsDir)) fs.mkdirSync(userUploadsDir, { recursive: true });

// ✅ Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, userUploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ✅ GET profile by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ UPDATE profile (except email & role)
router.put("/:id", upload.single("profilePhoto"), async (req, res) => {
  try {
    const { fullName, location } = req.body;
    const updateData = { fullName };

    if (location) updateData.location = JSON.parse(location);
    if (req.file) updateData.profilePhoto = `/uploads/users/${req.file.filename}`;
    console.log("updated",updateData.profilePhoto);
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).select("-passwordHash");

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
