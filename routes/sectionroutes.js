const express = require("express");

const {getSectionOrder,updateSectionOrder,} = require("../controllers/section/sectioncontrollers");

const router = express.Router();

router.get("/", getSectionOrder);
router.put("/", updateSectionOrder);

module.exports = router;