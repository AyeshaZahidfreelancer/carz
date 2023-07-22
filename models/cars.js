const Joi = require("joi");
const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

//car model
const Cars = sequelize.define(
  "cars",
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
    },
    category_id: {
      //car category
      type: Sequelize.UUID,
      allowNull: false,
      required: true,
      references: {
        model: "categories",
        key: "id",
      },
    },
    reg_no: {
      type: DataTypes.STRING(50),
      allowNull: false,
      required: true,
    },
    model: {
      type: DataTypes.STRING(50),
      allowNull: false,
      required: true,
    },
    make: {
      type: DataTypes.STRING(50),
    },
    color: {
      type: DataTypes.STRING(50),
    },
  },
  {
    sequelize,
    tableName: "cars",
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "id" }],
      },
      {
        name: "name",
        using: "BTREE",
        fields: [{ name: "name" }],
      },
    ],
  }
);

//joi validation
function validateCars(car) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    category_id: Joi.string().guid().required(),
    reg_no: Joi.string().min(3).max(50).required(),
    model: Joi.string().min(3).max(50).required(),
    make: Joi.string().min(3).max(50),
    color: Joi.string().min(3).max(50),
  });
  return schema.validate(car);
}

// id generation
Cars.beforeCreate((car) => (car.id = Sequelize.UUIDV4));

exports.Cars = Cars;
exports.validateCars = validateCars;
