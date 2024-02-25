const { cartModel } = require("../models/cart.model");

class CartDao {
  async addCart(newCart) {
    try {
      await cartModel.create(newCart);
    } catch (error) {
      console.log(error);
      return { message: "Error creating cart", error };
    }
  }

  async getCarts(limit, page) {
    try {
      return await cartModel.paginate(
        {},
        {
          limit: limit || 10,
          page: page || 1,
          populate: { path: "items", populate: { path: "product" } },
        }
      );
    } catch (error) {
      console.log(error);
      return { message: "Error fetching cart", error };
    }
  }

  async getCartById(id) {
    return await cartModel.findById(id);
  }

  async modifyProduct(id, items) {
    try {
      return await cartModel.findByIdAndUpdate(id, { items }, { new: true });
    } catch (error) {
      console.log(error);
      return { message: `Error updating cart`, error };
    }
  }

  async updateCart(id, newCart) {
    return await cartModel.findByIdAndUpdate(id, newCart, { new: true });
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
