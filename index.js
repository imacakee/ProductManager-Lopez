const fs = require("fs");
const path = "./products/products.txt";

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = this.fetchData();
  }

  fetchData() {
    try {
      const fileContent = fs.readFileSync(this.path, "utf-8");
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

  writeData() {
    fs.writeFileSync(this.path, JSON.stringify(this.products));
  }

  getProducts() {
    return this.fetchData();
  }

  getProductById(id) {
    return (
      this.fetchData().find((prd) => prd.id == id) || console.log("not found")
    );
  }

  addProduct(product) {
    const valueList = Object.values(product);

    if (valueList.some((value) => value == null || value == undefined || value == "")) {
      console.log("el objeto no puede contener campos null o undefined");
      return;
    }

    const productsList = this.fetchData();

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
      this.writeData();
    }
  }

  updateProduct(id, newProduct) {
    let prod = this.getProductById(id);
    prod = { ...prod, ...newProduct, id };
    const productsList = this.fetchData();
    const foundIndex = productsList.findIndex((prd) => prd.id == id);
    productsList[foundIndex] = prod;
    this.products = productsList;

    this.writeData();
  }

  deleteProduct(id) {
    this.products = this.fetchData().filter((product) => product.id != id);
    this.writeData();
  }
}

class Product {
  constructor(title, description, price, thumbnail, code, stock) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}

