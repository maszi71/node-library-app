const {
  findAllUser,
  upgradeUser,
  isAvailableUser,
  createNewUser,
} = require("../models/User");
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
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(JSON.stringify(err));
      res.end();
    });
};

const registerNewUser = async (req, res) => {
  let user = "";
  req.on("data", (data) => {
    user += data;
    console.log(user);
  });
  req.on("end", async () => {
    const parsedUser = JSON.parse(user);
    const { name, username, email, password } = parsedUser;
    if (!name || !username || !email || !password) {
      res.writeHead(422, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ massage: " User data is not Valid" }));
      res.end();
      return
    }
    const hasUser = await isAvailableUser(email, username);
    if (hasUser) {
      res.writeHead(409, { "Content-Type": "application/json" });
      res.write(
        JSON.stringify({ massage: " email or username are already exist" })
      );
      res.end();
    } else {
      await createNewUser(parsedUser)
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
    }
  });
};

module.exports = {
  getAllUsers,
  upgradeUserToAdmin,
  registerNewUser
};
