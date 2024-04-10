const { productModel } = require("../models/product.model");

class ProductDao {
  async addProduct(newProduct) {
    try {
      return await productModel.create(newProduct);
    } catch (error) {
      console.log(error);
      return { message: "Error creating product", error };
    }
  }

  async getProducts(limit, page, sort, category) {
    const query = category ? { category } : {};
    return await productModel.paginate(query, {
      limit: limit || 10,
      page: page || 1,
      sort,
    });
  }

  async getProductById(id) {
    return await productModel.findById(id);
  }

  async updateProduct(id, updatedProduct) {
    try {
      return await productModel.findByIdAndUpdate(id, updatedProduct, {
        new: true,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(id) {
    try {
      return await productModel.findByIdAndDelete(id);
    } catch (error) {
      console.log(error);
    }
  }

  async clear() {
    try {
      return await productModel.deleteMany();
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new ProductDao();
