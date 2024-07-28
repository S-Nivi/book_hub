const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { ExclusionConstraintError } = require("sequelize");

router.post("/create", async (req, res) => {
  let { username, book } = req.body;

  const existing = await Users.findOne({ where: { username: username } });
  if (
    existing.books == null ||
    existing.books == undefined ||
    existing.books == ""
  ) {
    const title = book.title;

    let books = {};
    books[title] = book;
    const result = await Users.update(
      { books: books },
      { where: { username: username } }
    );
    res.json(result);
  } else {
    const title = book.title;
    existing.books[title] = book;
    const result = await Users.update(
      { books: existing.books },
      { where: { username: username } }
    );
    res.json(result);
  }
});

router.post("/delete", async (req, res) => {
  let { username, books } = req.body;
  const result = await Users.update(
    { books: books },
    { where: { username: username } }
  );
  res.json(result);
});

router.post("/addfav", async (req, res) => {
  let { username, book } = req.body;
  const existing = await Users.findOne({ where: { username: username } });
  if (existing.liked == null) {
    const result = await Users.update(
      { liked: [book] },
      { where: { username: username } }
    );
    res.json(result);
  } else {
    existing.liked.push(book);
    const result = await Users.update(
      { liked: existing.liked },
      { where: { username: username } }
    );
    res.json(result);
  }
});
router.post("/removefav", async (req, res) => {
  let { username, book } = req.body;
  const existing = await Users.findOne({ where: { username: username } });

  existing.liked.splice(existing.liked.indexOf(book));
  const result = await Users.update(
    { liked: existing.liked },
    { where: { username: username } }
  );
  res.json(result);
});

router.post("/removeBought", async (req, res) => {
  let { username, book } = req.body;
  const existing = await Users.findOne({ where: { username: username } });

  existing.bought.splice(existing.bought.indexOf(book));
  const result = await Users.update(
    { bought: existing.bought },
    { where: { username: username } }
  );
  res.json(result);
});

router.post("/buy", async (req, res) => {
  let { username, book } = req.body;
  const existing = await Users.findOne({ where: { username: username } });

  if (existing.bought != null) {
    existing.bought.push(book);
    const result = await Users.update(
      { bought: existing.bought },
      { where: { username: username } }
    );
    res.json(result);
  } else {
    const result = await Users.update(
      { bought: [book] },
      { where: { username: username } }
    );
    res.json(result);
  }
});

router.get("/", async (req, res) => {
  const username = req.query.username;

  const user = await Users.findOne({ where: { username: username } });
  if (user.books != null) res.json(user.books);
  else res.json("nothing");
});

module.exports = router;
