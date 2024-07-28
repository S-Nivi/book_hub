const express = require("express");
const router = express.Router();
const { Users } = require("../models");

router.post("/", async (req, res) => {
  let { username, details, mail } = req.body;

  const result = await Users.update(
    { details: details },
    { where: { username: username } }
  );

  const results = await Users.update(
    { gmail: mail },
    { where: { username: username } }
  );

  res.json(result);
});

router.post("/picture", async (req, res) => {
  let { username, profile } = req.body;
  const result = await Users.update(
    { profile: profile },
    { where: { username: username } }
  );
  res.json(result);
});

module.exports = router;
