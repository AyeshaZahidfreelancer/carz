const express = require("express");
const { body, param } = require("express-validator");

const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getTotalCars,
} = require("../controllers/category");
const { protect } = require("../middleware/authMiddleware");

const route = express.Router();

route.post(
  "/",
  [
    body("name").isString().trim().escape().withMessage("Please enter a name"),
    protect,
  ],
  createCategory
);
route.put(
  `/:id`,
  [
    body("name").isString().trim().escape().withMessage("Please enter a name"),
    param("id").isUUID(4).withMessage("Please enter a valid category id"),
  ],
  protect,
  updateCategory
);
route.delete(
  `/:id`,
  [param("id").isUUID(4).withMessage("Please enter a valid category id")],
  protect,
  deleteCategory
);
route.get(`/`, protect, getCategories);
route.get(`/total`, protect, getTotalCars);

module.exports = route;
