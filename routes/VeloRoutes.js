const express = require("express");
const router = express.Router();
const bikeController = require("../controllers/VeloController");
const { authenticateToken, authorizeRole } = require("../middleware/auth");

const adminOnly = [authenticateToken, authorizeRole("admin")];

router.get("/home", adminOnly, bikeController.getAllBikes);
router.get("/detailBike", adminOnly, bikeController.getBikeById);
router.post("/addBike", adminOnly, bikeController.addNewBike);
router.delete("/deleteBike/:id", adminOnly, bikeController.deleteBike);
router.put("/updateBike/:id", adminOnly, bikeController.updateBike);

module.exports = router;
