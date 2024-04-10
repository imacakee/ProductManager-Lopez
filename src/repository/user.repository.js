const cartDao = require("../services/cart.service");

class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async findById(id) {
    return await this.dao.findById(id);
  }

  async updateUser(id, updatedUser) {
    return await this.dao.updateUser(id, updatedUser);
  }

  async swapRole(id) {
    const user = await this.findById(id);
    let result;
    if (user.role === "user") {
      const updatedUser = { role: "premium" };
      result = await this.updateUser(id, updatedUser);
    } else if (user.role === "premium") {
      const updatedUser = { role: "user" };
      result = await this.updateUser(id, updatedUser);
    }
    return result;
  }

  async destroyUser(email) {
    const user = await this.dao.findByEmail(email);
    await cartDao.deleteCart(user.cartId);
    return await this.dao.destroyUser(user._id);
  }
}

module.exports = UserRepository;
