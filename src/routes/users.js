const express = require("express");
const authValidation = require("../middleware/auth");

function users(app) {
  const router = express.Router();
  app.use("/api/users", router);

  router.get("/", authValidation(1), (req, res) => {
    return res.json({success:true});
  });
}

module.exports = users;