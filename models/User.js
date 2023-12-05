const { ObjectId } = require("mongodb");
const { dbConnection } = require("../config/db");

const connectToUserCollection = async () => {
  const db = await dbConnection();
  return db.collection("users");
};

const isAvailableUser = async (email, username) => {
  const userCollection = await connectToUserCollection();
  return await userCollection.findOne({
    $or: [{ email: { $eq: email } }, { username: { $eq: username } }],
  });
};

const createNewUser = async (userInfo) => {
  try {
    const userCollection = await connectToUserCollection();
    await userCollection.insertOne({
      ...userInfo,
      fine: 0,
      role: "USER",
      createdAt : new Date()
    });
    return { message: "user Registered successfully" };
  } catch (e) {
    return e;
  }
};

const findAllUser = async () => {
  const userCollection = await connectToUserCollection();
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
      return { message: "user is not available" };
    }
  } catch (e) {
    return e;
  }
};

module.exports = {
  findAllUser,
  upgradeUser,
  isAvailableUser,
  createNewUser
};
