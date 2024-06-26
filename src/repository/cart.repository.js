const productDao = require("../services/product.service");
const ticketDao = require("../services/ticket.service");
const { sendEmail } = require("../utils");

class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async addCart(newCart) {
    return await this.dao.addCart(newCart);
  }

  async getCarts({ limit, page }) {
    return await this.dao.getCarts(limit, page);
  }

  async getCartById(id, populate) {
    return await this.dao.getCartById(id, populate);
  }

  async purchase(cartId, email) {
    const cart = await this.dao.getCartById(cartId);
    let totalAmount = 0;
    const goodPurchases = [];
    const failedPurchases = [];

    for (const [i, item] of cart.items?.entries()) {
      const product = await productDao.getProductById(item.product);

      if (product.stock >= item.quantity) {
        const updatedStock = product.stock - item.quantity;
        await productDao.updateProduct(item.product, { stock: updatedStock });
        goodPurchases.push(item.product);
        totalAmount += product.price * item.quantity;
      } else {
        failedPurchases.push(product._id);
      }
    }

    cart.items = cart.items.filter(
      (item) => !goodPurchases.includes(item.product)
    );

    await this.dao.updateCart(cartId, cart);
    const newTicket = { amount: totalAmount, purchaser: email };
    const ticket = await ticketDao.addTicket(newTicket);

    sendEmail(email, ticket);
    if (failedPurchases.length) {
      return {
        error: true,
        message:
          "No se pudo concretar la compra de algunos productos por falta de stock",
        products: failedPurchases,
      };
    } else {
      return { error: false, message: "Compra realizada con exito" };
    }
  }

  async modifyProduct(id, productId, amountToModify, user) {
    const cart = await this.dao.getCartById(id);
    const item = cart?.items.find((item) => item.product == productId);
    const product = await productDao.getProductById(productId);
    if (user.role === "premium" && product.owner === user.email) {
      return {
        error: true,
        message: "Usuarios premium no pueden agregar sus propios productos",
      };
    }
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
    const items = cart.items;
    return await this.dao.modifyProduct(id, items);
  }

  async updateCart(id, newCart) {
    return await this.dao.updateCart(id, newCart);
  }

  async deleteCart(id) {
    return await this.dao.deleteCart(id);
  }
}

module.exports = CartRepository;
