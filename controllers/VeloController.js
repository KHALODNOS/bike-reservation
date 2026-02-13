const Velo = require("../models/Velo");
const { isValidObjectId } = require("../tools/IdValidator");

// GET ALL BIKES
exports.getAllBikes = async (req, res) => {
  try {
    const bikes = await Velo.find();
    return res.status(200).json(bikes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ADD NEW BIKE
exports.addNewBike = async (req, res) => {
  try {
    const bike = await Velo.create(req.body);
    res.status(201).json(bike);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// FIND BIKE BY ID
exports.getBikeById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "id not found / invalide !" });
    }
    const bike = await Velo.findById(id);
    if (!bike) {
      return res.status(404).json({ error: "Bike not found" });
    }
    res.status(200).json(bike);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE BIKE
exports.updateBike = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "id not found / invalide !" });
    }

    const bike = Velo.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bike) {
      return res.status(400).json({ error: "bike not found!" });
    }
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

// DELETE BIKE
exports.deleteBike = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "id not found / invalide !" });
    }
    const bike = Velo.findByIdAndDelete(id);

    if (!livre) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(200).json({ error: "Deleted!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
