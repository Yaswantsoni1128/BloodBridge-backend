import Alert from "../models/alert.model.js";
import Donor from '../models/donations.model.js';
import Hospital from "../models/hospitals.model.js";

const alertController = {
    createAlert: async (req, res) => {
        try {
            console.log(req.body);
            const { type, bloodType, message, severity } = req.body;

            // ✅ hospitalId from auth
            const hospitalId = req.user._id;

            if (!type || !bloodType || !message) {
                return res.status(400).json({
                    success: false,
                    message: "type, bloodType, and message are required",
                });
            }

            let recipients = [];

            // If it's a bloodRequest, notify donors & blood banks
            if (type === "bloodRequest") {
                const donors = await Donor.find({ hospitalId, bloodType });
                recipients = donors.map((d) => ({
                    recipientId: d._id,
                    recipientsModel: "Donor",
                }));

                // Notify all hospitals with role = BloodBank
                const bloodBanks = await Hospital.find({ role: "BloodBank" });
                recipients.push(
                    ...bloodBanks.map((b) => ({
                        recipientId: b._id,
                        recipientsModel: "Hospital",
                    }))
                );
            }

            const alert = new Alert({
                hospitalId,
                type,
                bloodType,
                message,
                severity: severity || "warning",
                recipients,
            });

            await alert.save();

            return res.status(201).json({
                success: true,
                message: "Alert created successfully",
                alert,
            });
        } catch (err) {
            console.error("Error creating alert: ", err);
            return res.status(500).json({
                success: false,
                message: "Failed to create alert",
            });
        }
    },
    updateAlert: async (req, res) => {
        try {
            const { id } = req.params; // alertId from route params
            const updates = req.body; // fields to update

            const alert = await Alert.findByIdAndUpdate(id, updates, {
                new: true,
                runValidators: true,
            });

            if (!alert) {
                return res.status(404).json({
                    success: false,
                    message: "Alert not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Alert updated successfully",
                alert,
            });
        } catch (err) {
            console.log("Error updating alert: ", err);
            return res.status(500).json({
                success: false,
                message: "Error updating alert. Please try again!",
            });
        }
    },

    getAlertById: async (req, res) => {
        try {
            const { id } = req.params;

            const alert = await Alert.findById(id)
                .populate("hospitalId", "name address contactNumber") // populate hospital details
                .populate("recipients.recipientId"); // populate recipients

            if (!alert) {
                return res.status(404).json({
                    success: false,
                    message: "Alert not found",
                });
            }

            return res.status(200).json({
                success: true,
                alert,
            });
        } catch (err) {
            console.log("Error fetching the alert by id: ", err);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch alert by id. Please try again!",
            });
        }
    },
    // ✅ Alerts of the logged-in hospital
    getAllAlertsOfHospital: async (req, res) => {
        try {
            console.log(req.user);
            const hospitalId = req.user._id; // hospital from auth middleware

            const alerts = await Alert.find({ hospitalId })
                .sort({ createdAt: -1 }) // latest first
                .populate("recipients.recipientId", "name email phone") // donor/hospital details
                .populate("hospitalId", "name address"); // hospital details

            return res.status(200).json({
                success: true,
                count: alerts.length,
                alerts,
            });
        } catch (err) {
            console.log("Error fetching hospital alerts: ", err);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch alerts of this hospital. Please try again!",
            });
        }
    },

    // ✅ All alerts across the system (for admins)
    getAllAlerts: async (req, res) => {
        try {
            const alerts = await Alert.find()
                .sort({ createdAt: -1 }) // latest first
                .populate("recipients.recipientId", "name email phone")
                .populate("hospitalId", "name address");

            return res.status(200).json({
                success: true,
                count: alerts.length,
                alerts,
            });
        } catch (err) {
            console.log("Error fetching all alerts: ", err);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch all alerts. Please try again!",
            });
        }
    },

    deleteAlert: async (req, res) => {
        try {
            const { id } = req.params;

            const alert = await Alert.findByIdAndDelete(id);

            if (!alert) {
                return res.status(404).json({
                    success: false,
                    message: "Alert not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Alert deleted successfully",
            });
        } catch (err) {
            console.log("Error deleting alert: ", err);
            return res.status(500).json({
                success: false,
                message: "Failed to delete alert. Please try again!",
            });
        }
    },
    resolveAlert: async (req, res) => {
        const id = req.params.id;
        console.log("ALERT ID: ", id);

        try {
            const alert = await Alert.findById(id);
            console.log("Alert from resolve controller: ", alert);
            if (!alert) {
                return res.status(404).json({ message: "Alert not found." });
            }
            if (alert.isResolved) {
                return res.status(400).json({ message: "Alert already resolved." });
            }

            // Update alert fields
            alert.isResolved = true;
            alert.resolvedAt = new Date();
            await alert.save();
            res.status(200).json({
                message: "Alert resolved successfully",
                alert,
            });
        } catch (error) {
            console.error("Error resolving alert:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

}

export default alertController;