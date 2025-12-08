const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// TEMPORARY OTP STORE (5 min validity)
let otpStore = {};

// 📌 SEND OTP
router.post("/send", async (req, res) => {
  const { email } = req.body;

  console.log("📩 OTP SEND REQUEST:", email);
  console.log("📌 MAIL_USER =", process.env.MAIL_USER);
  console.log("📌 MAIL_PASS =", process.env.MAIL_PASS ? "***HIDDEN***" : "NOT FOUND");

  if (!email) return res.status(400).json({ msg: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log("🔢 GENERATED OTP:", otp);

  otpStore[email] = {
    otp,
    expires: Date.now() + 5 * 60 * 1000, // 5 minutes
  };

  try {
    // TRANSPORTER
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    console.log("📤 ATTEMPTING TO SEND EMAIL...");

    // SEND EMAIL
    await transporter.sendMail({
      from: `"MGMA Gaushala" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <h2>Your OTP Code</h2>
        <p style="font-size: 22px; font-weight: bold;">${otp}</p>
        <p>Valid for 5 minutes.</p>
      `,
    });

    console.log("✅ OTP EMAIL SENT SUCCESSFULLY!");

    return res.json({ msg: "OTP sent successfully" });

  } catch (err) {
    console.log("❌ OTP EMAIL ERROR:", err);
    return res
      .status(500)
      .json({ msg: "OTP email error", error: err.message });
  }
});

// 📌 VERIFY OTP
router.post("/verify", (req, res) => {
  const { email, otp } = req.body;

  console.log("🔍 OTP VERIFY REQUEST:", email, otp);

  const record = otpStore[email];
  if (!record) {
    console.log("❌ OTP NOT FOUND IN STORE");
    return res.status(400).json({ msg: "OTP not sent" });
  }

  if (Date.now() > record.expires) {
    console.log("⏳ OTP EXPIRED");
    return res.status(400).json({ msg: "OTP expired" });
  }

  if (String(record.otp) !== String(otp)) {
    console.log("❌ WRONG OTP ENTERED");
    return res.status(400).json({ msg: "Incorrect OTP" });
  }

  delete otpStore[email];
  console.log("✅ OTP VERIFIED SUCCESSFULLY!");

  return res.json({ msg: "OTP verified" });
});

module.exports = router;
