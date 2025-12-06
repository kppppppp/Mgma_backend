const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const Adoption = require("../models/Adoption");
const Cattle = require("../models/Cattle");

const router = express.Router();

// ---------------- LOGIN ----------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(400).json({ msg: "Admin not found" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token });
});

// ---------------- DASHBOARD STATS ----------------
router.get("/stats", async (req, res) => {
  try {
    const totalCattle = await Cattle.countDocuments();
    const adoptions = await Adoption.find();

    const totalAdoptions = adoptions.length;
    const totalDonations = adoptions.reduce((sum, a) => sum + a.amount, 0);

    const yourRevenue = totalDonations * 0.10; // 10%

    res.json({
      totalCattle,
      totalAdoptions,
      totalDonations,
      yourRevenue,
      recent: adoptions.slice(0, 5),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// ---------------- ADOPTION LIST ----------------
router.get("/adoptions", async (req, res) => {
  const list = await Adoption.find().populate("cattleId");
  res.json(list);
});

// ---------------- APPROVE ----------------
router.post("/approve/:id", async (req, res) => {
  await Adoption.findByIdAndUpdate(req.params.id, { status: "approved" });
  res.json({ msg: "Approved" });
});

// ---------------- REJECT ----------------
router.post("/reject/:id", async (req, res) => {
  await Adoption.findByIdAndUpdate(req.params.id, { status: "rejected" });
  res.json({ msg: "Rejected" });
});

module.exports = router;
