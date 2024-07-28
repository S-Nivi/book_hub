const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  const user = await Users.findAll();
});

router.post("/register", async (req, res) => {
  const { username, password, gmail } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
      gmail: gmail,
    });
  });

  res.json({
    username: username,

    gmail: gmail,
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ where: { username: username } });

  if (!user) res.json({ error: "User doesn't exist." });
  else {
    bcrypt.compare(password, user.password).then((match) => {
      if (!match) res.json({ error: "Invalid credentials" });
      else res.json(user);
    });
  }
});

router.post("/password", async (req, res) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    Users.update({ password: hash }, { where: { username: username } });
  });

  res.json("done");
});

module.exports = router;
