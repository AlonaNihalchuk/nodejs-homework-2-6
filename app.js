const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const boolParser = require("express-query-boolean");
const helmet = require("helmet");

const contactsRouter = require("./routes/contacts/contacts");
const usersRouter = require("./routes/users/users");
const RareLimits = require("./config/constants");
const { HttpCode } = require("./config/constants");

require("dotenv").config();
const AVATARS_DIR = process.env.AVATARS_DIR;

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(express.static(AVATARS_DIR));
app.use(helmet());
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: RareLimits.JSON_LIMIT }));
app.use(boolParser());

app.use((req, res, next) => {
  // установ глобальную переменную
  app.set("lang", req.acceptsLanguages(["en", "ru"]));
  next();
});
app.use("/api/users", usersRouter);
app.use("/api/contacts", contactsRouter);

app.use((_req, res) => {
  res.status(HttpCode.NOT_FOUND).json({
    status: "error",
    code: HttpCode.NOT_FOUND,
    message: "Not found!",
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.status || HttpCode.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json({
    status: statusCode === HttpCode.INTERNAL_SERVER_ERROR ? "fail" : "error",
    code: statusCode,
    message: err.message,
  });
});

module.exports = app;
