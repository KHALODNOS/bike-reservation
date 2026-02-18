const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    age: { type: Number, required: true },
    gender: { type: String, required: true },

    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Velo",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
