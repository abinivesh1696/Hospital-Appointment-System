const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Doctor = require("../models/Doctor");

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient only)
const bookAppointment = async (req, res) => {
  const { doctor, appointmentDate, appointmentTime, symptoms } = req.body;

  try {
    if (!doctor || !appointmentDate || !appointmentTime || !symptoms) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Verify doctor exists and is approved
    const doctorUser = await User.findById(doctor);
    if (!doctorUser || doctorUser.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const doctorProfile = await Doctor.findOne({ userId: doctor });
    if (!doctorProfile || !doctorProfile.approved) {
      return res.status(400).json({ message: "This doctor is not available for appointments" });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      appointmentDate,
      appointmentTime,
      symptoms,
      status: "Pending",
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error("Book Appointment Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get appointments list based on user role
// @route   GET /api/appointments
// @access  Private (Patient, Doctor, or Admin)
const getAppointments = async (req, res) => {
  try {
    let query = {};

    // Filter appointments based on user role
    if (req.user.role === "patient") {
      query.patient = req.user._id;
    } else if (req.user.role === "doctor") {
      query.doctor = req.user._id;
    }

    // Fetch and populate details
    const appointments = await Appointment.find(query)
      .populate("patient", "name email phone gender age profileImage")
      .populate("doctor", "name email phone gender age profileImage")
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    // Since we also need specialization, qualification, fee for Doctor, let's attach doctor profiles manually or format response
    const formattedAppointments = await Promise.all(
      appointments.map(async (appt) => {
        const docProfile = await Doctor.findOne({ userId: appt.doctor._id });
        const apptObj = appt.toObject();
        if (apptObj.doctor && docProfile) {
          apptObj.doctor.specialization = docProfile.specialization;
          apptObj.doctor.qualification = docProfile.qualification;
          apptObj.doctor.consultationFee = docProfile.consultationFee;
          apptObj.doctor.hospital = docProfile.hospital;
        }
        return apptObj;
      })
    );

    res.json(formattedAppointments);
  } catch (error) {
    console.error("Fetch Appointments Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status/details
// @route   PUT /api/appointments/:id
// @access  Private (Admin, Doctor, or Patient)
const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { status, prescription, notes, appointmentDate, appointmentTime, symptoms } = req.body;

  try {
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Role-based authorization and action limits
    if (req.user.role === "patient") {
      // Patient can only cancel their own appointment
      if (appointment.patient.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized to update this appointment" });
      }

      if (status && status !== "Cancelled") {
        return res.status(400).json({ message: "Patients can only change status to 'Cancelled'" });
      }

      appointment.status = status || appointment.status;
      appointment.appointmentDate = appointmentDate || appointment.appointmentDate;
      appointment.appointmentTime = appointmentTime || appointment.appointmentTime;
      appointment.symptoms = symptoms || appointment.symptoms;
    } else if (req.user.role === "doctor") {
      // Doctor can only update their own appointments
      if (appointment.doctor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized to update this appointment" });
      }

      if (status) {
        if (!["Accepted", "Rejected", "Completed", "Cancelled"].includes(status)) {
          return res.status(400).json({ message: "Invalid status state for doctor" });
        }
        appointment.status = status;
      }

      if (prescription !== undefined) appointment.prescription = prescription;
      if (notes !== undefined) appointment.notes = notes;
    } else if (req.user.role === "admin") {
      // Admin can update anything
      if (status) appointment.status = status;
      if (prescription !== undefined) appointment.prescription = prescription;
      if (notes !== undefined) appointment.notes = notes;
      if (appointmentDate) appointment.appointmentDate = appointmentDate;
      if (appointmentTime) appointment.appointmentTime = appointmentTime;
      if (symptoms) appointment.symptoms = symptoms;
    }

    const updatedAppointment = await appointment.save();

    // Populate response
    const fullyPopulated = await Appointment.findById(updatedAppointment._id)
      .populate("patient", "name email phone gender age profileImage")
      .populate("doctor", "name email phone gender age profileImage");

    res.json({
      message: "Appointment updated successfully",
      appointment: fullyPopulated,
    });
  } catch (error) {
    console.error("Update Appointment Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete appointment (by Admin)
// @route   DELETE /api/appointments/:id
// @access  Private/Admin
const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    await Appointment.findByIdAndDelete(id);
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Delete Appointment Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
};
