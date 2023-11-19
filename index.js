const { ok } = require("assert");

const fs = require("fs").promises;

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = this.fetchData();
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
      return [];
    }
  }

  async writeData() {
    return await fs.writeFile(this.path, JSON.stringify(this.products));
  }

  async getProducts() {
    return await this.fetchData();
  }

  async getProductById(id) {
    const productList = await this.getProducts();
    return productList.find((prd) => prd.id == id) || console.log("not found");
  }

  async addProduct(product) {
    const valueList = Object.values(product);
    //TO DO!!!! THUMBNAIL CAN BE NULL (object.keys??)
    if (
      valueList.some(
        (value) => value == null || value == undefined || value == ""
      )
    ) {
      return { error: "el objeto no puede contener campos null o undefined" };
    }

    const productsList = await this.getProducts();

    if (productsList.length > 0) {
      product.id = productsList[productsList.length - 1].id + 1;
    } else {
      product.id = 1;
    }

    if (productsList.some((prd) => prd.code == product.code)) {
      return { error: `el código ${product.code} ya existe` };
    } else {
      productsList.push(product);
      this.products = productsList;
      await this.writeData();
      return product;
    }
  }

  async updateProduct(id, newProduct) {
    try {
      let prod = await this.getProductById(id);
      prod = { ...prod, ...newProduct, id };
      const productsList = await this.getProducts();
      const foundIndex = productsList.findIndex((prd) => prd.id == id);
      productsList[foundIndex] = prod;
      this.products = productsList;

      await this.writeData();
      return prod;
    } catch (error) {
      return { error };
    }
  }

  async deleteProduct(id) {
    try {
      const prdList = await this.getProducts();
      this.products = prdList.filter((prd) => prd.id != id);
      await this.writeData();
      return { message: "Ok" };
    } catch (error) {
      return { error };
    }
  }
}

class Product {
  constructor(title, description, price, thumbnail, code, stock, category) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.status = true;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
    this.category = category;
  }
}

module.exports = { Product, ProductManager };
