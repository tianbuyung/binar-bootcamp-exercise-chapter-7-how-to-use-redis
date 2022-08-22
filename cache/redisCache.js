const redis = require("redis");
const { redisHost, redisPort } = require("../config");
const client = redis.createClient({
  socket: {
    host: redisHost || "localhost",
    port: redisPort || "6379",
  },
});

async function connectRedis() {
  try {
    await client.connect();
    console.log(`Redis client is running on port ${redisPort}`);
  } catch (error) {
    client.on("error", function (err) {
      console.log("Redis Client Error", err);
    });
  }
}

module.exports = { client, connectRedis };
