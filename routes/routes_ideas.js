//node modules
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

//bring in schema
require("../models/Idea");
const Idea = mongoose.model("ideas");

//ideas route
router.get("/", (req, res) => {
  Idea.find({}).sort({date: "desc"}).then((ideas) => {
    res.render("ideas/index", {
      ideas: ideas
    });
  });
});

//add idea route
router.get("/add", (req, res) => {
  res.render("ideas/add");
});

//edit ideas route
router.get("/edit/:id", (req, res) => {
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
router.post("/", (req, res) => {
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
router.put("/:id", (req, res) => {
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
router.delete("/:id", (req, res) => {
  Idea.remove({
    _id: req.params.id
  }).then(() => {
    req.flash("success_msg", "Idea was removed from the data base");
    res.redirect("/ideas");
  });
});

module.exports = router;