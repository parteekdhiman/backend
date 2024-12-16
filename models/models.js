const mongoose = require("mongoose");

// Schema
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  last: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("mern-database", schema);
