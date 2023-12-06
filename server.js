const http = require("http");
const db = require("./db.json");
require("dotenv").config();
const {
  getAllBook,
  removeBookById,
  addNewBook,
  returnBookById,
  borrowBookByIds,
  updateBookById,
} = require("./controllers/bookController");
const {
  getAllUsers,
  upgradeUserToAdmin,
  registerNewUser,
  penalizeUser,
  loginUser,
} = require("./controllers/userController");

const server = http.createServer((req, res) => {
  // get list of users
  if (req.method === "GET" && req.url === "/api/users") {
    getAllUsers(req, res);
  } // get list of books
  else if (req.method === "GET" && req.url === "/api/books") {
    getAllBook(req, res);
  } // delete specific book
  else if (req.method === "DELETE" && req.url.startsWith("/api/books")) {
    removeBookById(req, res);
  } // add new book
  else if (req.method === "POST" && req.url === "/api/books") {
    addNewBook(req, res);
  } // return the book
  else if (req.method === "PUT" && req.url.startsWith("/api/books/return")) {
    returnBookById(req, res);
  }
  //update existing book
  else if (req.method === "PUT" && req.url.startsWith("/api/books")) {
    updateBookById(req, res);
  } // create new user
  else if (req.method === "POST" && req.url === "/api/auth/register") {
    registerNewUser(req, res);
  } // upgrade user to admin
  else if (req.method === "PUT" && req.url.startsWith("/api/users/upgrade")) {
    upgradeUserToAdmin(req, res);
  }
  // the user is fined because of delay to return book
  else if (req.method === "PUT" && req.url.startsWith("/api/users")) {
    penalizeUser(req, res);
  } // logged in user
  else if (req.method === "POST" && req.url === "/api/auth/login") {
    loginUser(req, res);
  } // borrow a book
  else if (req.method === "POST" && req.url === "/api/books/borrow") {
    borrowBookByIds(req, res);
  }
});

server.listen(process.env.PORT, () => console.log("server is running"));
