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
const { writeResponse } = require("../utils/response");

const getAllUsers = async (req, res) => {
  const users = await findAllUser();
  writeResponse(res, users, 200, "application/json");
};

const upgradeUserToAdmin = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const userId = parsedUrl.query.id;
  await upgradeUser(userId)
    .then((data) => {
      writeResponse(res, data, 200, "application/json");
    })
    .catch((err) => {
      writeResponse(res, err, 404, "application/json");
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
          writeResponse(res, data, 200, "application/json");
        })
        .catch((err) => {
          writeResponse(res, err, 404, "application/json");
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
      writeResponse(
        res,
        { massage: " User data is not Valid" },
        422,
        "application/json"
      );
      return;
    }
    const hasUser = await isRegisteredUser(email, username);
    if (hasUser) {
      writeResponse(
        res,
        { massage: " email or username are already exist" },
        409,
        "application/json"
      );
    } else {
      await createNewUser(parsedUser)
        .then((data) => {
          writeResponse(res, data, 201, "application/json");
        })
        .catch((err) => {
          writeResponse(res, err, 404, "application/json");
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
        writeResponse(res, data, 200, "application/json");
      })
      .catch((err) => {
        writeResponse(res, err, 409, "application/json");
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
