const { findAllUser } = require("../models/User");

const getAllUsers = async (req, res) => {
  const users = await findAllUser();
  res.writeHead(200, { "Content-Type": "application/json" });
  res.write(JSON.stringify(users));
  res.end();
};

module.exports = {
  getAllUsers,
};
