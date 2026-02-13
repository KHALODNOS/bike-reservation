const express = require("express");
const router = express.Router();
const bikeController = require("../controllers/VeloController");

router.get("/", bikeController.getAllBikes);
router.get("/", bikeController.getBikeById);
router.post("/", bikeController.addNewBike);
router.delete("/:id", bikeController.deleteBike);
router.put("/:id", bikeController.updateBike);
