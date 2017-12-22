//modules
const express = require("express");
const express_hb = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

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

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride('_method'));

//routes
//index route
app.get("/", (req, res) => {
  const title_index = "Welcome";
  res.render("index", {
    title: title_index
  });
});

//add idea form route
app.get("/ideas/add",(req, res) => {
  res.render("ideas/add");
});

//about route
app.get("/about", (req, res) => {
  const title_about = "About";
  res.render("about", {
    title: title_about
  });
});

//ideas
//ideas form
app.post("/ideas", (req, res) => {
  //all error messages will go in a array
  let errors = [];

  //check for a title string value
  if (!req.body.title) {
    errors.push({text: "Please type in a title for your idea!"});
  }

  //verify for a description string value
  if (!req.body.description) {
    errors.push({text: "Please write a description for your idea!"});
  }

  //process values from form and display errors if necessary
  if (errors.length > 0) {
    res.render("ideas/add", {
      errors: errors,
      title: req.body.title,
      description: req.body.description
    });
  } else {
    res.send("passed");  
  }
});

//set server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is now listening on port ${port}`);
});