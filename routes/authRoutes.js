const express = require("express");
const router = express.Router();

// DEBUG LOG
console.log("AUTH ROUTES FILE LOADED!");

const { register, login } = require("../controllers/authController");

// TEST ROUTE
router.get("/test", (req, res) => {
  res.send("TEST ROUTE WORKING");
});

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", login);

module.exports = router;
