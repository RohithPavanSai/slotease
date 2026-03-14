import express from "express";
import multer from "multer";
import path from "path";
import {
  addStylist,
  listStylists,
  updateStylist,
  deleteStylist,
} from "../controllers/stylistController.js";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/stylists"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), addStylist);
router.get("/", listStylists);
router.put("/:id", upload.single("image"), updateStylist);
router.delete("/:id", deleteStylist);

export default router;
