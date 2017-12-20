//bring in mongoose to create a schema for the ideas db
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create the schema
const IdeaSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model("ideas", IdeaSchema);