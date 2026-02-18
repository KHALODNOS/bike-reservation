const Booking = require("../models/Booking");

const Velo = require("../models/Velo");

exports.createBookings = async (req, res) => {
  try {
    const { bikeId, startDate, endDate } = req.body;

    const userId = req.user.id;

    const bike = await Velo.findById(bikeId);

    if (!bike) return res.status(404).json({ error: "Bike not found" });

    if (!bike.available)
      return res.status(400).json({ error: "Bike not available" });

    const booking = await Booking.create({
      user: userId,
      bike: bikeId,
      startDate,
      endDate,
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// user Bokinig

exports.mybooking = async (req, res) => {
  try {
    const booking = await Booking.find({ user: req.user.id }).populate("bike");

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    booking.status = "cancelled";
    await booking.save();

    await Velo.findByIdAndUpdate(booking.bike, { available: true });

    res.json({ success: true, message: "Booking cancelled" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "nom email")
      .populate("bike")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    booking.status = status;
    await booking.save();

    // If cancelled, make the bike available again
    if (status === "cancelled") {
      await Velo.findByIdAndUpdate(booking.bike, { available: true });
    }
    // If confirmed, make sure bike is marked unavailable
    else if (status === "confirmed") {
      await Velo.findByIdAndUpdate(booking.bike, { available: false });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
