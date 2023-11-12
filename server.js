const http = require("http");
const fs = require("fs");
const url = require("node:url");
const db = require("./db.json");

const server = http.createServer((req, res) => {
  // get list of users
  if (req.method === "GET" && req.url === "/api/users") {
    fs.readFile("./db.json", (err, db) => {
      if (err) throw err;

      const users = JSON.stringify(JSON.parse(db).users);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(users);
      res.end();
    });
  } // get list of books
  else if (req.method === "GET" && req.url === "/api/books") {
    fs.readFile("./db.json", (err, db) => {
      if (err) throw err;

      const books = JSON.stringify(JSON.parse(db).books);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(books);
      res.end();
    });
  } // delete specific book
  else if (req.method === "DELETE" && req.url.startsWith("/api/books")) {
    console.log(db, "db");
    const parsedUrl = url.parse(req.url, true);
    const bookId = parsedUrl.query.id;
    const updatedBookList = db.books.filter((book) => book.id !== +bookId);
    if (updatedBookList.length !== db.books.length) {
      fs.writeFile(
        "./db.json",
        JSON.stringify({ ...db, books: updatedBookList }),
        (err) => {
          if (err) throw err;
        }
      );
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ massage: "Book Is Removed Successfully" }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ massage: "Can not Found This Book" }));
    }
    res.end();
  } // add new book
  else if (req.method === "POST" && req.url === "/api/books") {
    let body = "";
    req.on("data", (data) => {
      body += data;
    });
    req.on("end", () => {
      const newBook = {
        id: db.books.length + 1,
        ...JSON.parse(body),
        free: 1,
      };

      const newDb = { ...db, books: [...db.books, newBook] };
      fs.writeFile("./db.json", JSON.stringify(newDb), (err) => {
        if (err) throw err;
      });
    });
    res.writeHead(201, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ massage: "New Book is Added Successfully" }));
    res.end();
  } //update existing book
  else if (req.method === "PUT" && req.url.startsWith("/api/books")) {
    const parsedUrl = url.parse(req.url, true);
    const bookId = parsedUrl.query.id;
    let body = "";
    req.on("data", (data) => {
      body += data;
    });
    req.on("end", () => {
      const updatedbookList = db.books.filter((book) => book.id !== +bookId);
      const foundBook = db.books.find((book) => book.id === +bookId);
      const updatedBook = {
        id: foundBook.id,
        ...JSON.parse(body),
        free: foundBook.free,
      };
      const newDb = { ...db, books: [...updatedbookList, updatedBook] };
      fs.writeFile("./db.json", JSON.stringify(newDb), (err) => {
        if (err) throw err;
      });
    });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ massage: " Book is Updated Successfully" }));
    res.end();
  } // create new user
  else if (req.method === "POST" && req.url === "/api/users") {
    let user = "";
    req.on("data", (data) => {
      user += data;
      console.log(user);
    });
    req.on("end", () => {
      const { name, username, email , password } = JSON.parse(user);
      const isExisted = db.users.some(
        (user) => user.email === email || user.username === username
      );
      if (!name || !username || !email || !password) {
        console.log("name / username / email");
        res.writeHead(422, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ massage: " User data is not Valid" }));
      } else if (isExisted) {
        console.log("isexsited");
        res.writeHead(409, { "Content-Type": "application/json" });
        res.write(
          JSON.stringify({ massage: " email or username are already exist" })
        );
      } else {
        const newUser = {
          id: db.users.length + 1,
          ...JSON.parse(user),
          fine: 0,
          role: "USER",
        };
        const newDb = { ...db, users: [...db.users, newUser] };
        fs.writeFile("./db.json", JSON.stringify(newDb), (err) => {
          if (err) throw err;
        });
        res.writeHead(201, { "Content-Type": "application/json" });
        res.write(
          JSON.stringify({ massage: " User is Registered Successfully" })
        );
      }
      res.end();
    });
  } // upgrade user to admin
   else if(req.method === "PUT" && req.url.startsWith("/api/users/upgrade")) {
    const parsedUrl = url.parse(req.url, true);
    const userId = parsedUrl.query.id;
    const foundUser = db.users.find((usr) => usr.id === +userId);
    const updatedUser = {
      ...foundUser,
      role : "ADMIN"
    }
    const updatedUserList = db.users.filter((user) => user.id !== +userId);
    const newDb = {...db , users: [...updatedUserList , updatedUser]};
    fs.writeFile("./db.json" , JSON.stringify(newDb) , (err) => {if(err) throw err});
    res.writeHead(200 , {"Content-Type" : "application/json"});
    res.write(JSON.stringify({message : "user is upgrated successfully"}));
    res.end()
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
  }
});

server.listen(4000, () => console.log("server is running"));
