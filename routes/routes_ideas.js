//node modules
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const {
  ensureAuthenticated
} = require("../helpers/auth");

//bring in schema
require("../models/Idea");
const Idea = mongoose.model("ideas");

//ideas route
router.get("/", ensureAuthenticated, (req, res) => {
  Idea.find({
    user: req.user.id
  }).sort({
    date: "desc"
  }).then((ideas) => {
    res.render("ideas/index", {
      ideas: ideas
    });
  });
});

//add idea route
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("ideas/add");
});

//edit ideas route
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then((idea) => {
    if (idea.user != req.user.id) {
      req.flash("error_msg", "YOU ARE NOT AUTHORIZED");
      res.redirect("/ideas");
    } else {
      res.render("ideas/edit", {
        idea: idea
      });
    }
  });
});

//section containing req methods
//process form with post to add a new idea to the db
router.post("/", ensureAuthenticated, (req, res) => {
  //simple form validation
  let errors = [];

  if (!req.body.title) {
    errors.push({
      text: "Please write a title"
    });
  }

  if (!req.body.description) {
    errors.push({
      text: "Please write a description"
    });
  }

  if (errors.length > 0) {
    req.flash("error_msg", "Please fill in the form correctly");
    res.render("ideas/add", {
      errors: errors,
      title: req.body.title,
      description: req.body.description
    });
  } else {
    const newUser = {
      title: req.body.title,
      description: req.body.description,
      user: req.user.id
    }
    new Idea(newUser).save().then(() => {
      req.flash("success_msg", "New idea added to the data base");
      res.redirect("/ideas");
    });
  }
});

//update ideas with put request
router.put("/:id", ensureAuthenticated, (req, res) => {
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
router.delete("/:id", ensureAuthenticated, (req, res) => {
  Idea.remove({
    _id: req.params.id
  }).then(() => {
    req.flash("success_msg", "Idea was removed from the data base");
    res.redirect("/ideas");
  });
});

module.exports = router;