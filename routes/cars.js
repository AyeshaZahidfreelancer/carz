const express = require("express");

const { body, param } = require("express-validator");

const {
  createCar,
  updateCar,
  deleteCar,
  getCars,
} = require("../controllers/cars");
const { protect } = require("../middleware/authMiddleware");

const route = express.Router();

route.post(
  "/",
  [
    body("name").isString().trim().escape().withMessage("Please enter a name"),
    body("category_id")
      .isString()
      .trim()
      .escape()
      .withMessage("Please enter category id"),
    body("reg_no")
      .isString()
      .trim()
      .escape()
      .withMessage("Please enter a reg_no"),
    body("model")
      .isString()
      .trim()
      .escape()
      .withMessage("Please enter a model"),
    body("make")
      .isString()
      .trim()
      .escape()
      .withMessage("Please enter a make")
      .optional(),
    body("color")
      .isString()
      .trim()
      .escape()
      .withMessage("Please enter a color")
      .optional(),
    protect,
  ],
  createCar
);
route.put(
  `/:id`,
  [
    body("name").isString().trim().escape().withMessage("Please enter a name"),
    body("category_id")
      .isString()
      .trim()
      .escape()
      .withMessage("Please enter category id"),
    body("reg_no")
      .isString()
      .trim()
      .escape()
      .withMessage("Please enter a reg_no"),
    body("model")
      .isString()
      .trim()
      .escape()
      .withMessage("Please enter a model"),
    body("make")
      .isString()
      .trim()
      .escape()
      .withMessage("Please enter a make")
      .optional(),
    body("color")
      .isString()
      .trim()
      .escape()
      .withMessage("Please enter a color")
      .optional(),
    param("id").isUUID(4).withMessage("Please enter a valid category id"),
  ],
  protect,
  updateCar
);
route.delete(
  `/:id`,
  [param("id").isUUID(4).withMessage("Please enter a valid category id")],
  protect,
  deleteCar
);
route.get(`/`, protect, getCars);

module.exports = route;
