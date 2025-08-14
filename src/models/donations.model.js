import mongoose from "mongoose";
import "./hospitals.model.js"
import "./bloodRequests.model.js"
const DonorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\d{10}$/, "Enter a valid 10-digit phone number"],
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodRequest",
    },
  },
  {
    timestamps: true,
  }
);

const Donor = mongoose.model("Donor", DonorSchema);

export default Donor;
