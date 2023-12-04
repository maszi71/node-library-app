const { findAllUser, upgradeUser } = require("../models/User");
const url = require("node:url");

const getAllUsers = async (req, res) => {
  const users = await findAllUser();
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(users));
  res.end();
};

const upgradeUserToAdmin = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const userId = parsedUrl.query.id;
  await upgradeUser(userId)
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
  getAllUsers,
  upgradeUserToAdmin
};
