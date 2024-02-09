const userModel = require("../models/user.model");

class UserService {
  async findByEmail(email) {
    try {
      return await userModel.findOne({ email });
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = new UserService();
