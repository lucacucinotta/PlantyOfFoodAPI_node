const request = require("supertest");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const app = require("../../app");
const { Order } = require("../../models/orderSchema");
const { Product } = require("../../models/productSchema");
const { User } = require("../../models/userSchema");

jest.mock("../../models/orderSchema", () => {
  const originalModel = jest.requireActual("../../models/orderSchema");
  return {
    ...originalModel,
    Order: {
      ...originalModel.Order,
      create: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      deleteOne: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
    },
  };
});
jest.mock("../../models/productSchema", () => {
  const originalModule = jest.requireActual("../../models/productSchema");
  return {
    ...originalModule,

    Product: {
      ...originalModule.Product,
      exists: jest.fn(),
    },
  };
});
jest.mock("../../models/userSchema", () => {
  const originalModel = jest.requireActual("../../models/userSchema");
  return {
    ...originalModel,
    User: {
      ...originalModel.User,
      exists: jest.fn(),
    },
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST /api/orders", () => {
  test("should return 201 for create a new order", async () => {
    const _id = new ObjectId().toString();
    const mockOrderData = {
      products: [new ObjectId().toString()],
      users: [new ObjectId().toString()],
    };

    Product.exists.mockResolvedValue(true);
    User.exists.mockResolvedValue(true);

    Order.create.mockResolvedValue({
      _id: _id,
      ...mockOrderData,
    });

    const mockPopulateOrder = {
      _id: _id,
      products: [
        {
          _id: mockOrderData.products[0],
          name: "name",
        },
      ],
      users: [
        {
          _id: mockOrderData.users[0],
          name: "name",
          lastName: "last name",
          email: "example@email.com",
        },
      ],
    };

    Order.findById.mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(mockPopulateOrder),
    }));

    const response = await request(app)
      .post("/api/orders")
      .send(mockOrderData)
      .expect(201);

    expect(response.body).toEqual(mockPopulateOrder);
    expect(Order.create).toHaveBeenCalledWith(mockOrderData);
    expect(Order.findById).toHaveBeenCalledWith(_id);
  });

  describe("tests for bad requests", () => {
    describe("tests for no path ", () => {
      test("should return 400 due to missing 'products' path", async () => {
        const invalidOrderData = {
          users: [new ObjectId().toString()],
        };

        const response = await request(app)
          .post("/api/orders")
          .send(invalidOrderData)
          .expect(400);

        expect(response.body.errorMessage).toBeTruthy();
        expect(response.body.errorMessage).toContain(
          "Path 'products' is required."
        );
      });
      test("should return 400 due to missing 'users' path", async () => {
        const invalidOrderData = {
          products: [new ObjectId().toString()],
        };

        const response = await request(app)
          .post("/api/orders")
          .send(invalidOrderData)
          .expect(400);

        expect(response.body.errorMessage).toBeTruthy();
        expect(response.body.errorMessage).toContain(
          "Path 'users' is required."
        );
      });
    });

    describe("tests for missing ID", () => {
      test("should return 400 due to missing 'products' ID", async () => {
        const invalidOrderData = {
          products: [],
          users: [new ObjectId().toString()],
        };

        const response = await request(app)
          .post("/api/orders")
          .send(invalidOrderData)
          .expect(400);

        expect(response.body.errorMessage).toBeTruthy();
        expect(response.body.errorMessage).toContain(
          "Path 'products' must contain at least one element."
        );
      });
      test("should return 400 due to missing 'users' ID", async () => {
        const invalidOrderData = {
          products: [new ObjectId().toString()],
          users: [],
        };

        const response = await request(app)
          .post("/api/orders")
          .send(invalidOrderData)
          .expect(400);

        expect(response.body.errorMessage).toBeTruthy();
        expect(response.body.errorMessage).toContain(
          "Path 'users' must contain at least one element."
        );
      });
    });

    describe("tests for empty string ", () => {
      test("should return 400 for an empty 'product' ID", async () => {
        const invalidOrderData = {
          products: [""],
          users: [new ObjectId().toString()],
        };

        const response = await request(app)
          .post("/api/orders")
          .send(invalidOrderData)
          .expect(400);

        expect(response.body.errorMessage).toBeTruthy();
        expect(response.body.errorMessage).toContain(
          "Product ID cannot be an empty string."
        );
      });
      test("should return 400 for empty 'user' ID", async () => {
        const invalidOrderData = {
          products: [new ObjectId().toString()],
          users: [""],
        };

        const response = await request(app)
          .post("/api/orders")
          .send(invalidOrderData)
          .expect(400);

        expect(response.body.errorMessage).toBeTruthy();
        expect(response.body.errorMessage).toContain(
          "User ID cannot be an empty string."
        );
      });
      test("should return 400 for empty date", async () => {
        const invalidOrderData = {
          products: [new ObjectId().toString()],
          users: [new ObjectId().toString()],
          date: "",
        };

        const response = await request(app)
          .post("/api/orders")
          .send(invalidOrderData)
          .expect(400);

        expect(response.body.errorMessage).toBeTruthy();
        expect(response.body.errorMessage).toContain(
          "Date cannot be an empty string."
        );
      });
    });

    describe("tests for invalid ID and date's path", () => {
      test("should return 400 for an invalid 'product' ID", async () => {
        const invalidOrderData = {
          products: ["invalid"],
          users: [new ObjectId().toString()],
        };

        const response = await request(app)
          .post("/api/orders")
          .send(invalidOrderData)
          .expect(400);

        expect(response.body.errorMessage).toBeTruthy();
        expect(response.body.errorMessage).toContain(
          `Invalid format for the product's ID: '${invalidOrderData.products[0]}'.`
        );
      });
      test("should return 400 for an invalid 'user' ID", async () => {
        const invalidOrderData = {
          products: [new ObjectId().toString()],
          users: ["invalid"],
        };

        const response = await request(app)
          .post("/api/orders")
          .send(invalidOrderData)
          .expect(400);

        expect(response.body.errorMessage).toBeTruthy();
        expect(response.body.errorMessage).toContain(
          `Invalid format for the user's ID: '${invalidOrderData.users[0]}'.`
        );
      });
      test("should return 400 for an invalid date", async () => {
        const invalidOrderData = {
          products: [new ObjectId().toString()],
          users: [new ObjectId().toString()],
          date: "04-01-1970",
        };

        const response = await request(app)
          .post("/api/orders")
          .send(invalidOrderData)
          .expect(400);

        expect(response.body.errorMessage).toBeTruthy();
        expect(response.body.errorMessage).toContain(
          "Date must be in the format YYYY-MM-DD."
        );
      });
      test("should return 400 for an unallowed path", async () => {
        const invalidOrderData = {
          products: [new ObjectId().toString()],
          users: [new ObjectId().toString()],
          unallowed: "",
        };

        const response = await request(app)
          .post("/api/orders")
          .send(invalidOrderData)
          .expect(400);

        expect(response.body.errorMessage).toBeTruthy();
        expect(response.body.errorMessage).toContain(
          "Path not allowed: unallowed. Please remove it."
        );
      });
    });

    describe("tests on ID that doesn't exists in DB", () => {
      test("should return 400 due to missing 'product' id in database", async () => {
        const mockOrderData = {
          products: [new ObjectId().toString()],
          users: [new ObjectId().toString()],
        };

        Product.exists.mockResolvedValue(false);
        User.exists.mockResolvedValue(true);

        const response = await request(app)
          .post("/api/orders")
          .send(mockOrderData)
          .expect(400);

        expect(response.body.errorMessage).toBeTruthy();
        expect(response.body.errorMessage).toContain(
          `Product's ID ${mockOrderData.products[0]} doesn't exists.`
        );
      });
      test("should return 400 due to missing 'user' id in database", async () => {
        const mockOrderData = {
          products: [new ObjectId().toString()],
          users: [new ObjectId().toString()],
        };

        Product.exists.mockResolvedValue(true);
        User.exists.mockResolvedValue(false);

        const response = await request(app)
          .post("/api/orders")
          .send(mockOrderData)
          .expect(400);

        expect(response.body.errorMessage).toBeTruthy();
        expect(response.body.errorMessage).toContain(
          `User's ID ${mockOrderData.users[0]} doesn't exists.`
        );
      });
    });
  });
});

describe("PUT /api/orders/:id", () => {
  test("should return 200 for successful update", async () => {
    const existingOrder = {
      _id: new ObjectId().toString(),
      products: [new ObjectId().toString()],
      users: [new ObjectId().toString()],
      date: "1970-01-01",
    };

    const newOrderData = {
      products: [new ObjectId().toString()],
    };

    Product.exists.mockResolvedValue(true);
    User.exists.mockResolvedValue(true);

    Order.findByIdAndUpdate.mockResolvedValue({
      ...existingOrder,
      ...newOrderData,
    });

    const mockPopulateOrder = {
      _id: existingOrder._id,
      products: [
        {
          _id: newOrderData.products[0],
          name: "name",
        },
      ],
      users: [
        {
          _id: existingOrder.users[0],
          name: "name",
          lastName: "last name",
          email: "example@email.com",
        },
      ],
    };

    Order.findById.mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(mockPopulateOrder),
    }));

    const response = await request(app)
      .put(`/api/orders/${existingOrder._id}`)
      .send(newOrderData)
      .expect(200);

    expect(response.body).toEqual(mockPopulateOrder);
    expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(
      existingOrder._id,
      newOrderData,
      { new: true }
    );
    expect(Order.findById).toHaveBeenCalledWith(mockPopulateOrder._id);
  });
  test("should return 404 for non-existing order", async () => {
    const _id = new ObjectId().toString();

    Order.findByIdAndUpdate.mockResolvedValue(null);

    const response = await request(app).put(`/api/orders/${_id}`).expect(404);

    expect(response.body.errorMessage).toBeTruthy();
    expect(response.body.errorMessage).toContain(
      `Cannot find any order with this id : ${_id}`
    );
  });

  describe("tests on bad requests", () => {
    describe("tests for missing ID", () => {
      test("should return 400 due to missing 'products' ID", async () => {
        const invalidOrderData = {
          products: [],
        };

        const response = await request(app)
          .put(`/api/orders/${new ObjectId().toString()}`)
          .send(invalidOrderData)
          .expect(400);

        expect(response.body.errorMessage).toBeTruthy();
        expect(response.body.errorMessage).toContain(
          "Path 'products' must contain at least one element."
        );
      });
      test("should return 400 due to missing 'users' ID", async () => {
        const invalidOrderData = {
          users: [],
        };

        const response = await request(app)
          .put(`/api/orders/${new ObjectId().toString()}`)
          .send(invalidOrderData)
          .expect(400);

        expect(response.body.errorMessage).toBeTruthy();
        expect(response.body.errorMessage).toContain(
          "Path 'users' must contain at least one element."
        );
      });
    });

    describe("tests for empty string ", () => {
      test("should return 400 for an empty 'product' ID", async () => {
        const invalidOrderData = {
          products: [""],
        };

        const response = await request(app)
          .put(`/api/orders/${new ObjectId().toString()}`)
          .send(invalidOrderData)
          .expect(400);

        expect(response.body.errorMessage).toBeTruthy();
        expect(response.body.errorMessage).toContain(
          "Product ID cannot be an empty string."
        );
      });
      test("should return 400 for empty 'user' ID", async () => {
        const invalidOrderData = {
          users: [""],
        };

        const response = await request(app)
          .put(`/api/orders/${new ObjectId().toString()}`)
          .send(invalidOrderData)
          .expect(400);

        expect(response.body.errorMessage).toBeTruthy();
        expect(response.body.errorMessage).toContain(
          "User ID cannot be an empty string."
        );
      });
      test("should return 400 for empty date", async () => {
        const invalidOrderData = {
          date: "",
        };

        const response = await request(app)
          .put(`/api/orders/${new ObjectId().toString()}`)
          .send(invalidOrderData)
          .expect(400);

        expect(response.body.errorMessage).toBeTruthy();
        expect(response.body.errorMessage).toContain(
          "Date cannot be an empty string."
        );
      });
    });

    describe("tests for invalid ID and date's path", () => {
      test("should return 400 for an invalid 'product' ID", async () => {
        const invalidOrderData = {
          products: ["invalid"],
        };

        const response = await request(app)
          .put(`/api/orders/${new ObjectId().toString()}`)
          .send(invalidOrderData)
          .expect(400);

        expect(response.body.errorMessage).toBeTruthy();
        expect(response.body.errorMessage).toContain(
          `Invalid format for the product's ID: '${invalidOrderData.products[0]}'.`
        );
      });
      test("should return 400 for an invalid 'user' ID", async () => {
        const invalidOrderData = {
          users: ["invalid"],
        };

        const response = await request(app)
          .put(`/api/orders/${new ObjectId().toString()}`)
          .send(invalidOrderData)
          .expect(400);

        expect(response.body.errorMessage).toBeTruthy();
        expect(response.body.errorMessage).toContain(
          `Invalid format for the user's ID: '${invalidOrderData.users[0]}'.`
        );
      });
      test("should return 400 for an invalid date", async () => {
        const invalidOrderData = {
          date: "04-01-1970",
        };

        const response = await request(app)
          .put(`/api/orders/${new ObjectId().toString()}`)
          .send(invalidOrderData)
          .expect(400);

        expect(response.body.errorMessage).toBeTruthy();
        expect(response.body.errorMessage).toContain(
          "Date must be in the format YYYY-MM-DD."
        );
      });
      test("should return 400 for an unallowed path", async () => {
        const invalidOrderData = {
          unallowed: "",
        };

        const response = await request(app)
          .put(`/api/orders/${new ObjectId().toString()}`)
          .send(invalidOrderData)
          .expect(400);

        expect(response.body.errorMessage).toBeTruthy();
        expect(response.body.errorMessage).toContain(
          "Path not allowed: unallowed. Please remove it."
        );
      });
    });

    describe("tests on ID that doesn't exists in DB", () => {
      test("should return 400 due to missing 'product' id in database", async () => {
        const mockOrderData = {
          products: [new ObjectId().toString()],
        };

        Product.exists.mockResolvedValue(false);

        const response = await request(app)
          .put(`/api/orders/${new ObjectId().toString()}`)
          .send(mockOrderData)
          .expect(400);

        expect(response.body.errorMessage).toBeTruthy();
        expect(response.body.errorMessage).toContain(
          `Product's ID ${mockOrderData.products[0]} doesn't exists.`
        );
      });
      test("should return 400 due to missing 'user' id in database", async () => {
        const mockOrderData = {
          users: [new ObjectId().toString()],
        };

        User.exists.mockResolvedValue(false);

        const response = await request(app)
          .put(`/api/orders/${new ObjectId().toString()}`)
          .send(mockOrderData)
          .expect(400);

        expect(response.body.errorMessage).toBeTruthy();
        expect(response.body.errorMessage).toContain(
          `User's ID ${mockOrderData.users[0]} doesn't exists.`
        );
      });
    });
  });
});

describe("DELETE /api/user/:id", () => {
  test("should return 200 for successfull deletion", async () => {
    const existingOrder = {
      _id: new ObjectId().toString(),
      products: [new ObjectId().toString()],
      users: [new ObjectId().toString()],
      date: "1970-01-01",
    };

    const mockPopulateOrder = {
      _id: existingOrder._id,
      products: [
        {
          _id: existingOrder.products[0],
          name: "name",
        },
      ],
      users: [
        {
          _id: existingOrder.users[0],
          name: "name",
          lastName: "last name",
          email: "example@email.com",
        },
      ],
      date: existingOrder.date,
    };

    Order.findById.mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(mockPopulateOrder),
    }));

    Order.deleteOne.mockResolvedValueOnce({
      acknowledged: true,
      deletedCount: 1,
    });

    const response = await request(app)
      .delete(`/api/orders/${existingOrder._id}`)
      .expect(200);

    expect(response.body).toEqual(mockPopulateOrder);
    expect(Order.deleteOne).toHaveBeenCalledWith(mockPopulateOrder);
  });
  test("should return 400 for invalid order's ID", async () => {
    const response = await request(app).delete("/api/orders/123").expect(400);

    expect(response.body.errorMessage).toBeTruthy();
    expect(response.body.errorMessage).toContain(
      "Invalid format for the order's ID: 123."
    );
  });
  test("should return 404 for non-existing order", async () => {
    const _id = new ObjectId().toString();
    Order.findById.mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(null),
    }));

    const response = await request(app)
      .delete(`/api/orders/${_id}`)
      .expect(404);

    expect(response.body.errorMessage).toBeTruthy();
    expect(response.body.errorMessage).toContain(
      `Cannot find any order with this id : ${_id}`
    );
  });
});

describe("GET /api/orders/:id", () => {
  test("should return 200 for successful research", async () => {
    const mockPopulateOrder = {
      _id: new ObjectId().toString(),
      products: [
        {
          _id: new ObjectId().toString(),
          name: "name",
        },
      ],
      users: [
        {
          _id: new ObjectId().toString(),
          name: "name",
          lastName: "last name",
          email: "example@email.com",
        },
      ],
      date: "1970-01-01",
    };

    Order.findById.mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(mockPopulateOrder),
    }));

    const response = await request(app)
      .get(`/api/orders/${mockPopulateOrder._id}`)
      .expect(200);

    expect(response.body).toEqual(mockPopulateOrder);
    expect(Order.findById).toHaveBeenCalledWith(mockPopulateOrder._id);
  });
  test("should return 404 for no one order found", async () => {
    const _id = new ObjectId().toString();

    Order.findById.mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(null),
    }));

    const response = await request(app).get(`/api/orders/${_id}`).expect(404);

    expect(response.body.errorMessage).toBeTruthy();
    expect(response.body.errorMessage).toContain(
      `Cannot find any order with this id : ${_id}`
    );
  });
  test("should return 400 for invalid ID", async () => {
    const response = await request(app).get("/api/orders/123").expect(400);

    expect(response.body.errorMessage).toBeTruthy();
    expect(response.body.errorMessage).toContain(
      "Invalid format for the order's ID: 123."
    );
  });
});

describe("GET /api/orders", () => {
  test("should return 200 for successfull research", async () => {
    const mockPopulateOrder = {
      _id: new ObjectId().toString(),
      products: [
        {
          _id: new ObjectId().toString(),
          name: "name",
        },
      ],
      users: [
        {
          _id: new ObjectId().toString(),
          name: "name",
          lastName: "last name",
          email: "example@email.com",
        },
      ],
      date: "1970-01-01",
    };

    Order.find.mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(mockPopulateOrder),
    }));

    const response = await request(app)
      .get("/api/orders")
      .query(`product=${mockPopulateOrder.products[0]._id}`)
      .expect(200);

    expect(Order.find).toHaveBeenCalledWith({
      products: mockPopulateOrder.products[0]._id,
    });
    expect(response.body).toEqual(mockPopulateOrder);
  });
  test("should return 404 if no orders are found", async () => {
    Order.find.mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue([]),
    }));
    const response = await request(app)
      .get("/api/orders")
      .query({ date: "2024-01-17" })
      .expect(404);

    expect(response.body.errorMessage).toContain("There isn't any order.");
  });
  describe("tests on bad requests for invalid query", () => {
    test("should return 400 for invalid product ID", async () => {
      const response = await request(app)
        .get("/api/orders")
        .query("product=invalidID")
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "Invalid product ID in query."
      );
    });
    test("should return 400 for invalid user ID", async () => {
      const response = await request(app)
        .get("/api/orders")
        .query("user=invalidID")
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain("Invalid user ID in query.");
    });
    test("should return 400 for invalid date", async () => {
      const response = await request(app)
        .get("/api/orders")
        .query("date=01-01-1970")
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "Invalid date in query. Date must be in the format YYYY-MM-DD."
      );
    });
  });
});
