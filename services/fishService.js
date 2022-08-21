const AxiosModel = require("../repositories/axios");
const axios = new AxiosModel();

class FishService {
  async fetchApiData(species) {
    const apiResponse = await axios.getFishData(species);
    console.log("Request sent to the API");
    return apiResponse.data;
  }
}

module.exports = FishService;
