//node modules
const express = require("express");
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");

const app = express();

//load db config file
const using_db = require("./config/database");

//load external js files with routes for user and ideas
const ideas_routes = require("./routes/routes_ideas");
const users_routes = require("./routes/routes_user"); 

//mongoose section with schema
//connect to mongoose
mongoose.Promise = global.Promise;
mongoose.connect(using_db.mongoURI, {
  useMongoClient: true
}).then(() => {
  console.log("Mongoose is now connected");
}).catch((err) => {
  console.log(err);
});

//load passport local strategy function
require("./config/passport")(passport);

//bring in schema
require("./models/Idea");
const Idea = mongoose.model("ideas");

//middleware section
// Handlebars Middleware
app.engine('handlebars', hbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//static folder
app.use(express.static(path.join(__dirname, "public")));

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

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//middleware for global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
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

//ideas routes
app.use("/ideas", ideas_routes);

//users routes
app.use("/users", users_routes);

//setup server
const port = process.env.port || 5000;
app.listen(port, () => {
  console.log(`Server is now listening on port ${port}`);
});