const express = require("express");
const multer = require("multer");
const Cattle = require("../models/Cattle");

const router = express.Router();

// MULTER STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ADD CATTLE
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, type, age, price } = req.body;

    const newCattle = new Cattle({
      name,
      type,
      age,
      price,
      image: req.file.filename,
    });

    await newCattle.save();
    res.json({ msg: "Cattle added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL
router.get("/", async (req, res) => {
  const cattle = await Cattle.find().sort({ createdAt: -1 });
  res.json(cattle);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Cattle.findByIdAndDelete(req.params.id);
  res.json({ msg: "Cattle deleted" });
});

module.exports = router;
