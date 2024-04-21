const userModel = require("../models/user.model");

class UserService {
  async findAll(query = null) {
    try {
      return query ? await userModel.find(query) : await userModel.find();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

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

  async removeInactive() {
    try {
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      return await userModel.deleteMany({
        last_connection: { $lte: twoDaysAgo },
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = new UserService();
