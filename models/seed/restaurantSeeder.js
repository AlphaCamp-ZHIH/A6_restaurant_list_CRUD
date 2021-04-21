const mongoose = require("mongoose");
const Restaurant = require("../restaurants");
const data = require("../../restaurant.json").results;
// console.log(data);
mongoose.connect("mongodb://localhost/restaurants");
const db = mongoose.connection;

db.on("error", (error) => {
  console.log(error);
});
db.once("open", () => {
  data.forEach((item) => {
    Restaurant.create({
      ...item,
    });
  });
  console.log("create restaurants data");
});
