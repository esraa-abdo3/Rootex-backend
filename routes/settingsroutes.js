const express = require("express")

const { getSettings, createSettings, updateSettings } = require("../controllers/settings/settingscontrollers");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();


// ================= GET =================
router.get("/", getSettings);


// ================= CREATE =================
router.post(
  "/",
  upload.any(),
  createSettings
);


router.patch(
  "/",
  upload.any(),
  updateSettings
);

module.exports= router