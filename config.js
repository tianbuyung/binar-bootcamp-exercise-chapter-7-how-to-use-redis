require("dotenv").config();

const {
  APP_PORT,
  APP_HOST,
  APP_PROTOCOL,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAME,
  REDIS_HOST,
  REDIS_PORT,
} = process.env;

const appPort = APP_PORT || 3000;
const appHost = APP_HOST || "localhost";
const appProtocol = APP_PROTOCOL || "http";
const databaseHost = DATABASE_HOST || "localhost";
const databasePort = DATABASE_PORT || 27017;
const databaseName = DATABASE_NAME || "database";
const redisHost = REDIS_HOST || "localhost";
const redisPort = REDIS_PORT || 6379;

module.exports = {
  appPort,
  appHost,
  appProtocol,
  databaseHost,
  databasePort,
  databaseName,
  redisHost,
  redisPort,
};
