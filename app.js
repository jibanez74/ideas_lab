//modules
const express = require("express");
const express_hb = require("express-handlebars");
const mongoose = require("mongoose");

const app = express();

//connect to mongoose
//remove warnings and use global promise
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost/ideasLabDB", {
  useMongoClient: true
}).then(() => {
  console.log ("Mongoose is connected!");
}).catch((err) => {
  console.log(err);
});

//setup schema
require("./models/Ideas");
const Idea = mongoose.model("ideas");

//setup for middleware
//middleware for handlebars
app.engine("handlebars", express_hb({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

//routes
//index route
app.get("/", (req, res) => {
  const title_index = "Welcome";
  res.render("index", {
    title: title_index
  });
});

//about route
app.get("/about", (req, res) => {
  const title_about = "About";
  res.render("about", {
    title: title_about
  });
});

//set server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is now listening on port ${port}`);
});