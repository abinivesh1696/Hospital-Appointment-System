const User = require("../models/User");
const Doctor = require("../models/Doctor");

// @desc    Get all doctors (with filters for search, specialization, approval status)
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res) => {
  try {
    const { specialization, search, approved } = req.query;
    let query = {};

    // Filter by approved status
    // Default to approved: true for general listings (unless explicitly querying otherwise or admin/role requested)
    if (approved !== undefined) {
      if (approved === "all") {
        // No approved filter (admin view)
      } else {
        query.approved = approved === "true";
      }
    } else {
      query.approved = true; // Patients see only approved doctors
    }

    // Filter by specialization
    if (specialization) {
      query.specialization = specialization;
    }

    // First find all doctors matching direct query
    let doctors = await Doctor.find(query).populate("userId", "name email phone gender age profileImage role");

    // Filter by name search query if provided
    if (search) {
      const searchRegex = new RegExp(search, "i");
      doctors = doctors.filter((doc) => doc.userId && searchRegex.test(doc.userId.name));
    }

    res.json(doctors);
  } catch (error) {
    console.error("Fetch Doctors Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single doctor by ID (supports User ID or Doctor Profile ID)
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
  const { id } = req.params;
  try {
    let doctor = await Doctor.findById(id).populate("userId", "name email phone gender age profileImage role");

    if (!doctor) {
      // Try searching by userId
      doctor = await Doctor.findOne({ userId: id }).populate("userId", "name email phone gender age profileImage role");
    }

    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    res.json(doctor);
  } catch (error) {
    console.error("Fetch Doctor Detail Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create doctor (by Admin)
// @route   POST /api/doctors
// @access  Private/Admin
const createDoctor = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    gender,
    age,
    specialization,
    qualification,
    experience,
    consultationFee,
    hospital,
    availableDays,
    availableTime,
    about,
  } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Create doctor User
    const user = await User.create({
      name,
      email,
      password,
      phone: phone || "",
      gender: gender || "",
      age: age ? Number(age) : null,
      role: "doctor",
    });

    // Create doctor profile (pre-approved since Admin is adding them)
    const doctor = await Doctor.create({
      userId: user._id,
      specialization,
      qualification,
      experience: Number(experience),
      consultationFee: Number(consultationFee),
      hospital,
      availableDays: availableDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      availableTime: availableTime || "09:00 AM - 05:00 PM",
      about: about || "",
      approved: true,
    });

    res.status(201).json({
      message: "Doctor created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      profile: doctor,
    });
  } catch (error) {
    console.error("Admin Create Doctor Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update doctor profile (by Admin or Doctor self)
// @route   PUT /api/doctors/:id
// @access  Private (Admin or Doctor self)
const updateDoctor = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    phone,
    gender,
    age,
    specialization,
    qualification,
    experience,
    consultationFee,
    hospital,
    availableDays,
    availableTime,
    about,
    approved,
  } = req.body;

  try {
    let doctor = await Doctor.findById(id);
    if (!doctor) {
      doctor = await Doctor.findOne({ userId: id });
    }

    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    // Authorization check: User must be Admin or the Doctor user themselves
    if (req.user.role !== "admin" && req.user._id.toString() !== doctor.userId.toString()) {
      return res.status(403).json({ message: "Not authorized to update this profile" });
    }

    // Update Doctor profile fields
    doctor.specialization = specialization || doctor.specialization;
    doctor.qualification = qualification || doctor.qualification;
    doctor.experience = experience !== undefined ? Number(experience) : doctor.experience;
    doctor.consultationFee = consultationFee !== undefined ? Number(consultationFee) : doctor.consultationFee;
    doctor.hospital = hospital || doctor.hospital;
    doctor.availableDays = availableDays !== undefined ? availableDays : doctor.availableDays;
    doctor.availableTime = availableTime || doctor.availableTime;
    doctor.about = about !== undefined ? about : doctor.about;

    // Admin-only approved field update
    if (approved !== undefined && req.user.role === "admin") {
      doctor.approved = approved;
    }

    const updatedDoctor = await doctor.save();

    // Update main User details
    const user = await User.findById(doctor.userId);
    if (user) {
      user.name = name || user.name;
      user.phone = phone !== undefined ? phone : user.phone;
      user.gender = gender !== undefined ? gender : user.gender;
      user.age = age !== undefined ? age : user.age;
      await user.save();
    }

    res.json({
      message: "Doctor updated successfully",
      profile: updatedDoctor,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        age: user.age,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Update Doctor Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete doctor (by Admin)
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
const deleteDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    let doctor = await Doctor.findById(id);
    if (!doctor) {
      doctor = await Doctor.findOne({ userId: id });
    }

    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    // Delete user and doctor documents
    await User.findByIdAndDelete(doctor.userId);
    await Doctor.findByIdAndDelete(doctor._id);

    res.json({ message: "Doctor account deleted successfully" });
  } catch (error) {
    console.error("Delete Doctor Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
