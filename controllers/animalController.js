// mgma-backend/controllers/animalController.js
const Animal = require("../models/Animal");

exports.getAll = async (req, res) => {
  try {
    const animals = await Animal.find({}).sort({ createdAt: -1 });
    res.json(animals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) return res.status(404).json({ error: "Not found" });
    res.json(animal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin create (simple, no auth shown here — add your auth middleware in production)
exports.create = async (req, res) => {
  try {
    const { name, type, age, description, priceMonthly, priceYearly } = req.body;
    const image = req.file ? "/uploads/" + req.file.filename : null;

    const animal = new Animal({
      name, type, age, description,
      priceMonthly: priceMonthly || 0,
      priceYearly: priceYearly || (priceMonthly ? priceMonthly * 12 : 0),
      image
    });

    await animal.save();
    res.json({ message: "Animal added", animal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
