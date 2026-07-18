const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: true,
      enum: [
        "Cardiology",
        "Neurology",
        "Orthopedics",
        "Pediatrics",
        "Dermatology",
        "ENT",
        "Gynecology",
        "General Physician",
      ],
    },
    qualification: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },
    hospital: {
      type: String,
      required: true,
      trim: true,
    },
    availableDays: {
      type: [String],
      required: true,
      default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    availableTime: {
      type: String,
      required: true,
      default: "09:00 AM - 05:00 PM",
    },
    about: {
      type: String,
      default: "",
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);
