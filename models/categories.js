const Joi = require("joi");
const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

//category model
const Categories = sequelize.define(
  "categories",
  {
    id: {
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      required: true,
      unique: "category_name_unique",
    },
  },
  {
    sequelize,
    tableName: "categories",
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "id" }],
      },
      {
        name: "category_name_unique",
        using: "BTREE",
        unique: true,
        fields: [{ name: "name" }],
      },
    ],
  }
);

//joi validation
function validateCategory(category) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
  });
  return schema.validate(category);
}

//id generation
Categories.beforeCreate((category) => (category.id = Sequelize.UUIDV4));

exports.Categories = Categories;
exports.validateCategory = validateCategory;
