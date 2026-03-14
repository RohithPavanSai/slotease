// Controllers/AuthControllers.js
import bcrypt from "bcryptjs";
import { User } from "../models/models.js";
import Stylist from "../models/Stylist.js"
import jwt from "jsonwebtoken";
// Signup: create user (no OTP/email)
export const signup = async (req, res) => {
  try {
    const { email, fullName, password, role, locationName, lat, lng } = req.body;

    if (!email || !password || !fullName)
      return res.status(400).json({ message: "Missing fields" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);

    // Save profile photo path if uploaded
    let profilePhotoPath = "";
    if (req.file) {
      profilePhotoPath = `/uploads/${req.file.filename}`;
    }

    const user = new User({
      email,
      fullName,
      passwordHash,
      role,
      location: { name: locationName, lat: lat || null, lng: lng || null },
      profilePhoto: profilePhotoPath,
      isActive: true,
    });

    await user.save();

    res.status(201).json({ message: "Signup successful", userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check User collection (customer/salonOwner)
    let user = await User.findOne({ email });
    let role = "";
    let passwordHash = "";

    if (user) {
      role = user.role; // customer or salonOwner
      passwordHash = user.passwordHash;
    } else {
      // Check Stylist collection
      const stylist = await Stylist.findOne({ email });
      console.log("stylist",stylist);
      if (stylist) {
        user = stylist;
        role = "stylist";
        passwordHash = stylist.passwordHash;
      }
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Create JWT token
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

res.json({
  message: "Login successful",
  token,
  user: {
    id: user._id,
    role,
    name: user.fullName || user.name || "", // fallback in case stylist uses `name`
    email: user.email,
  },
});

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};
