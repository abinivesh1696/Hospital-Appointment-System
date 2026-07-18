const express = require("express");
const {
  getPatients,
  getPatientById,
  deletePatient,
} = require("../controllers/patientController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/")
  .get(protect, authorize("admin", "doctor"), getPatients);

router.route("/:id")
  .get(protect, getPatientById)
  .delete(protect, authorize("admin"), deletePatient);

module.exports = router;
