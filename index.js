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
    const productList = await this.fetchData();
    return productList.find((prd) => prd.id == id) || console.log("not found");
  }

  async addProduct(product) {
    const valueList = Object.values(product);

    if (
      valueList.some(
        (value) => value == null || value == undefined || value == ""
      )
    ) {
      console.log("el objeto no puede contener campos null o undefined");
      return;
    }

    const productsList = await this.getProducts();

    if (productsList.length > 0) {
      product.id = productsList[productsList.length - 1].id + 1;
    } else {
      product.id = 1;
    }

    if (productsList.some((prd) => prd.code == product.code)) {
      console.log(`el código ${product.code} ya existe`);
    } else {
      productsList.push(product);
      this.products = productsList;
      await this.writeData();
    }
  }

  async updateProduct(id, newProduct) {
    let prod = this.getProductById(id);
    prod = { ...prod, ...newProduct, id };
    const productsList = await this.getProducts();
    const foundIndex = productsList.findIndex((prd) => prd.id == id);
    productsList[foundIndex] = prod;
    this.products = productsList;

    await this.writeData();
  }

  async deleteProduct(id) {
    this.products = await this.getProducts().filter(
      (product) => product.id != id
    );
    await this.writeData();
  }
}

class Product {
  constructor(
    title,
    description,
    price,
    status,
    thumbnail,
    code,
    stock,
    category
  ) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.status = status;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
    this.category = category;
  }
}

module.exports = { Product, ProductManager };
