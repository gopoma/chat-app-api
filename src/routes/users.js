const express = require("express");
const authValidation = require("../middleware/auth");
const UserService = require("../services/users");

function users(app) {
  const router = express.Router();
  const userService = new UserService();

  app.use("/api/users", router);

  router.get("/", authValidation(1), async (req, res) => {
    const result = await userService.getAll();
    return res.json(result);
  });

  router.get("/search", async (req, res) => {
    const result = await userService.search(req.query);
    return res.json(result);
  });
}

module.exports = users;