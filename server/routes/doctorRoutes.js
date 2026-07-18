const express = require("express");
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctorController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/")
  .get(getDoctors)
  .post(protect, authorize("admin"), createDoctor);

router.route("/:id")
  .get(getDoctorById)
  .put(protect, updateDoctor)
  .delete(protect, authorize("admin"), deleteDoctor);

module.exports = router;
