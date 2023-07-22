const express = require("express");

const { saveSeeder } = require("../controllers/seederController");

const route = express.Router();

route.get("/", saveSeeder);

module.exports = route;
