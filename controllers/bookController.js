const url = require("node:url");
const {
  findAllBook,
  removeBook,
  addBook,
  returnBook,
  borrowBook,
} = require("../models/Book");

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

const addNewBook = async (req, res) => {
  let body = "";
  req.on("data", (data) => {
    body += data;
  });
  req.on("end", async () => {
    const newBook = {
      ...JSON.parse(body),
      free: 1,
    };
    await addBook(newBook)
      .then((data) => {
        res.writeHead(201, { "Content-Type": "application/json" });
        res.write(JSON.stringify(data));
        res.end();
      })
      .catch((err) => {
        console.log(err, "err");
        res.writeHead(404, { "Content-Type": "application/json" });
        res.write(JSON.stringify(err));
        res.end();
      });
  });
};

const returnBookById = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const bookId = parsedUrl.query.id;
  await returnBook(bookId)
    .then((data) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(data));
      res.end();
    })
    .catch((err) => {
      console.log(err);
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(JSON.stringify(err));
      res.end();
    });
};

const borrowBookByIds = async (req, res) => {
  let reqBody = "";
  req.on("data", (data) => {
    reqBody += data;
  });

  req.on("end", async () => {
    const { userId, bookId } = JSON.parse(reqBody);
    await borrowBook(userId, bookId)
      .then((data) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(data));
        res.end();
      })
      .catch((err) => {
        console.log(err);
        res.writeHead(404, { "Content-Type": "application/json" });
        res.write(JSON.stringify(err));
        res.end();
      });
  });
};

module.exports = {
  getAllBook,
  removeBookById,
  addNewBook,
  returnBookById,
  borrowBookByIds
};
