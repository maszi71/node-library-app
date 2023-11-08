const http = require("http");
const fs = require("fs");
const url = require("node:url");
const db = require("./db.json");

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/api/users") {
    fs.readFile("./db.json", (err, db) => {
      if (err) throw err;

      const users = JSON.stringify(JSON.parse(db).users);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(users);
      res.end();
    });
  } else if (req.method === "GET" && req.url === "/api/books") {
    fs.readFile("./db.json", (err, db) => {
      if (err) throw err;

      const books = JSON.stringify(JSON.parse(db).books);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(books);
      res.end();
    });
  } else if (req.method === "DELETE" && req.url.startsWith("/api/books")) {
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
  } else if (req.method === "POST" && req.url === "/api/books") {
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
  } 
});

server.listen(4000, () => console.log("server is running"));
