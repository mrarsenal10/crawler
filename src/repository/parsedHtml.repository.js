const ParsedHtmlModel = require("../model/parsedHtml.model");
require("../database");

class ParsedHtmlRepository {
  async save({ title, articles }) {
    try {
      await ParsedHtmlModel.collection.insertOne({ title, articles });
      console.log("Parsed HTML saved successfully");
    } catch (error) {
      console.error("Failed to save parsed HTML:", error);
    }
  }
}

module.exports = ParsedHtmlRepository;
