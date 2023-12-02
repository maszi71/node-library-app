const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const url = process.env.DB_URL;
const dbConnection = new MongoClient(url);

const dbName = process.env.DB_NAME;

module.exports = {
  dbConnection: async () => {
    await dbConnection.connect();
    const db = dbConnection.db(dbName);
    return db;
  },
};
