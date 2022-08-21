const redis = require("redis");
const client = redis.createClient();

async function connectRedis() {
  try {
    await client.connect();
    console.log("Redis client connecting...");
  } catch (error) {
    client.on("error", function (err) {
      console.log("Redis Client Error", err);
    });
  }
}

module.exports = { client, connectRedis };
