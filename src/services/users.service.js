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

  async findById(id) {
    try {
      return await userModel.findById(id);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateUser(id, updatedUser) {
    try {
      return await userModel.findByIdAndUpdate(id, updatedUser, {
        new: true,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new UserService();
