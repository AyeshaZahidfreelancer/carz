const asyncHandler = require("express-async-handler");

const { Categories } = require("../models/categories");
const { Cars, validateCars } = require("../models/cars");
const { validationResult } = require("express-validator");

// @desc Create new cars
// @route POST /api/cars
// @access Private
const createCar = asyncHandler(async (req, res) => {
  const car = req.body;

  //validate car
  if (car) {
    const { error } = validateCars(car);
    if (error) return res.status(400).send(error.details[0].message);
  }

  try {
    // check if car's category exist or not
    const category = await Categories.findByPk(car.category_id);
    if (!category) {
      res.status(400);
      throw new Error("Category Id does not exist");
    }

    //create category
    const result = await Cars.create(car);
    if (!result) {
      res.status(400);
      throw new Error("Car could not be created.");
    }

    return res.status(200).send("Car created successfully!");
  } catch (error) {
    //Error Handling
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400 ? "Something went wrong in car creation: " : ""
      }${error.message}`
    );
  }
});

// @desc Update cars
// @route PUT /api/cars/:id
// @access Private
const updateCar = asyncHandler(async (req, res) => {
  //validate param data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const car = req.body;

  //validate car
  if (car) {
    const { error } = validateCars(car);
    if (error) return res.status(400).send(error.details[0].message);
  }

  car.updated_by = req.result.id;

  try {
    //check if car exist
    const carExist = await Cars.findByPk(req.params.id);
    if (!carExist) {
      res.status(400);
      throw new Error("The category ID you entered does not exist");
    }

    //check if category exist
    const category = await Categories.findByPk(car.category_id);
    if (!category) {
      res.status(400);
      throw new Error("Category Id does not exist");
    }

    //update car
    const result = await Cars.update(car, {
      where: {
        id: carExist.id,
      },
    });
    if (!result || result[0] === 0) {
      res.status(400);
      throw new Error("Something went wrong! Car could not be updated.");
    }

    return res.status(200).send("Car updated successfully!");
  } catch (error) {
    //error Handling
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400 ? "Something went wrong in car updation: " : ""
      }${error.message}`
    );
  }
});

// @desc Delete cars
// @route DELETE /api/cars/:id
// @access Private
const deleteCar = asyncHandler(async (req, res) => {
  //validate param data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //check if car exist
    const car = await Cars.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!car) {
      res.status(400);
      throw new Error("The category ID you entered does not exist");
    }

    //delete category
    const result = await Cars.destroy({
      where: {
        id: car.id,
      },
    });
    if (!result) {
      res.status(400);
      throw new Error("Something went wrong! Cars could not be deleted.");
    }

    return res.status(200).send("Cars deleted successfully!");
  } catch (error) {
    //error handling
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400 ? "Something went wrong in car deletion: " : ""
      }${error.message}`
    );
  }
});

// @desc Get all cars
// @route GET /api/cars/
const getCars = asyncHandler(async (req, res) => {
  try {
    //get all categories
    const cars = await Cars.findAll({
      include: {
        model: Categories,
        as: "car_category",
        attributes: ["id", "name"],
      },
    });

    return res.status(200).send(cars);
  } catch (error) {
    //error handling
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400 ? "Something went wrong in getting cars: " : ""
      }${error.message}`
    );
  }
});

module.exports = {
  createCar,
  updateCar,
  deleteCar,
  getCars,
};
