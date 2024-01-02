const { cartModel } = require("../../models/cart.model");

class CartDao {
  async addCart(newCart) {
    try {
      await cartModel.create(newCart);
    } catch (error) {
      console.log(error);
    }
  }

  async getCarts(limit) {
    if (limit) {
      return await cartModel.find.limit(limit);
    }
    return await cartModel.find();
  }

  async getCartById(id) {
    return await cartModel.findById(id);
  }

  async updateCart(id, productId, amountToModify) {
    try {
      const cart = await cartModel.findById(id);
      const item = cart.items.find((item) => item.product == productId);
      let updatedCart = cart.items;
      if (item) {
        item.quantity += amountToModify;
        const indexOfItem = cart.items.indexOf(item);
        if (item.quantity <= 0) updatedCart = cart.items.splice(indexOfItem, 1);
        else updatedCart = cart.items.splice(indexOfItem, 1, item);
      }
      console.log("el carrito anachi", updatedCart);
      return await cartModel.findByIdAndUpdate(
        id,
        { items: updatedCart },
        { new: true }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCart(id) {
    try {
      return await cartModel.findByIdAndDelete(id);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new CartDao();
