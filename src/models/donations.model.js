import mongoose from "mongoose"

const DonationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  bloodType: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BloodRequest",
    required: true
  }
}, {
  timestamps: true
});

const Donation = mongoose.model("Donation", DonationSchema);

export default Donation;
