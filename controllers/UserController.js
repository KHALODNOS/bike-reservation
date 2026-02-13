const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const inscription = async (req, res) => {
  try {
    console.log(req.body);
    const { nom, email, password, role } = req.body;
    if (!nom || !email || !password) {
      return res.status(400).json({ error: "Nom, email et password requis" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email deja utilise" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nom,
      email,
      password: hashPassword,
      role: role || "user",
    });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "24h" },
    );

    res.status(201).json({ succes: true, token });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: error.message });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Email out mode passe incrorecct" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Email out mode passe incrorecct" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "24h" },
    );

    res.status(200).json({
      success: true,
      token,
      user: { nom: user.nom, email: user.email, role: user.role },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const profile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ user });
};

// favorite

const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.favorites);
  } catch (err) {
    console.error("GET FAVORITES ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

const addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const user = await User.findById(userId);

    if (user.favorites.includes(productId)) {
      return res.status(400).json({ message: "Already in favorites" });
    }

    user.favorites.push(productId);
    await user.save();

    res.json({ success: true, favorites: user.favorites, username: user.nom });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const user = await User.findById(userId);

    user.favorites = user.favorites.filter((id) => id.toString() !== productId);

    await user.save();

    res.json({ success: true, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  inscription,
  Login,
  profile,
  getFavorites,
  addFavorite,
  removeFavorite,
};
