const FishService = require("../services/fishService");
const fishService = new FishService();
const cachedService = require("../services/cachedService");

module.exports = {
  getSpeciesData: async (req, res) => {
    const species = req.params.species;
    let results;
    let isCached = false;
    try {
      const cacheResults = await cachedService.getCached(species);
      if (cacheResults) {
        isCached = true;
        results = JSON.parse(cacheResults);
      } else {
        results = await fishService.fetchApiData(species);
        if (results.length === 0) {
          throw "API returned an empty array";
        }
        await cachedService.setCached(species, results);
      }
      res.send({
        fromCache: isCached,
        data: results,
      });
    } catch (error) {
      console.error(error);
      res.status(404).send("Data unavailable");
    }
  },
};
