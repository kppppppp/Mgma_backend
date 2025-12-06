// mgma-backend/models/Animal.js
const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["Cow", "Bull", "Calf"], required: true },
    age: String,
    description: String,
    priceMonthly: { type: Number, default: 0 },
    priceYearly: { type: Number, default: 0 },
    image: String, // path to uploaded file (e.g. /uploads/xxxx.jpg)
    status: { type: String, enum: ["available","adopted"], default: "available" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Animal", animalSchema);
