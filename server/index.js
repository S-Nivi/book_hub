const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = require("./models");

const userRouter = require("./routes/users");
app.use("/users", userRouter);

const booksRouter = require("./routes/books");
app.use("/books", booksRouter);

const profileRouter = require("./routes/profile");
app.use("/profile", profileRouter);

db.sequelize.sync().then(() => {
  app.listen(3007, () => {
    console.log("server running...");
  });
});
