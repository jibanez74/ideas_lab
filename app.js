//node modules
const express = require("express");
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

const app = express();

//mongoose section with schema
//connect to mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/ideasLabDev", {
  useMongoClient: true
}).then(() => {
  console.log("Mongoose is now connected");
}).catch((err) => {
  console.log(err);
});

//bring in schema
require("./models/Idea");
const Idea = mongoose.model("ideas");

//middleware section
// Handlebars Middleware
app.engine('handlebars', hbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

//method-override middleware
app.use(methodOverride("_method"));

//app routes
//index route
app.get("/", (req, res) => {
  const index_title = "Welcome";
  res.render("index", {
    title: index_title
  });
});

//about route
app.get("/about", (req, res) => {
  const about_title = "About";
  res.render("about", {
    title: about_title
  });
});

app.get("/ideas", (req, res) => {
  Idea.find({}).sort({date: "desc"}).then((ideas) => {
    res.render("ideas/index", {
      ideas: ideas
    });
  });
});

//add idea route
app.get("/ideas/add", (req, res) => {
  res.render("ideas/add");
});

//edit ideas route
app.get("/ideas/edit/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then((idea) => {
    res.render("ideas/edit", {
      idea: idea
    });
  });
});

//processing form section with the different methods
//process form with post to add a new idea to the db
app.post("/ideas", (req, res) => {
  //simple form validation
  let errors_msg = [];

  if (!req.body.title) {
    errors_msg.push({
      text: "Please write a title"
    });
  }

  if (!req.body.description) {
    errors_msg.push({
      text: "Please write a description"
    });
  }

  if (errors_msg.length > 0) {
    res.render("ideas/add", {
      errors: errors_msg,
      title: req.body.title,
      description: req.body.description
    });
  } else {
    const newUser = {
      title: req.body.title,
      description: req.body.description
    }
    new Idea(newUser).save().then(() => {
      res.redirect("/ideas");
    })
  }
});

//update ideas with put request
app.put("/ideas/:id", (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then((idea) => {
    //update values
    idea.title = req.body.title;
    idea.description = req.body.description;

    //save the new values
    idea.save().then((idea) => {
      res.redirect("/ideas");
    });
  });
});

//setup server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is now listening on port ${port}`);
});