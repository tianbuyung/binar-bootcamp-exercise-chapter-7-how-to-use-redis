const AuthService = require("../services/authService");

const authService = new AuthService();

module.exports = {
  register: async (req, res) => {
    const payload = req;
    const [error, user] = await authService.register(payload);
    if (error) {
      res.status(400).json({
        message: error,
      });
    } else {
      res.status(200).json({
        message: "Successfully register user.",
        user,
      });
    }
  },
  login: async (req, res) => {
    const payload = req;
    const [error, token] = await authService.login(payload);
    if (error) {
      res.status(400).json({
        message: error,
      });
    } else {
      res.status(200).json({
        message: "Successfully register user.",
        token,
      });
    }
  },
};
