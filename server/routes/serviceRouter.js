// routes/serviceRouter.js
import express from "express";
import multer from "multer";
import path from "path";
import { __dirname } from "../server.js"; // Absolute path reference
import {
  addService,
  listServices,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationPath = path.join(__dirname, "uploads", "services");
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), addService);
router.get("/", listServices);
router.put("/:id", upload.single("image"), updateService);
router.delete("/:id", deleteService);

export default router;
