const { ObjectId } = require("mongodb");
const { dbConnection } = require("../config/db");

const connectToUserCollection = async () => {
  const db = await dbConnection();
  return db.collection("users");
};

const findAllUser = async () => {
  const db = await dbConnection();
  const userCollection = db.collection("users");
  const allUsers = userCollection.find({}).toArray();
  return allUsers;
};

const upgradeUser = async (userId) => {
  try {
    const userCollection = await connectToUserCollection();
    const isAvailableUser = await userCollection.findOne({
      _id: new ObjectId(userId),
      role: { $ne: "ADMIN" },
    });
    if (isAvailableUser) {
      await userCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { role: "ADMIN" } }
      );
      return { message: "user is upgrated successfully" };
    } else {
    return  { message: "user is not available" } ;
    }
  } catch (e) {
    return e;
  }
};

module.exports = {
  findAllUser,
  upgradeUser,
};
