import Donor from "../models/donations.model.js";

const donorController = {
  // CREATE Donor
  addDonor: async (req, res) => {
    try {
      const { name, email, phone, amount, bloodType, requestId } = req.body;

      const hospitalId = req.user._id;

      const donor = await Donor.create({
        name,
        email,
        phone,
        hospitalId,
        amount,
        bloodType,
        requestId: requestId || null,
      });

      res.status(201).json({
        success: true,
        message: "Donor added successfully",
        data: donor,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  // UPDATE Donor
  updateDonor: async (req, res) => {
    try {
      const updatedDonor = await Donor.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true}
      );
      if (!updatedDonor) {
        return res.status(404).json({ message: "Donor not found" });
      }
      res.status(200).json(updatedDonor);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // DELETE Donor
  deleteDonor: async (req, res) => {
    try {
      const deletedDonor = await Donor.findByIdAndDelete(req.params.id);
      if (!deletedDonor) {
        return res.status(404).json({ message: "Donor not found" });
      }
      res.status(200).json({ message: "Donor deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // GET Single Donor
  getDonorById: async (req, res) => {
    try {
      const donor = await Donor.findById(req.params.id)
        .populate("hospitalId")
        .populate("requestId");

      if (!donor) {
        return res.status(404).json({ message: "Donor not found" });
      }
      res.json(donor);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // GET All Donors
  getAllDonors: async (req, res) => {
    try {
      const donors = await Donor.find()
        .populate("hospitalId", "name")
        .populate("requestId", "bloodType");
      res.status(200).json(donors);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // GET Recent 6 Donors for the logged-in hospital
  getRecentDonors: async (req, res) => {
    try {
      const hospitalId = req.user._id;

      const donors = await Donor.find({ hospitalId })
        .sort({ createdAt: -1 })
        .limit(6)
        .populate("hospitalId", "name")
        .populate("requestId", "bloodType");

      res.status(200).json({
        success: true,
        count: donors.length,
        donors,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default donorController;
