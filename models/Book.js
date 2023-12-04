const { dbConnection } = require("../config/db");
const { ObjectId } = require("mongodb");

const connectToBookCollection = async () => {
  const db = await dbConnection();
  return db.collection("books");
};

const connectToBorrowedCollection = async () => {
  const db = await dbConnection();
  return db.collection("borrowed");
};

const findAllBook = async () => {
  const bookCollection = await connectToBookCollection();
  const allBook = await bookCollection.find({}).toArray();
  return allBook;
};

const removeBook = async (bookId) => {
  if (!ObjectId.isValid(bookId)) {
    throw new Error("Invalid bookId format");
  }
  const db = await dbConnection();
  const bookCollection = db.collection("books");
  const result = await bookCollection.deleteOne({ _id: new ObjectId(bookId) });
  if (result.deletedCount) {
    return { massage: "Book Is Removed Successfully" };
  } else {
    return { massage: "Can not Found This Book" };
  }
};

const addBook = async (newBook) => {
  const bookCollection = await connectToBookCollection();
  try {
    await bookCollection.insertOne(newBook);
    return { massage: "New Book is Added Successfully" };
  } catch (e) {
    return e;
  }
};

const returnBook = async (bookId) => {
  console.log(bookId, "bookId");
  try {
    const bookCollection = await connectToBookCollection();
    const borrowedCollection = await connectToBorrowedCollection();
    await bookCollection.findOneAndUpdate(
      { _id: new ObjectId(bookId) },
      { $set: { free: 1 } }
    );
    await borrowedCollection.deleteOne({ bookId: bookId });
    return { message: "Book updated successfully" };
  } catch (e) {
    return e;
  }
};

const borrowBook = async (userId, bookId) => {
  try {
    const borrowedCollection = await connectToBorrowedCollection();
    const bookCollection = await connectToBookCollection();
    const isAvailableBook = await bookCollection.findOne({
      _id: new ObjectId(bookId),
      free: 1,
    });

    if (isAvailableBook) {
      await borrowedCollection.insertOne({
        userId,
        bookId,
      });
      await bookCollection.updateOne(
        { _id: new ObjectId(bookId) },
        { $set: { free: 0 } }
      );
      return { message: "Book successfully borrowed" };
    } else {
      return { message: "Book is not available for borrowing" };
    }
  } catch (e) {
    return e;
  }
};

module.exports = {
  findAllBook,
  removeBook,
  addBook,
  returnBook,
  borrowBook,
};
