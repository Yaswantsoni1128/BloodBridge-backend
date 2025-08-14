import mongoose from "mongoose";
import Inventory from "../models/inventory.model.js";

const inventoryController = {
  // Create inventory record
  createInventory: async (req, res) => {
    try {
      const { bloodType, unitsAvailable } = req.body;

      const inventory = await Inventory.create({
        bloodType,
        unitsAvailable,
        hospitalId: req.user._id, 
      });

      res.status(201).json(inventory);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Get all inventory records
  getAllInventory: async (req, res) => {
    try {
      const inventory = await Inventory.find().populate(
        "hospitalId",
        "name address"
      );
      res.json(inventory);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get inventory for a hospital grouped by blood type
  getHospitalInventory: async (req, res) => {
    try {
      const { hospitalId } = req.params;

      const inventory = await Inventory.aggregate([
        { $match: { hospitalId: new mongoose.Types.ObjectId(hospitalId) } },
        {
          $group: {
            _id: "$bloodType",
            unitsAvailable: { $sum: "$unitsAvailable" },
          },
        },
        { $project: { bloodType: "$_id", unitsAvailable: 1, _id: 0 } },
      ]);

      res.json({ hospitalId, inventory });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Update inventory record
  updateInventory: async (req, res) => {
    try {
      const updated = await Inventory.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Delete inventory record
  deleteInventory: async (req, res) => {
    try {
      await Inventory.findByIdAndDelete(req.params.id);
      res.json({ message: "Inventory deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export default inventoryController;
