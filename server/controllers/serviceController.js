// controllers/serviceController.js
import  Service  from "../models/Service.js";

// Utility: Validate numeric fields
const validateNumericInput = (value, fieldName) => {
  const parsed = parseFloat(value);
  if (isNaN(parsed) || parsed < 0) {
    return { error: `${fieldName} must be a valid, non-negative number.`, status: 422 };
  }
  return { value: parsed };
};

// ➕ Add Service
export const addService = async (req, res) => {
  try {
    const { salonId, serviceName, price, duration, description } = req.body;
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);

    const image = req.file ? `/uploads/services/${req.file.filename}` : null;

    if (!salonId || !serviceName || price === undefined || duration === undefined) {
      return res.status(400).json({ message: "Salon ID, name, price, and duration are required." });
    }

    const priceValidation = validateNumericInput(price, "Price");
    if (priceValidation.error) return res.status(priceValidation.status).json({ message: priceValidation.error });

    const durationValidation = validateNumericInput(duration, "Duration");
    if (durationValidation.error) return res.status(durationValidation.status).json({ message: durationValidation.error });
    console.log({
  salonId,
  serviceName,
  price: priceValidation.value,
  duration: durationValidation.value,
  description,
  image
});

    const service = new Service({
      salonId,
      serviceName,
      image,
      price: priceValidation.value,
      duration: durationValidation.value,
      description,
    });

    await service.save();
    console.log("Saved service:", service);
    res.status(201).json(service);
  } catch (err) {
    console.error("❌ Error adding service:", err);
    res.status(500).json({ message: "Server error while adding service" });
  }
};

// 📋 List Services
export const listServices = async (req, res) => {
  try {
    const { salonId } = req.query;
    const filter = salonId ? { salonId } : {};
    const services = await Service.find(filter);
    res.json(services);
  } catch (err) {
    console.error("❌ Error listing services:", err);
    res.status(500).json({ message: "Server error while listing services" });
  }
};

// ✏️ Update Service
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.price !== undefined) {
      const priceValidation = validateNumericInput(updates.price, "Price");
      if (priceValidation.error) return res.status(priceValidation.status).json({ message: priceValidation.error });
      updates.price = priceValidation.value;
    }

    if (updates.duration !== undefined) {
      const durationValidation = validateNumericInput(updates.duration, "Duration");
      if (durationValidation.error) return res.status(durationValidation.status).json({ message: durationValidation.error });
      updates.duration = durationValidation.value;
    }

    if (req.file) updates.image = `/uploads/services/${req.file.filename}`;

    const service = await Service.findByIdAndUpdate(id, updates, { new: true });
    if (!service) return res.status(404).json({ message: "Service not found" });

    res.json(service);
  } catch (err) {
    console.error("❌ Error updating service:", err);
    res.status(500).json({ message: "Server error while updating service" });
  }
};

// 🗑️ Delete Service
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Service.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting service:", err);
    res.status(500).json({ message: "Server error while deleting service" });
  }
};
