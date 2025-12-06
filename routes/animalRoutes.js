// mgma-backend/routes/animalRoutes.js
const express = require("express");
const router = express.Router();
const animalController = require("../controllers/animalController");

const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + Math.round(Math.random()*1e9) + ext);
  }
});
const upload = multer({ storage });

// PUBLIC
router.get("/", animalController.getAll);
router.get("/:id", animalController.getById);

// ADMIN (create) — protect with auth in production (e.g., auth middleware)
router.post("/", upload.single("image"), animalController.create);

module.exports = router;
