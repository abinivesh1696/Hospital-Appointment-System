const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");

const seedData = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://hospitalAdmin:Hospital12345@cluster0.cfrfjqx.mongodb.net/hospitalDB?retryWrites=true&w=majority&appName=Cluster0";
    
    console.log("Connecting to MongoDB for seeding...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    // Delete existing documents
    console.log("Cleaning collections...");
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await Appointment.deleteMany({});

    console.log("Seeding Admin...");
    const adminUser = await User.create({
      name: "System Admin",
      email: "admin@hospital.com",
      password: "Admin123!", // Will be hashed by userSchema pre-save hook
      phone: "+1 555-0199",
      gender: "Male",
      age: 45,
      role: "admin",
      profileImage: ""
    });

    console.log("Seeding Doctors...");
    // Doctor 1: Approved Cardiologist
    const docUser1 = await User.create({
      name: "Dr. Olivia Vance",
      email: "olivia.vance@hospital.com",
      password: "Doctor123!",
      phone: "+1 555-0101",
      gender: "Female",
      age: 38,
      role: "doctor",
      profileImage: ""
    });
    const docProfile1 = await Doctor.create({
      userId: docUser1._id,
      specialization: "Cardiology",
      qualification: "MD, FACC - Harvard Medical School",
      experience: 12,
      consultationFee: 150,
      hospital: "St. Jude Heart Center",
      availableDays: ["Monday", "Wednesday", "Friday"],
      availableTime: "09:00 AM - 01:00 PM",
      about: "Dr. Olivia Vance is a double board-certified cardiologist specializing in interventional cardiology and preventative heart care.",
      approved: true
    });

    // Doctor 2: Approved General Physician
    const docUser2 = await User.create({
      name: "Dr. Marcus Brody",
      email: "marcus.brody@hospital.com",
      password: "Doctor123!",
      phone: "+1 555-0102",
      gender: "Male",
      age: 44,
      role: "doctor",
      profileImage: ""
    });
    const docProfile2 = await Doctor.create({
      userId: docUser2._id,
      specialization: "General Physician",
      qualification: "MBBS, MD - Johns Hopkins",
      experience: 15,
      consultationFee: 75,
      hospital: "City Central Hospital",
      availableDays: ["Tuesday", "Thursday", "Friday"],
      availableTime: "10:00 AM - 04:00 PM",
      about: "Dr. Marcus Brody has over 15 years of experience in family medicine, focusing on geriatric health and routine diagnoses.",
      approved: true
    });

    // Doctor 3: Pending Approval Neurologist
    const docUser3 = await User.create({
      name: "Dr. Sarah Jenkins",
      email: "sarah.jenkins@hospital.com",
      password: "Doctor123!",
      phone: "+1 555-0103",
      gender: "Female",
      age: 32,
      role: "doctor",
      profileImage: ""
    });
    const docProfile3 = await Doctor.create({
      userId: docUser3._id,
      specialization: "Neurology",
      qualification: "MD - Stanford University",
      experience: 6,
      consultationFee: 200,
      hospital: "Neurological Science Institute",
      availableDays: ["Monday", "Tuesday"],
      availableTime: "02:00 PM - 06:00 PM",
      about: "Dr. Sarah Jenkins is passionate about treating complex neurological diseases and conducting research in clinical neurophysiology.",
      approved: false
    });

    console.log("Seeding Patient...");
    const patientUser = await User.create({
      name: "John Doe",
      email: "patient@hospital.com",
      password: "Patient123!",
      phone: "+1 555-0150",
      gender: "Male",
      age: 29,
      role: "patient",
      profileImage: ""
    });
    const patientProfile = await Patient.create({
      userId: patientUser._id,
      bloodGroup: "O+",
      allergies: "Penicillin, Peanuts",
      address: "123 Maple Street, New York, NY",
      emergencyContact: "Jane Doe (+1 555-0151)"
    });

    console.log("Seeding Appointments...");
    // 1. A completed appointment
    await Appointment.create({
      patient: patientUser._id,
      doctor: docUser1._id,
      appointmentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      appointmentTime: "10:00 AM",
      status: "Completed",
      symptoms: "Mild chest tightness when running",
      prescription: "Lisinopril 10mg once daily. Avoid strenuous workouts for 1 week.",
      notes: "Patient is recovering well. Blood pressure is slightly high but stabilized."
    });

    // 2. An accepted upcoming appointment
    await Appointment.create({
      patient: patientUser._id,
      doctor: docUser2._id,
      appointmentDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
      appointmentTime: "11:30 AM",
      status: "Accepted",
      symptoms: "Recurring seasonal allergies and sneezing fits",
      prescription: "",
      notes: ""
    });

    // 3. A pending appointment
    await Appointment.create({
      patient: patientUser._id,
      doctor: docUser1._id,
      appointmentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      appointmentTime: "11:00 AM",
      status: "Pending",
      symptoms: "Follow-up consultation regarding prior ECG reading",
      prescription: "",
      notes: ""
    });

    console.log("🎉 Database Seeded Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
