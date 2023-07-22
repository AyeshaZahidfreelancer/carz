const { Cars } = require("../models/cars");
const { Users } = require("../models/users");
const { Categories } = require("../models/categories");

const syncDatabase = async () => {
  //syncing the database
  await Users.sync({ alter: true });
  await Categories.sync({ alter: true });
  await Cars.sync({ alter: true });
};

module.exports = {
  syncDatabase,
};
