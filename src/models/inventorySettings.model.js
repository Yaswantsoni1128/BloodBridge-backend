import mongoose from "mongoose";

const InventorySettingsSchema = new mongoose.Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true,
    unique: true 
  },
  minUnits: {
    type: Number,
    required: true
  },
  maxUnits: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const InventorySettings = mongoose.model("InventorySettings", InventorySettingsSchema);
export default InventorySettings;
