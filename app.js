const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

const restaurants = require("./restaurant.json").results;
const app = express();

const port = 3000;

mongoose.connect("mongodb://localhost/restaurants");
const db = mongoose.connection;

db.on("error", (error) => {
  console.log(error);
});
db.once("open", () => {
  console.log("operate mongodb successfully");
});

app.use(express.static("public"));

app.engine("hbs", exphbs({ defaultLayout: "main", extname: "hbs" }));
app.set("view engine", "hbs");

app.get("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  const restaurant = restaurants.find((item) => item.id === +id);
  res.render("show", { pageTitle: restaurant.name, restaurant: restaurant });
});

app.get("/search", (req, res) => {
  const keyword = req.query.keyword;

  const filterList = restaurants.filter(
    (restaurant) =>
      restaurant.name.includes(keyword) ||
      restaurant.name_en.toLowerCase().includes(keyword.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(keyword.toLowerCase())
  );

  res.render("index", {
    pageTitle: "index",
    isIndex: true,
    restaurants: filterList,
  });
});

app.get("/", (req, res) => {
  res.render("index", {
    pageTitle: "index",
    isIndex: true,
    restaurants: restaurants,
  });
});

app.listen(port, () => {
  console.log(`operate http://localhost:${port} successfully`);
});
