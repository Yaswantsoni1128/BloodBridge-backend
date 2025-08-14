import InventorySettings from "../models/inventorySettings.model.js";

const inventorySettingsController = {
  // Create or update settings for logged-in hospital
  setSettings: async (req, res) => {
    try {
      const { minUnits, maxUnits } = req.body;

      if (minUnits >= maxUnits) {
        return res.status(400).json({ message: "minUnits must be less than maxUnits" });
      }

      const settings = await InventorySettings.findOneAndUpdate(
        { hospitalId: req.user._id },
        { minUnits, maxUnits },
        { new: true, upsert: true } 
      );

      res.status(200).json(settings);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Get settings for logged-in hospital
  getSettings: async (req, res) => {
    try {
      const settings = await InventorySettings.findOne({ hospitalId: req.user._id });

      if (!settings) {
        return res.status(404).json({ message: "Settings not found" });
      }

      res.status(200).json(settings);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default inventorySettingsController;
