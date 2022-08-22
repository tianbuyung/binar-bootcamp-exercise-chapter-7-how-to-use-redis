const express = require("express");
const mongoose = require("mongoose");
const { connectRedis } = require("./cache/redisCache");
const cors = require("cors");
const logger = require("morgan");
const cookieParser = require("cookie-parser");

const {
  appPort,
  appHost,
  appProtocol,
  databaseHost,
  databasePort,
  databaseName,
} = require("./config");

const corsOptions = {
  origin: `${appProtocol}://${appHost}:${appPort}`,
};

const fishRouter = require("./routes/fishRouter");
const authRouter = require("./routes/authRouter");

const app = express();
mongoose
  .connect(`mongodb://${databaseHost}:${databasePort}/${databaseName}`)
  .then(() => console.log(`MongoDB is running on port ${databasePort}`))
  .catch((err) => {
    console.log("Error in MongoDB connection : " + err);
  });
connectRedis();

app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/fish", fishRouter);

app.listen(appPort, () => {
  console.log(`Server is running on port ${appPort}`);
});
