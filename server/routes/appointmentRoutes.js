const express = require("express");
const {
  bookAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointmentController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/")
  .get(protect, getAppointments)
  .post(protect, authorize("patient"), bookAppointment);

router.route("/:id")
  .put(protect, updateAppointment)
  .delete(protect, authorize("admin"), deleteAppointment);

module.exports = router;
