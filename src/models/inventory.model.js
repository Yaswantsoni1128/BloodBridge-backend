import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  bloodType: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true
  },
  unitsAvailable: {
    type: Number,
    required: true
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Inventory = mongoose.model("Inventory", InventorySchema);

export default Inventory;
