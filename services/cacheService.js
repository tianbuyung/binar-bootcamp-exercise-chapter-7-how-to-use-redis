const { client } = require("../cache/redisCache");

module.exports = {
  getCached: async (key) => {
    return await client.get(key);
  },
  setCached: async (key, value) => {
    return await client.set(key, JSON.stringify(value), {
      EX: 180,
      NX: true,
    });
  },
};
