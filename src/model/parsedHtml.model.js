const mongoose = require("mongoose");

// Define the schema for parsed content
const parsedHtmlSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  articles: {
    type: Array,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a Mongoose model based on the schema
const ParsedHtmlModel = mongoose.model("parsed_html", parsedHtmlSchema);

// Export the model
module.exports = ParsedHtmlModel;
