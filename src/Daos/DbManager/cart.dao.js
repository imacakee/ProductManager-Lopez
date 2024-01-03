const { cartModel } = require("../../models/cart.model");

class CartDao {
  async addCart(newCart) {
    try {
      await cartModel.create(newCart);
    } catch (error) {
      console.log(error);
    }
  }

  async getCarts({ limit, page }) {
    return await cartModel.paginate(
      {},
      {
        limit: limit || 10,
        page: page || 1,
        populate: { path: "items", populate: { path: "product" } },
      }
    );
  }

  async getCartById(id) {
    return await cartModel.findById(id);
  }

  async modifyProduct(id, productId, amountToModify) {
    try {
      const cart = await cartModel.findById(id);
      const item = cart.items.find((item) => item.product == productId);
      if (item) {
        item.quantity += +amountToModify;
        const indexOfItem = cart.items.indexOf(item);
        if (item.quantity <= 0) {
          cart.items.splice(indexOfItem, 1);
        } else cart.items.splice(indexOfItem, 1, item);
      } else if (+amountToModify > 0) {
        const newProd = { product: productId, quantity: amountToModify };
        if (cart.items) {
          cart.items.push(newProd);
        } else {
          cart.items = [newProd];
        }
      }
      return await cartModel.findByIdAndUpdate(
        id,
        { items: cart.items },
        { new: true }
      );
    } catch (error) {
      console.log(error);
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
