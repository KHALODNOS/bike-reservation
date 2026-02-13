const express = require("express");
const router = express.Router();
const bikeController = require("../controllers/VeloController");

router.get("/home", bikeController.getAllBikes);
router.get("/detailBike", bikeController.getBikeById);
router.post("/addBike", bikeController.addNewBike);
router.delete("/deleteBike/:id", bikeController.deleteBike);
router.put("/updateBike/:id", bikeController.updateBike);

module.exports = router;
