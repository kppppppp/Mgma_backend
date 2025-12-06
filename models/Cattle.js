const mongoose = require("mongoose");

const CattleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true }, // Cow / Bull / Calf
    age: { type: String, required: true },
    price: { type: Number, required: true }, // monthly adoption price
    image: { type: String, required: true }, // stored filename
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cattle", CattleSchema);
