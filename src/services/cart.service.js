const { cartModel } = require("../models/cart.model");
const CustomError = require("./errors/custom.error");

class CartDao {
  async addCart(newCart) {
    try {
      await cartModel.create(newCart);
    } catch (error) {
      console.log(error);
      return CustomError.createError({
        cause: "Error creating cart",
        message: error,
        code: 500,
      });
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
      return CustomError.createError({
        cause: "Error fetching cart",
        message: error,
        code: 500,
      });
    }
  }

  async getCartById(id, populate = false) {
    const pop = populate ? "items.product" : "";
    return await cartModel.findById(id).populate(pop).lean();
  }

  async modifyProduct(id, items) {
    try {
      return await cartModel.findByIdAndUpdate(id, { items }, { new: true });
    } catch (error) {
      console.log(error);
      return CustomError.createError({
        cause: "Error updating cart",
        message: error,
        code: 500,
      });
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

  async clear() {
    try {
      return await cartModel.deleteMany();
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = new CartDao();
