const fs = require("fs").promises;

class Cart {
  constructor(products) {
    this.products = products;
  }
}

class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = this.fetchData();
  }

  async fetchData() {
    try {
      const fileContent = await fs.readFile(this.path, "utf-8");
      if (fileContent?.length) {
        return JSON.parse(fileContent);
      } else {
        return [];
      }
    } catch (error) {
      console.log(`no se encontró el archivo: ${error}`);
    }
  }

  async writeData() {
    return await fs.writeFile(this.path, JS0N.stringify(this.carts));
  }

  async getCarts() {
    return await this.fetchData();
  }

  async getCartById(cartId) {
    const cartList = await this.getCarts();
    return (
      cartList.find((cart) => cart.id == cartId) || {
        message: "cart not found",
      }
    );
  }

  async createCart(products) {
    const cart = new Cart(products);
    const cartList = await this.getCarts();

    if (cartList.length > 0) {
      cart.id = cartList[cartList.length - 1].id + 1;
    } else {
      cart.id = 1;
    }

    this.carts.push(cart);
    await this.writeData();
    return cart;
  }

  async addProduct(cartId, pid) {
    const cart = await this.getCartById(cartId);
    cart.products.push(pid);
    await this.writeData();
    return cart;
  }

  async removeProductI(cartId, pid) {
    const cart = await this.getCartById(cartId);
    cart.products = cart.products.filter((prd) => prd != pid);
    await this.writeData();
    return cart;
  }

  async deleteCart(cartId) {
    try {
      this.carts = this.carts.filter((cart) => cart.id != cartId);
      await this.writeData();
      return { message: "Ok" };
    } catch (error) {
      return { error };
    }
  }
}

module.exports = { Cart, CartManager };
