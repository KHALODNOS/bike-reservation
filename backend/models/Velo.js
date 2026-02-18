const mongoose = require("mongoose");
const VeloSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  nom: {
    type: String,
    required: true,
  },
  taille: {
    type: String,
    required: true,
    enum: ["Grand", "Moyenne", "petit"],
    default: "Moyenne",
  },
  type: {
    type: String,
    required: true,
    enum: ["City", "Electric", "Vtt"],
    default: "City",
  },
  prix: {
    type: Number,
  },
  images: {
    type: [String],


    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Velo", VeloSchema);
