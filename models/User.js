const { dbConnection } = require("../config/db");

const findAllUser = async () => {
  const db = await dbConnection();
  const userCollection = db.collection("users");
  const allUsers = userCollection.find({}).toArray();
  return allUsers;
};

module.exports = {
  findAllUser,
};
