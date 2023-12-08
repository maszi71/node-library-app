const url = require("node:url");
const {
  findAllBook,
  removeBook,
  addBook,
  returnBook,
  borrowBook,
  updateBook,
} = require("../models/Book");
const { writeResponse } = require("../utils/response");


const getAllBook = async (req, res) => {
  const books = await findAllBook();
  writeResponse(res, books, 200, "application/json");
};

const removeBookById = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const bookId = parsedUrl.query.id;
  await removeBook(bookId)
    .then((data) => {
      writeResponse(res, data, 200, "application/json");
    })
    .catch((err) => {
      writeResponse(res, err, 404, "application/json");
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
        writeResponse(res, data, 201, "application/json");
      })
      .catch((err) => {
        writeResponse(res, err, 404, "application/json");
      });
  });
};

const returnBookById = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const bookId = parsedUrl.query.id;
  await returnBook(bookId)
    .then((data) => {
      writeResponse(res, data, 200, "application/json");
    })
    .catch((err) => {
      writeResponse(res, err, 404, "application/json");
    });
};

const updateBookById = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const bookId = parsedUrl.query.id;
  let body = "";
  req.on("data", (data) => {
    body += data;
  });

  req.on("end", async () => {
    const parsedBody = JSON.parse(body);
    await updateBook(bookId, parsedBody)
      .then((data) => {
        writeResponse(res, data, 200, "application/json");
      })
      .catch((err) => {
        writeResponse(res, err, 404, "application/json");
      });
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
        writeResponse(res, data, 200, "application/json");
      })
      .catch((err) => {
        writeResponse(res, err, 404, "application/json");
      });
  });
};

module.exports = {
  getAllBook,
  removeBookById,
  addNewBook,
  returnBookById,
  borrowBookByIds,
  updateBookById,
};
