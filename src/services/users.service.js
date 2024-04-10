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

  async destroyUser(id) {
    try {
      return await userModel.findByIdAndDelete(id, { new: true });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async clear() {
    try {
      return await userModel.deleteMany();
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = new UserService();
