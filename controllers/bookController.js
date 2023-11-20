const url = require("node:url");
const { findAllBook, removeBook } = require("../models/Book");

const getAllBook = async (req, res) => {
  const books = await findAllBook();
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(books));
  res.end();
};

const removeBookById = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const bookId = parsedUrl.query.id;
  await removeBook(bookId)
    .then((data) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(data));
      res.end();
    })
    .catch((err) => {
      console.log(err, "err");
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(JSON.stringify(err));
      res.end();
    });
};

module.exports = {
  getAllBook,
  removeBookById,
};
