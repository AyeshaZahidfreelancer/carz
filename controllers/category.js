const { literal } = require("sequelize");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");

const { Cars } = require("../models/cars");
const { Categories, validateCategory } = require("../models/categories");

// @desc Create new category
// @route POST /api/category
// @access Private
const createCategory = asyncHandler(async (req, res) => {
  const category = req.body;

  //validate category
  if (category) {
    const { error } = validateCategory(category);
    if (error) return res.status(400).send(error.details[0].message);
  }

  try {
    // check if category exist or not
    const categoryExists = await Categories.findOne({
      where: {
        name: category.name,
      },
    });
    if (categoryExists) {
      res.status(400);
      throw new Error("Category already exists with same name");
    }

    //create category
    const result = await Categories.create(category);
    if (!result) {
      res.status(400);
      throw new Error("Category could not be created.");
    }

    return res.status(200).send("Category created successfully!");
  } catch (error) {
    //error handling
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong in category creation: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Updat category
// @route PUT /api/category/:id
// @access Private
const updateCategory = asyncHandler(async (req, res) => {
  //validate param data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const category = req.body;

  //validate category
  if (category) {
    const { error } = validateCategory(category);
    if (error) return res.status(400).send(error.details[0].message);
  }

  category.updated_by = req.result.id;

  try {
    //check if category exist
    const categoryExists = await Categories.findByPk(req.params.id);
    if (!categoryExists) {
      res.status(400);
      throw new Error("The category ID you entered does not exist");
    }

    //update category
    const result = await Categories.update(category, {
      where: {
        id: categoryExists.id,
      },
    });
    if (!result || result[0] === 0) {
      res.status(400);
      throw new Error("Something went wrong! Category could not be updated.");
    }

    return res.status(200).send("Category updated successfully!");
  } catch (error) {
    //error handling
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong in category updation: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Delete category
// @route DELETE /api/category/:id
// @access Private
const deleteCategory = asyncHandler(async (req, res) => {
  //validate param data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //check if category exist
    const category = await Categories.findByPk(req.params.id);

    if (!category) {
      res.status(400);
      throw new Error("The category ID you entered does not exist");
    }

    //delete category
    const result = await Categories.destroy({
      where: {
        id: category.id,
      },
    });
    if (!result) {
      res.status(400);
      throw new Error("Something went wrong! Category could not be deleted.");
    }

    return res.status(200).send("Category deleted successfully!");
  } catch (error) {
    //error handling
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong in category deletion: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Get all categories
// @route GET /api/category/
const getCategories = asyncHandler(async (req, res) => {
  try {
    //get all categories
    const categories = await Categories.findAll({
      attributes: ["id", "name"],
    });

    return res.status(200).send(categories);
  } catch (error) {
    //error handling
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong in category deletion: "
          : ""
      }${error.message}`
    );
  }
});

// @desc Get total cars for all categories
// @route GET /api/category/
const getTotalCars = asyncHandler(async (req, res) => {
  try {
    //get all categories name and total cars
    const categories = await Categories.findAll({
      include: {
        model: Cars,
        as: "category_has_car",
        attributes: [],
      },
      attributes: [
        "name",
        [literal("COUNT(`category_has_car`.`id`)"), "totalCars"],
      ],
      group: ["`categories`.`id`", "name"],
    });

    return res.status(200).send(categories);
  } catch (error) {
    //error handling
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong in getting total cars: "
          : ""
      }${error.message}`
    );
  }
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getTotalCars,
};
