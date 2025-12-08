const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

let otpStore = {}; // temp OTP memory

// SEND OTP
router.post("/send", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000);

  otpStore[email] = {
    otp,
    expires: Date.now() + 5 * 60 * 1000,
  };

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

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

    return res.json({ msg: "OTP sent successfully" });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "OTP email error" });
  }
});

// VERIFY OTP
router.post("/verify", (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore[email];
  if (!record) return res.status(400).json({ msg: "OTP not sent" });

  if (Date.now() > record.expires)
    return res.status(400).json({ msg: "OTP expired" });

  if (String(record.otp) !== String(otp))
    return res.status(400).json({ msg: "Incorrect OTP" });

  delete otpStore[email];
  return res.json({ msg: "OTP verified" });
});

module.exports = router;
