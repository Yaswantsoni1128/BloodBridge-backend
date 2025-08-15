import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    type: {
      type: String,
      enum: ["lowInventory", "bloodRequest"],
      required: true,
    },
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ["info", "warning", "critical"],
      default: "warning",
    },
    recipients: [
      {
        recipientId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "recipientsModel",
        },
        recipientsModel: {
          type: String,
          enum: ["User", "Donor", "Hospital"],
        },
        isAcknowledged: {
          type: Boolean,
          default: false,
        },
      },
    ],
    isResolved: {
      type: Boolean,
      default: false,
    },
    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Alert = mongoose.model("Alert", AlertSchema);
export default Alert;
