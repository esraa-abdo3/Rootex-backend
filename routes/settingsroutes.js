const express = require("express")

const { getSettings, createSettings, updateSettings } = require("../controllers/settings/settingscontrollers");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();


// ================= GET =================
router.get("/", getSettings);


// ================= CREATE =================
router.post(
  "/",
  upload.fields([
    {
      name: "herosection",
      maxCount: 1,
    },
    {
      name: "resultBg",
      maxCount: 1,
    },
  ]),
  createSettings
);



router.patch(
  "/",
  upload.fields([
    {
      name: "herosection",
      maxCount: 1,
    },
    {
      name: "resultBg",
      maxCount: 1,
    },
  ]),
  updateSettings
);

module.exports= router