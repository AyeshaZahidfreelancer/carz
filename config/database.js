const Sequelize = require("sequelize");

//include db instance
const sequelize = new Sequelize("carz", "root", "root@123", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
