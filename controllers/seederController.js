const asyncHandler = require("express-async-handler");

const { Categories } = require("../models/categories");

// @desc Store data in database
// @route GET /api/Seeder
// @access Public
const saveSeeder = asyncHandler(async (req, res) => {
  // categories default data
  const categoriesData = [
    { name: "Bus" },
    { name: "Sedan" },
    { name: "SUV" },
    { name: "Hatchback" },
  ];

  try {
    //create categories
    const categories = await Categories.bulkCreate(categoriesData);
    if (!categories) {
      const message = "Categories could not be created.";
      res.status(400).send(message);
      throw new Error(message);
    }

    return res.status(200).send("Successfully added");
  } catch (error) {
    //error handling
    res.status(res.statusCode ? res.statusCode : 500);
    throw new Error(
      `${
        res.statusCode !== 400
          ? "Something went wrong during seeding data: "
          : ""
      }${error.message}`
    );
  }
});

module.exports = { saveSeeder };
