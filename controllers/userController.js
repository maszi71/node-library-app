const {
  findAllUser,
  upgradeUser,
  isRegisteredUser,
  createNewUser,
  updateUser,
  findUser,
  isLoginUser,
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

const penalizeUser = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const userId = parsedUrl.query.id;
  let user = "";
  req.on("data", (data) => {
    user += data;
  });
  req.on("end", async () => {
    const userInfo = JSON.parse(user);
    const isAvailableUser = await findUser(userId);
    if (isAvailableUser) {
      await updateUser(userId, userInfo)
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
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ massage: " User Not Found" }));
      res.end();
    }
  });
};

const registerNewUser = async (req, res) => {
  let user = "";
  req.on("data", (data) => {
    user += data;
  });
  req.on("end", async () => {
    const parsedUser = JSON.parse(user);
    const { name, username, email, password } = parsedUser;
    if (!name || !username || !email || !password) {
      res.writeHead(422, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ massage: " User data is not Valid" }));
      res.end();
      return;
    }
    const hasUser = await isRegisteredUser(email, username);
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
          res.writeHead(404, { "Content-Type": "application/json" });
          res.write(JSON.stringify(err));
          res.end();
        });
    }
  });
};

const loginUser = async (req, res) => {
  let body = "";
  req.on("data", (data) => {
    body += data;
  });
  req.on("end", async () => {
    const { username, password } = JSON.parse(body);
    await isLoginUser(username, password)
      .then((data) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(data));
        res.end();
      })
      .catch((err) => {
        res.writeHead(409, { "Content-Type": "application/json" });
        res.write(JSON.stringify(err));
        res.end();
      });
  });
};

module.exports = {
  getAllUsers,
  upgradeUserToAdmin,
  registerNewUser,
  penalizeUser,
  loginUser,
};
