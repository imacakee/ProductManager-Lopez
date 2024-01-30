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
    return await fs.writeFile(this.path, JSON.stringify(this.carts));
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

    cartList.push(cart);
    this.carts = cartList;
    await this.writeData();
    return cart;
  }

  async addProduct(cartId, pid, quantity) {
    const cart = await this.getCartById(cartId);
    const cartList = await this.getCarts();

    console;
    if (cart.products.find((prd) => prd.product == pid)) {
      const i = cart.products.findIndex((prd) => prd.product == pid);
      cart.products[i].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    const cartIndex = cartList.findIndex((cart) => cart.id == cartId);
    cartList[cartIndex] = cart;
    this.carts = cartList;

    await this.writeData();
    return cart;
  }

  async removeProduct(cartId, pid, quantity) {
    try {
      const cart = await this.getCartById(cartId);
      let cartList = await this.getCarts();

      const i = cart.products.findIndex((prd) => prd.product == pid);

      if (cart.products[i].quantity - quantity <= 0) {
        cart.products = cart.products.filter((prd) => prd.product != pid);
      } else {
        cart.products[i].quantity -= quantity;
      }

      const cartIndex = cartList.findIndex((cart) => cart.id == cartId);
      cartList[cartIndex] = cart;
      this.carts = cartList;
      await this.writeData();
      return cart;
    } catch (error) {
      return { error };
    }
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
