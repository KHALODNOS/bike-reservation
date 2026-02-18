const express = require("express");
const router = express.Router();
const {
  createBookings,
  mybooking,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
} = require("../controllers/BookingController");

const { authenticateToken, authorizeRole } = require("../middleware/auth");

router.route("/book").post(authenticateToken, createBookings);
router.route("/myBooking").get(authenticateToken, mybooking);
router.route("/:id").delete(authenticateToken, cancelBooking);

// Admin routes
router.route("/all").get(authenticateToken, authorizeRole("admin"), getAllBookings);
router.route("/:id/status").put(authenticateToken, authorizeRole("admin"), updateBookingStatus);

module.exports = router;
