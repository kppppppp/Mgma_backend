const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

console.log("Connecting to MongoDB...");


// ROUTES
const adminRoutes = require("./routes/adminRoutes");
const cattleRoutes = require("./routes/cattleRoutes");
const adoptionRoutes = require("./routes/adoptionRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// ✅ FINAL WORKING CORS CONFIG
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177"
];


app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);



// MIDDLEWARE
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ROUTES
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cattle", cattleRoutes);
app.use("/api/adoptions", adoptionRoutes);

// MONGO CONNECTION
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo Connected"))
  .catch((err) => console.log("DB Error:", err));

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
