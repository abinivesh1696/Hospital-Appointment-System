const User = require("../models/User");
const Patient = require("../models/Patient");

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private (Admin and Doctors only)
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({}).populate(
      "userId",
      "name email phone gender age profileImage role"
    );
    res.json(patients);
  } catch (error) {
    console.error("Fetch Patients Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single patient by ID (supports Patient Profile ID or User ID)
// @route   GET /api/patients/:id
// @access  Private (Admin, Doctor, or Patient self)
const getPatientById = async (req, res) => {
  const { id } = req.params;
  try {
    let patient = await Patient.findById(id).populate(
      "userId",
      "name email phone gender age profileImage role"
    );

    if (!patient) {
      // Try lookup by userId
      patient = await Patient.findOne({ userId: id }).populate(
        "userId",
        "name email phone gender age profileImage role"
      );
    }

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    // Authorization: User must be Admin, Doctor, or the Patient themselves
    if (
      req.user.role !== "admin" &&
      req.user.role !== "doctor" &&
      req.user._id.toString() !== patient.userId._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized to view this profile" });
    }

    res.json(patient);
  } catch (error) {
    console.error("Fetch Patient Detail Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete patient (by Admin)
// @route   DELETE /api/patients/:id
// @access  Private/Admin
const deletePatient = async (req, res) => {
  const { id } = req.params;
  try {
    let patient = await Patient.findById(id);
    if (!patient) {
      patient = await Patient.findOne({ userId: id });
    }

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    // Delete user and patient documents
    await User.findByIdAndDelete(patient.userId);
    await Patient.findByIdAndDelete(patient._id);

    res.json({ message: "Patient account deleted successfully" });
  } catch (error) {
    console.error("Delete Patient Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPatients,
  getPatientById,
  deletePatient,
};
