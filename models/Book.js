const { dbConnection } = require("../config/db");
const { ObjectId } = require("mongodb");

const findAllBook = async () => {
  const db = await dbConnection();
  const bookCollection = db.collection("books");
  const allBook = bookCollection.find({}).toArray();
  return allBook;
};

const removeBook = async (bookId) => {
  const db = await dbConnection();
  const bookCollection = db.collection("books");
  const result = await bookCollection.deleteOne({ _id: new ObjectId(bookId) });
  if (result.deletedCount) {
    return { massage: "Book Is Removed Successfully" };
  } else {
    return { massage: "Can not Found This Book" };
  }
};

module.exports = {
  findAllBook,
  removeBook,
};
