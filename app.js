//modules
const express = require("express");
const express_hb = require("express-handlebars");

const app = express();

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