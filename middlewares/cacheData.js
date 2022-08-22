const cacheService = require("../services/cacheService");

module.exports = {
  cacheData: async function (req, res, next) {
    const species = req.params.species;
    let results;
    try {
      const cacheResults = await cacheService.getCached(species);
      if (cacheResults) {
        results = JSON.parse(cacheResults);
        res.send({
          fromCache: true,
          data: results,
        });
      } else {
        next();
      }
    } catch (error) {
      console.error(error);
      res.status(404);
    }
  },
};
