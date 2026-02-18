const { body, validationResult } = require("express-validator");

const validateRegister = [
  body("nom")
    .notEmpty()
    .withMessage("le nom require")
    .isLength({ min: 2 })
    .withMessage("doit content au moins 2 caractere"),

  body("email")
    .notEmpty()
    .withMessage("L'email est oblige")
    .isEmail()
    .withMessage("Email invalide."),

  body("password")
    .notEmpty()
    .withMessage("Le mot de passe est oblige")
    .isLength({ min: 6 })
    .withMessage("au mois 6 character."),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    next();
  },
];

module.exports = validateRegister;
