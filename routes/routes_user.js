//node modules
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

//login route
router.get("/login", (req, res) => {
  res.send("login");
});

//user register route
router.get("/register", (req, res) => {
  res.send("register");
});

module.exports = router;