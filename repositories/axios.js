const axios = require("axios");

class AxiosRepository {
  async getFishData(species) {
    return await axios.get(`https://www.fishwatch.gov/api/species/${species}`);
  }
}

module.exports = AxiosRepository;
