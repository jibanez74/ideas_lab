//node modules
const express = require("express");
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
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

// Express session midleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//connect flash middleware
app.use(flash());

//middleware for global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.errors = req.flash("errors");
  next();
});

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

//section containing req methods
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
    req.flash("error_msg", "Please fill in the form correctly");
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
      req.flash("success_msg", "New idea added to the data base");
      res.redirect("/ideas");
    });
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
      req.flash("success_msg", "Idea updated");
      res.redirect("/ideas");
    });
  });
});

//delete idea from db
app.delete("/ideas/:id", (req, res) => {
  Idea.remove({
    _id: req.params.id
  }).then(() => {
    req.flash("success_msg", "Idea was removed from the data base");
    res.redirect("/ideas");
  });
});

//setup server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is now listening on port ${port}`);
});