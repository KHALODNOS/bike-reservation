const express = require("express");
const router = express.Router();
const bikeController = require("../controllers/VeloController");
const upload = require("../config/multer");

router.get("/home", bikeController.getAllBikes);
router.get("/detailBike/:id", bikeController.getBikeById);
router.post("/addBike", upload.array("images", 5), bikeController.addNewBike);
router.delete("/deleteBike/:id", bikeController.deleteBike);
router.put("/updateBike/:id", bikeController.updateBike);

module.exports = router;
