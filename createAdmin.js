const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config();

const Admin = require("./models/Admin");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("DB Connected");

  const hashed = await bcrypt.hash("Admin1234", 10);

  await Admin.create({
    email: "admin@gmail.com",
    password: hashed,
  });

  console.log("Admin created!");
  process.exit();
})();
