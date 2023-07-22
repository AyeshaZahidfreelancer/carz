const { Cars } = require("../models/cars");
const { Categories } = require("../models/categories");

const association = () => {
  //Cars & Category Association
  Categories.hasMany(Cars, {
    as: "category_has_car",
    foreignKey: "category_id",
  });
  Cars.belongsTo(Categories, {
    as: "car_category",
    foreignKey: "category_id",
  });
};

module.exports = {
  association,
};
