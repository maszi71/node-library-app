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
  }else if (req.method === "GET" && req.url === "/api/books") {
    fs.readFile("./db.json", (err, db) => {
      if (err) throw err;

      const books = JSON.stringify(JSON.parse(db).books);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(books);
      res.end();
    });
  } 
});

server.listen(4000, () => console.log("server is running"));
