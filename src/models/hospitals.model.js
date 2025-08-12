import mongoose from "mongoose";

const HospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  locationPoint: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  services: [{
    type: String,
  }],
  address: {
    type: String,
    required: true
  },
  adminUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  }
},{
  timestamps: true
});

const Hospital = mongoose.model("Hospital", HospitalSchema);

export default Hospital;
