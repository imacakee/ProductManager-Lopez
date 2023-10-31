class ProductManager {
  constructor() {
    this.products = [];
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    return (
      this.products.find((prd) => prd.id == id) || console.log("not found")
    );
  }

  addProduct(product) {
    const valueList = Object.values(product);

    if (valueList.some((value) => value == null || value == undefined)) {
      console.log("el objeto no puede contener campos null o undefined");
      return;
    }

    if (this.products.length > 0) {
      product.id = this.products[this.products.length - 1].id + 1;
    } else {
      product.id = 1;
    }

    if (this.products.some((prd) => prd.code == product.code)) {
      console.log(`el código ${product.code} ya existe`);
      return;
    }

    this.products.push(product);
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
