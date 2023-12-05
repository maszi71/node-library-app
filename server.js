const http = require("http");
const fs = require("fs");
const url = require("node:url");
const db = require("./db.json");
require("dotenv").config();
const {
  getAllBook,
  removeBookById,
  addNewBook,
  returnBookById,
  borrowBookByIds,
  updateBookById
} = require("./controllers/bookController");
const {
  getAllUsers,
  upgradeUserToAdmin,
  registerNewUser
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
    registerNewUser(req , res);
  } // upgrade user to admin
  else if (req.method === "PUT" && req.url.startsWith("/api/users/upgrade")) {
    upgradeUserToAdmin(req, res);
  }
  // the user is fined because of delay to return book
  else if (req.method === "PUT" && req.url.startsWith("/api/users")) {
    const parsedUrl = url.parse(req.url, true);
    const userId = parsedUrl.query.id;
    let body = "";
    req.on("data", (data) => {
      body += data;
    });

    req.on("end", () => {
      const foundUser = db.users.find((user) => user.id === +userId);
      const updatedUser = {
        ...foundUser,
        ...JSON.parse(body),
      };
      const updatedUserList = db.users.filter((user) => user.id !== +userId);
      const newDb = { ...db, users: [...updatedUserList, updatedUser] };
      fs.writeFile("./db.json", JSON.stringify(newDb), (err) => {
        if (err) throw err;
      });
    });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ massage: " user's fine is set Successfully" }));
    res.end();
  } // logged in user
  else if (req.method === "POST" && req.url === "/api/auth/login") {
    let body = "";
    req.on("data", (data) => {
      body += data;
    });
    req.on("end", () => {
      const { username, password } = JSON.parse(body);
      const foundUser = db.users.find(
        (user) => user.username === username && user.password === password
      );
      if (foundUser) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(
          JSON.stringify({
            message: "You Logged In ",
            user: { userName: foundUser.username, email: foundUser.email },
          })
        );
      } else {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.write(
          JSON.stringify({
            message: "UserName or Password is incorrect ",
          })
        );
      }
      res.end();
    });
  } // borrow a book
  else if (req.method === "POST" && req.url === "/api/books/borrow") {
    borrowBookByIds(req, res);
  }
});

server.listen(process.env.PORT, () => console.log("server is running"));
