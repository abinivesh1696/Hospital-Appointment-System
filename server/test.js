const mongoose = require("mongoose");

const uri =
  "mongodb+srv://hospitalAdmin:hospital321@cluster0.cfrfjqx.mongodb.net/hospitalDB?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ Connected");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error:");
    console.error(err);
    process.exit(1);
  });