const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    settings: {
      theme: { type: String, default: "light" },
      timezone: { type: String, default: "UTC" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
