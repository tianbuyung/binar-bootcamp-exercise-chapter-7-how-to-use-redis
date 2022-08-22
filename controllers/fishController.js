const FishService = require("../services/fishService");
const fishService = new FishService();
const cacheService = require("../services/cacheService");

module.exports = {
  getSpeciesData: async (req, res) => {
    const species = req.params.species;
    try {
      let results = await fishService.fetchApiData(species);
      if (results.length === 0) {
        throw "API returned an empty array";
      }
      await cacheService.setCached(species, results);
      res.send({
        fromCache: false,
        data: results,
      });
    } catch (error) {
      console.error(error);
      res.status(404).send("Data unavailable");
    }
  },
};
