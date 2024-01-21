const request = require("supertest");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const app = require("../../app");
const { Product } = require("../../models/productSchema");

jest.mock("../../models/productSchema", () => {
  const originalModel = jest.requireActual("../../models/productSchema");
  return {
    ...originalModel,
    Product: {
      ...originalModel.Product,
      create: jest.fn(),
      findOne: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findById: jest.fn(),
      findByIdAndDelete: jest.fn(),
      find: jest.fn(),
      exists: jest.fn(),
    },
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST /api/product", () => {
  test("should return 201 for create a new product", async () => {
    const productData = {
      name: "product",
    };

    Product.create.mockResolvedValue({
      _id: new ObjectId().toString(),
      name: productData.name,
    });

    const response = await request(app)
      .post("/api/product")
      .send(productData)
      .expect(201);

    expect(response.body.name).toEqual(productData.name);
    expect(Product.create).toHaveBeenCalledWith(productData);
  });

  test("should return 409 if product already exists", async () => {
    const existingProduct = {
      name: "product",
    };

    const productData = {
      name: "product",
    };

    Product.findOne.mockResolvedValue(existingProduct);

    Product.create.mockRejectedValueOnce({ code: 11000 });

    const response = await request(app)
      .post("/api/product")
      .send(productData)
      .expect(409);

    expect(response.body.errorMessage).toBeTruthy();
    expect(response.body.errorMessage).toContain(
      "This product has already been inserted."
    );
  });

  describe("tests on bad requests", () => {
    test("should return 400 for empty string name", async () => {
      const invalidProductData = {
        name: "",
      };

      const response = await request(app)
        .post("/api/product")
        .send(invalidProductData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "Product's name cannot be an empty string."
      );
    });
    test("should return 400 for non-string name", async () => {
      const invalidProductData = {
        name: 123,
      };

      const response = await request(app)
        .post("/api/product")
        .send(invalidProductData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "Product's name must be a string."
      );
    });
    test("should return 400 for request without name's path", async () => {
      const invalidProductData = {};

      const response = await request(app)
        .post("/api/product")
        .send(invalidProductData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain("Path 'name' is required.");
    });
    test("should return 400 for unallowed path", async () => {
      const invalidProductData = {
        name: "product",
        unallowedPath: "",
      };

      const response = await request(app)
        .post("/api/product")
        .send(invalidProductData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "Path not allowed: unallowedPath. Please remove it."
      );
    });
  });
});

describe("PUT /api/product/:id", () => {
  test("should return 200 for successful update", async () => {
    const existingProduct = {
      _id: new ObjectId().toString(),
      name: "product",
    };

    const newProductData = {
      name: "new product",
    };

    Product.findByIdAndUpdate.mockResolvedValue({
      ...existingProduct,
      ...newProductData,
    });

    const response = await request(app)
      .put(`/api/product/${existingProduct._id}`)
      .send(newProductData)
      .expect(200);

    expect(response.body.name).toBe(newProductData.name);
    expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
      existingProduct._id,
      newProductData,
      { new: true }
    );
  });
  test("should return 404 for non-existing product", async () => {
    const _id = new ObjectId().toString();

    const updateData = {
      name: "new product",
    };
    Product.findByIdAndUpdate.mockResolvedValue(null);

    const response = await request(app)
      .put(`/api/product/${_id}`)
      .send(updateData)
      .expect(404);

    expect(response.body.errorMessage).toBeTruthy();
    expect(response.body.errorMessage).toContain(
      `Cannot find any product with this id : ${_id}`
    );
  });
  test("should return 409 if product already exists", async () => {
    const existingProduct = {
      _id: new ObjectId().toString(),
      name: "Existing Product",
    };

    Product.exists.mockResolvedValue(existingProduct);
    Product.findByIdAndUpdate.mockRejectedValue({ code: 11000 });

    const updatedProduct = {
      name: "new product",
    };

    const response = await request(app)
      .put(`/api/product/${new ObjectId().toString()}`)
      .send(updatedProduct)
      .expect(409);

    expect(response.body.errorMessage).toBeTruthy();
    expect(response.body.errorMessage).toContain(
      "This product has already been inserted."
    );
  });
  describe("test on bad requests", () => {
    test("should return 400 for empty string name", async () => {
      const invalidProductData = {
        name: "",
      };

      const response = await request(app)
        .put(`/api/product/${new ObjectId().toString()}`)
        .send(invalidProductData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "Product's name cannot be an empty string."
      );
    });
    test("should return 400 for non-string name", async () => {
      const invalidProductData = {
        name: 123,
      };

      const response = await request(app)
        .put(`/api/product/${new ObjectId().toString()}`)
        .send(invalidProductData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "Product's name must be a string."
      );
    });
    test("should return 400 without name's path", async () => {
      const invalidProductData = {};

      const response = await request(app)
        .put(`/api/product/${new ObjectId().toString()}`)
        .send(invalidProductData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain("Path 'name' is required.");
    });
    test("should return 400 for unallowed path", async () => {
      const invalidProductData = {
        name: "new product",
        unallowedPath: "",
      };

      const response = await request(app)
        .put(`/api/product/${new ObjectId().toString()}`)
        .send(invalidProductData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "Path not allowed: unallowedPath. Please remove it."
      );
    });
    test("should return 400 for invalid ID", async () => {
      const response = await request(app).put("/api/product/123").expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "Invalid format for the product's ID: 123."
      );
    });
  });
});

describe("DELETE /api/product/:id", () => {
  test("should return 404 for non-existing product", async () => {
    const _id = new ObjectId().toString();
    Product.findByIdAndDelete.mockResolvedValue(null);

    const response = await request(app)
      .delete(`/api/product/${_id}`)
      .expect(404);

    expect(response.body.errorMessage).toBeTruthy();
    expect(response.body.errorMessage).toContain(
      `Cannot find any product with this id : ${_id}`
    );
  });

  test("should return 201 for successfull deletion", async () => {
    const existingProduct = {
      _id: new ObjectId().toString(),
      name: "Existing Product",
    };

    Product.findByIdAndDelete.mockResolvedValue(existingProduct);

    const response = await request(app)
      .delete(`/api/product/${existingProduct._id}`)
      .expect(200);

    expect(response.body.name).toBe(existingProduct.name);
  });
  test("should return 400 for invalid ID", async () => {
    const response = await request(app).delete("/api/product/123").expect(400);

    expect(response.body.errorMessage).toBeTruthy();
    expect(response.body.errorMessage).toContain(
      "Invalid format for the product's ID: 123."
    );
  });
});

describe("GET /api/products/:id?", () => {
  describe("GET /api/products", () => {
    test("should return 200 for successful research", async () => {
      const products = [
        { _id: new ObjectId().toString(), name: "Product 1" },
        { _id: new ObjectId().toString(), name: "Product 2" },
      ];
      Product.find.mockResolvedValue(products);

      const response = await request(app).get("/api/products").expect(200);

      expect(Product.find).toHaveBeenCalledWith();
      expect(response.body).toEqual(products);
    });
    test("should return 404 for no one product found", async () => {
      Product.find.mockResolvedValue(null);

      const response = await request(app).get("/api/products").expect(404);

      expect(response.body.message).toBeTruthy();
      expect(response.body.message).toContain("There isn't any product.");
    });
  });
  describe("GET /api/products/:id", () => {
    test("should return 200 for successful research", async () => {
      const product = {
        _id: new ObjectId().toString(),
        name: "Product",
      };

      Product.findById.mockResolvedValue(product);

      const response = await request(app)
        .get(`/api/products/${product._id}`)
        .expect(200);

      expect(Product.findById).toHaveBeenCalledWith(product._id);
      expect(response.body).toEqual(product);
    });
    test("should return 404 for no one product found", async () => {
      const _id = new ObjectId().toString();

      Product.findById.mockResolvedValue(null);

      const response = await request(app)
        .get(`/api/products/${_id}`)
        .expect(404);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        `Cannot find any product with this id : ${_id}`
      );
    });
    test("should return 400 for invalid ID", async () => {
      const response = await request(app).get("/api/products/123").expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "Invalid format for the product's ID: 123."
      );
    });
  });
});
