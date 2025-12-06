const mongoose = require("mongoose");

const adoptionSchema = new mongoose.Schema({
  cattleId: { type: mongoose.Schema.Types.ObjectId, ref: "Cattle", required: true },
  name: String,
  email: String,
  phone: String,
  city: String,
  amount: Number,
  paymentScreenshot: String,
  status: { type: String, default: "Pending" },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Adoption", adoptionSchema);
