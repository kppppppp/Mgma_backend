const express = require("express");
const multer = require("multer");
const Adoption = require("../models/Adoption");
const Cattle = require("../models/Cattle");
const auth = require("../middleware/auth");

const router = express.Router();

// UPLOAD SCREENSHOT
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });


// USER — SUBMIT ADOPTION REQUEST
router.post("/submit", upload.single("screenshot"), async (req, res) => {
  const { cattleId, name, email, phone, city, amount } = req.body;

  const adoption = await Adoption.create({
    cattleId,
    name,
    email,
    phone,
    city,
    amount,
    paymentScreenshot: req.file.filename,
  });

  res.json({ msg: "Request submitted", adoption });
});


// ADMIN — GET ALL ADOPTION REQUESTS
router.get("/", auth, async (req, res) => {
  const list = await Adoption.find().populate("cattleId");
  res.json(list);
});


// ADMIN — APPROVE ADOPTION
router.put("/approve/:id", auth, async (req, res) => {
  await Adoption.findByIdAndUpdate(req.params.id, { status: "Approved" });
  res.json({ msg: "Adoption approved" });
});


// ADMIN — REJECT ADOPTION
router.put("/reject/:id", auth, async (req, res) => {
  await Adoption.findByIdAndUpdate(req.params.id, { status: "Rejected" });
  res.json({ msg: "Adoption rejected" });
});


module.exports = router;
