require("dotenv").config();
const express = require("express");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { connectRedis } = require("./models/redis");

// App router
const fishRouter = require("./routes/fishRouter");

const app = express();
const appPort = process.env.APP_PORT || 3000;

connectRedis();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", fishRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(appPort, () => {
  console.log(`App listening on port ${appPort}`);
});
