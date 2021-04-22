const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const methodOverride = require('method-override');

const Restaurants = require("./models/restaurants");
const app = express();

const port = 3000;

mongoose.connect("mongodb://localhost/restaurants", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on("error", (error) => {
  console.log(error);
});
db.once("open", () => {
  console.log("operate mongodb successfully");
});
app.use(methodOverride('_method'));
app.use(express.static("public"));

app.engine("hbs", exphbs({ defaultLayout: "main", extname: "hbs" }));
app.set("view engine", "hbs");

// 餐廳detail
app.get("/restaurants/:id", (req, res) => {
  const id = req.params.id;
  return Restaurants.findById(id)
    .lean()
    .then(restaurant =>
      res.render("show", { pageTitle: restaurant.name, restaurant: restaurant, useUnifiedTopology: true })
    )
    .catch(error => console.log(error))
});
// search 餐廳
app.get("/search", (req, res) => {
  const keyword = req.query.keyword;
  return Restaurants.find()
    .lean()
    .then(restaurants => {
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
    })

});

// 刪除餐廳
app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id;
  return Restaurants.findById(id)
    .then(restaurant => {

      return restaurant.remove()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})
//render index
app.get("/", (req, res) => {
  return Restaurants.find()
    .lean()
    .then(restaurants =>

      res.render("index", {
        pageTitle: "index",
        isIndex: true,
        restaurants: restaurants,
      })
    )
});

app.listen(port, () => {
  console.log(`operate http://localhost:${port} successfully`);
});
