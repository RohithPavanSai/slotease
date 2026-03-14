// controllers/stylistController.js
import bcrypt from "bcryptjs";
import Stylist from "../models/Stylist.js";

// ➕ Add stylist
export const addStylist = async (req, res) => {
  try {
    const { salonId, name, specialization, experience, rating, email, password } = req.body;

    if (!email || !password || !name || !specialization || !salonId) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const existing = await Stylist.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // ✅ Use uploaded image or default
    const image = req.file
      ? `/uploads/stylists/${req.file.filename}`
      : "/public/stylistlogo.png";

    // ✅ Use default rating (5) if not provided
    const stylist = new Stylist({
      salonId,
      name,
      specialization,
      experience: experience || 0,
      rating: rating || 5,
      email,
      passwordHash,
      image,
    });

    await stylist.save();
    res.status(201).json(stylist);
  } catch (err) {
    console.error("❌ Error adding stylist:", err);
    res.status(500).json({ message: "Server error while adding stylist" });
  }
};
// 📋 List stylists
export const listStylists = async (req, res) => {
  try {
    const { salonId } = req.query;
    const filter = salonId ? { salonId } : {};
    const stylists = await Stylist.find(filter);
    res.json(stylists);
  } catch (err) {
    console.error("❌ Error listing stylists:", err);
    res.status(500).json({ message: "Server error while listing stylists" });
  }
};

// ✏️ Update stylist
export const updateStylist = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (req.file) {
      updates.image = `/uploads/stylists/${req.file.filename}`;
    }

    if (updates.password) {
      updates.passwordHash = await bcrypt.hash(updates.password, 10);
      delete updates.password;
    }

    const stylist = await Stylist.findByIdAndUpdate(id, updates, { new: true });
    res.json(stylist);
  } catch (err) {
    console.error("❌ Error updating stylist:", err);
    res.status(500).json({ message: "Server error while updating stylist" });
  }
};

// 🗑️ Delete stylist
export const deleteStylist = async (req, res) => {
  try {
    const { id } = req.params;
    await Stylist.findByIdAndDelete(id);
    res.json({ message: "Stylist deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting stylist:", err);
    res.status(500).json({ message: "Server error while deleting stylist" });
  }
};
