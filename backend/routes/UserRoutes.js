const express = require("express");
const {
  inscription,
  Login,
  addFavorite,
  removeFavorite,
  getFavorites,
  getAllUsers,
  deleteUser,
} = require("../controllers/UserController");

const { authenticateToken, authorizeRole } = require("../middleware/auth");
const validateRegister = require("../middleware/validationSchema");

const router = express.Router();

router.route("/auth/register").post(validateRegister, inscription);
router.route("/auth/login").post(Login);
// router.route("/profile").get(authenticateToken, profile);

// favorites
router.route("/favorite/add").post(authenticateToken, addFavorite);
router.route("/favorite/remove").post(authenticateToken, removeFavorite);
router.route("/favorite/all").get(authenticateToken, getFavorites);

// Admin: User management
router.route("/users").get(authenticateToken, authorizeRole("admin"), getAllUsers);
router.route("/users/:id").delete(authenticateToken, authorizeRole("admin"), deleteUser);

module.exports = router;
