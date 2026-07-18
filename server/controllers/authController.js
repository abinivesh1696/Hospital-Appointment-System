const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    gender,
    age,
    role,
    // Doctor specific fields
    specialization,
    qualification,
    experience,
    consultationFee,
    hospital,
    availableDays,
    availableTime,
    about,
    // Patient specific fields
    bloodGroup,
    allergies,
    address,
    emergencyContact,
  } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Determine role (default is patient)
    const userRole = role || "patient";

    // Create main user document
    const user = await User.create({
      name,
      email,
      password,
      phone: phone || "",
      gender: gender || "",
      age: age ? Number(age) : null,
      role: userRole,
    });

    if (user) {
      // Create role-specific profile document
      if (userRole === "patient") {
        await Patient.create({
          userId: user._id,
          bloodGroup: bloodGroup || "",
          allergies: allergies || "",
          address: address || "",
          emergencyContact: emergencyContact || "",
        });
      } else if (userRole === "doctor") {
        if (!specialization || !qualification || !experience || !consultationFee || !hospital) {
          // Rollback user creation if doctor fields are missing
          await User.findByIdAndDelete(user._id);
          return res.status(400).json({
            message: "Doctors must provide specialization, qualification, experience, consultation fee, and hospital",
          });
        }

        await Doctor.create({
          userId: user._id,
          specialization,
          qualification,
          experience: Number(experience),
          consultationFee: Number(consultationFee),
          hospital,
          availableDays: availableDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          availableTime: availableTime || "09:00 AM - 05:00 PM",
          about: about || "",
          approved: false, // Must be approved by Admin
        });
      }

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      // If doctor, check if approved
      if (user.role === "doctor") {
        const doctorProfile = await Doctor.findOne({ userId: user._id });
        if (doctorProfile && !doctorProfile.approved) {
          return res.status(403).json({
            message: "Your doctor account is pending approval by the administrator.",
          });
        }
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      let profileData = {};

      if (user.role === "patient") {
        const patient = await Patient.findOne({ userId: user._id });
        profileData = patient ? patient : {};
      } else if (user.role === "doctor") {
        const doctor = await Doctor.findOne({ userId: user._id });
        profileData = doctor ? doctor : {};
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        age: user.age,
        role: user.role,
        profileImage: user.profileImage,
        profileDetails: profileData,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Profile Fetch Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      user.gender = req.body.gender !== undefined ? req.body.gender : user.gender;
      user.age = req.body.age !== undefined ? req.body.age : user.age;

      if (req.file) {
        // If file uploaded, store path. In windows, replace backslash with forward slash for URLs.
        const filePath = req.file.path.replace(/\\/g, "/");
        // Convert to relative URL from server root
        const relativePath = filePath.split("/server/")[1] || filePath.split("server/")[1] || filePath;
        user.profileImage = "/" + relativePath;
      } else if (req.body.profileImage !== undefined) {
        user.profileImage = req.body.profileImage;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      let profileData = {};

      if (user.role === "patient") {
        const patient = await Patient.findOne({ userId: user._id });
        if (patient) {
          patient.bloodGroup = req.body.bloodGroup !== undefined ? req.body.bloodGroup : patient.bloodGroup;
          patient.allergies = req.body.allergies !== undefined ? req.body.allergies : patient.allergies;
          patient.address = req.body.address !== undefined ? req.body.address : patient.address;
          patient.emergencyContact = req.body.emergencyContact !== undefined ? req.body.emergencyContact : patient.emergencyContact;
          await patient.save();
          profileData = patient;
        }
      } else if (user.role === "doctor") {
        const doctor = await Doctor.findOne({ userId: user._id });
        if (doctor) {
          doctor.specialization = req.body.specialization || doctor.specialization;
          doctor.qualification = req.body.qualification || doctor.qualification;
          doctor.experience = req.body.experience !== undefined ? Number(req.body.experience) : doctor.experience;
          doctor.consultationFee = req.body.consultationFee !== undefined ? Number(req.body.consultationFee) : doctor.consultationFee;
          doctor.hospital = req.body.hospital || doctor.hospital;
          doctor.availableDays = req.body.availableDays !== undefined ? req.body.availableDays : doctor.availableDays;
          doctor.availableTime = req.body.availableTime || doctor.availableTime;
          doctor.about = req.body.about !== undefined ? req.body.about : doctor.about;
          await doctor.save();
          profileData = doctor;
        }
      }

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        gender: updatedUser.gender,
        age: updatedUser.age,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
        profileDetails: profileData,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Profile Update Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Temp store for forgot password reset tokens
const resetTokens = {};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    // Generate a reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit code
    resetTokens[email] = {
      code: resetCode,
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes expiry
    };

    console.log(`[PASS RESET CODE FOR ${email}]: ${resetCode}`);

    res.json({
      message: "Reset code sent to email (check console logs for the simulated email code!)",
      email, // Return email to assist client flow
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    const tokenRecord = resetTokens[email];
    if (!tokenRecord) {
      return res.status(400).json({ message: "No active password reset request found" });
    }

    if (tokenRecord.code !== code) {
      return res.status(400).json({ message: "Invalid reset code" });
    }

    if (Date.now() > tokenRecord.expires) {
      delete resetTokens[email];
      return res.status(400).json({ message: "Reset code has expired" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    delete resetTokens[email]; // clean up

    res.json({ message: "Password reset successful!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
};
