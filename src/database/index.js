const mongoose = require("mongoose");

class Database {
  static instance;

  constructor() {
    this.connect();
  }

  connect() {
    mongoose
      .connect("mongodb://127.0.0.1:27017/crawl_db")
      .then(() => {
        console.log("Connected Mongodb success");
      })
      .catch((err) => {
        console.log(`Error connect ${err}`);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const dbinstance = Database.getInstance();

module.exports = dbinstance;
