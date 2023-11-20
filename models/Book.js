const fs = require("fs");
const path = require("node:path");

const findAllBook = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("./db.json", (err, db) => {
      if (err) reject(err);
      resolve(JSON.parse(db).books);
    });
  });
};

const removeBook = (bookId) => {
  return new Promise((resolve, reject) => {
    console.log(path.join(__dirname, "db.json"))
    fs.readFile( "db.json", (err, db) => {
      if (err) reject(err);
      const parsedDb = JSON.parse(db);
      console.log(parsedDb)
      const updatedBookList = parsedDb.books.filter((book) => book.id !== +bookId);
     console.log(updatedBookList)
      if (updatedBookList.length !== parsedDb.books.length) {
        fs.writeFile(
          path.join(__dirname, "db.json"),
          JSON.stringify({ ...parsedDb, books: updatedBookList }),
          (err) => {
            if (err) reject(err);
            resolve({ massage: "Book Is Removed Successfully" });
          }
        );
      } else {
        reject({ massage: "Can not Found This Book" });
      }
    });
  });
};

module.exports = {
  findAllBook,
  removeBook,
};
