const request = require("supertest");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const app = require("../../app");
const { User } = require("../../models/userSchema");

jest.mock("../../models/userSchema", () => {
  const originalModel = jest.requireActual("../../models/userSchema");
  return {
    ...originalModel,
    User: {
      ...originalModel.User,
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

describe("POST /api/user", () => {
  test("should return 201 for user created", async () => {
    const userData = {
      name: "name",
      lastName: "lastname",
      email: "example@email.com",
    };

    User.create.mockResolvedValue({
      _id: "someid",
      name: userData.name,
      lastName: userData.lastName,
      email: userData.email,
    });

    const response = await request(app)
      .post("/api/user")
      .send(userData)
      .expect(201);

    expect(response.body.name).toBe(userData.name);
    expect(User.create).toHaveBeenCalledWith(userData);
  });
  test("should return 409 if user's email already exists", async () => {
    const existingUser = {
      name: "name",
      lastName: "lastname",
      email: "existing@email.com",
    };

    User.exists.mockResolvedValue(existingUser);
    User.create.mockRejectedValue({ code: 11000 });

    const response = await request(app)
      .post("/api/user")
      .send(existingUser)
      .expect(409);

    expect(response.body.errorMessage).toBeTruthy();
    expect(response.body.errorMessage).toContain(
      "This email is already registered. Please retry."
    );
  });
  describe("tests on bad requests", () => {
    test("should return 400 for empty-string user's name", async () => {
      const invalidUserData = {
        name: "",
        lastName: "last name",
        email: "example@email.com",
      };

      const response = await request(app)
        .post("/api/user")
        .send(invalidUserData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "User's name cannot be an empty string."
      );
    });
    test("should return 400 for empty-string user's last name", async () => {
      const invalidUserData = {
        name: "name",
        lastName: "",
        email: "example@email.com",
      };

      const response = await request(app)
        .post("/api/user")
        .send(invalidUserData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "User's last name cannot be an empty string."
      );
    });
    test("should return 400 for empty-string user's email", async () => {
      const invalidUserData = {
        name: "name",
        lastName: "lastname",
        email: "",
      };

      const response = await request(app)
        .post("/api/user")
        .send(invalidUserData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "User's email cannot be an empty string."
      );
    });
    test("should return 400 for non-string name", async () => {
      const invalidUserData = {
        name: 123,
        lastName: "lastName",
        email: "example@email.com",
      };

      const response = await request(app)
        .post("/api/user")
        .send(invalidUserData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "User's name must be a string."
      );
    });
    test("should return 400 for non-string last name", async () => {
      const invalidUserData = {
        name: "name",
        lastName: 123,
        email: "example@email.com",
      };

      const response = await request(app)
        .post("/api/user")
        .send(invalidUserData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "User's last name must be a string."
      );
    });
    test("should return 400 for non-string email", async () => {
      const invalidUserData = {
        name: "name",
        lastName: "lastName",
        email: 123,
      };

      const response = await request(app)
        .post("/api/user")
        .send(invalidUserData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "User's email must be a string."
      );
    });
    test("should return 400 for request without name's path", async () => {
      const invalidUserData = {
        lastName: "lastName",
        email: "example@email.com",
      };

      const response = await request(app)
        .post("/api/user")
        .send(invalidUserData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain("Path 'name' is required.");
    });
    test("should return 400 for request without lastName's path", async () => {
      const invalidUserData = {
        name: "name",
        email: "example@email.com",
      };

      const response = await request(app)
        .post("/api/user")
        .send(invalidUserData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "Path 'lastName' is required."
      );
    });
    test("should return 400 for request without email's path", async () => {
      const invalidUserData = {
        name: "name",
        lastName: "last name",
      };

      const response = await request(app)
        .post("/api/user")
        .send(invalidUserData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain("Path 'email' is required.");
    });
    test("should return 400 for invalid name", async () => {
      const invalidUserData = {
        name: "n",
        lastName: "last name",
        email: "example@email.com",
      };

      const response = await request(app)
        .post("/api/user")
        .send(invalidUserData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "Invalid format for user's name. Length must be between 2 and 25 characters."
      );
    });
    test("should return 400 for invalid last name", async () => {
      const invalidUserData = {
        name: "name",
        lastName: "l",
        email: "example@email.com",
      };

      const response = await request(app)
        .post("/api/user")
        .send(invalidUserData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "Invalid format for user's last name. Length must be between 2 and 25 characters."
      );
    });
    test("should return 400 for invalid email", async () => {
      const invalidUserData = {
        name: "name",
        lastName: "last name",
        email: "invalid",
      };

      const response = await request(app)
        .post("/api/user")
        .send(invalidUserData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "Please enter a valid email."
      );
    });
    test("should return 400 for unallowed path", async () => {
      const invalidUserData = {
        name: "name",
        lastName: "last name",
        email: "example@email.com",
        unallowedPath: "",
      };

      const response = await request(app)
        .post("/api/user")
        .send(invalidUserData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "Path not allowed: unallowedPath. Please remove it."
      );
    });
  });
});

//---------------------------------------------------------------
describe("PUT /api/user/:id", () => {
  test("should return 200 for successful update", async () => {
    const existingUser = {
      _id: new ObjectId().toString(),
      name: "name",
      lastName: "lastname",
      email: "example@email.com",
    };

    const newUserData = {
      name: "new name",
    };

    User.findByIdAndUpdate.mockResolvedValue({
      ...existingUser,
      ...newUserData,
    });

    const response = await request(app)
      .put(`/api/user/${existingUser._id}`)
      .send(newUserData)
      .expect(200);

    expect(response.body.name).toBe(newUserData.name);
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      existingUser._id,
      newUserData,
      { new: true }
    );
  });
  test("should return 404 for non-existing user", async () => {
    const _id = new ObjectId().toString();

    const updateData = {
      name: "new name",
    };

    User.findByIdAndUpdate.mockResolvedValue(null);

    const response = await request(app)
      .put(`/api/user/${_id}`)
      .send(updateData)
      .expect(404);

    expect(response.body.errorMessage).toBeTruthy();
    expect(response.body.errorMessage).toContain(
      `Cannot find any user with this id : ${_id}`
    );
  });
  test("should return 409 if email already exists", async () => {
    const existingUser = {
      _id: new ObjectId().toString(),
      name: "name",
      lastName: "lastname",
      email: "example@email.com",
    };

    const updateData = {
      email: "existing@email.com",
    };

    User.exists.mockResolvedValue(existingUser);
    User.findByIdAndUpdate.mockRejectedValue({ code: 11000 });

    const response = await request(app)
      .put(`/api/user/${new ObjectId().toString()}`)
      .send(updateData)
      .expect(409);

    expect(response.body.errorMessage).toBeTruthy();
    expect(response.body.errorMessage).toContain(
      "This email is already registered. Please retry."
    );
  });
  describe("test on bad requests", () => {
    test("should return 400 for empty-string user's name", async () => {
      const invalidUserData = {
        name: "",
      };

      const response = await request(app)
        .put(`/api/user/${new ObjectId().toString()}`)
        .send(invalidUserData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "User's name cannot be an empty string."
      );
    });
    test("should return 400 for empty-string user's last name", async () => {
      const invalidUserData = {
        lastName: "",
      };

      const response = await request(app)
        .put(`/api/user/${new ObjectId().toString()}`)
        .send(invalidUserData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "User's last name cannot be an empty string."
      );
    });
    test("should return 400 for empty-string user's email", async () => {
      const invalidUserData = {
        email: "",
      };

      const response = await request(app)
        .put(`/api/user/${new ObjectId().toString()}`)
        .send(invalidUserData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "User's email cannot be an empty string."
      );
    });
    test("should return 400 for non-string name", async () => {
      const invalidUserData = {
        name: 123,
      };

      const response = await request(app)
        .put(`/api/user/${new ObjectId().toString()}`)
        .send(invalidUserData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "User's name must be a string."
      );
    });
    test("should return 400 for non-string last name", async () => {
      const invalidUserData = {
        lastName: 123,
      };

      const response = await request(app)
        .put(`/api/user/${new ObjectId().toString()}`)
        .send(invalidUserData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "User's last name must be a string."
      );
    });
    test("should return 400 for non-string email", async () => {
      const invalidUserData = {
        email: 123,
      };

      const response = await request(app)
        .put(`/api/user/${new ObjectId().toString()}`)
        .send(invalidUserData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "User's email must be a string."
      );
    });
    test("should return 400 for unallowed path", async () => {
      const invalidUserData = {
        name: "new name",
        unallowedPath: "",
      };

      const response = await request(app)
        .put(`/api/user/${new ObjectId().toString()}`)
        .send(invalidUserData)
        .expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "Path not allowed: unallowedPath. Please remove it."
      );
    });
    test("should return 400 for invalid ID", async () => {
      const response = await request(app).put("/api/user/123").expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "Invalid format for the user's ID: 123."
      );
    });
  });
});

describe("DELETE /api/user", () => {
  test("should return 201 for successfull deletion", async () => {
    const existingUser = {
      _id: new ObjectId().toString(),
      name: "name",
      lastName: "lastname",
      email: "example@email.com",
    };

    User.findByIdAndDelete.mockResolvedValue(existingUser);

    const response = await request(app)
      .delete(`/api/user/${existingUser._id}`)
      .expect(200);

    expect(response.body.name).toBe(existingUser.name);
  });
  test("should return 404 for non-existing user", async () => {
    const _id = new ObjectId().toString();
    User.findByIdAndDelete.mockResolvedValue(null);

    const response = await request(app).delete(`/api/user/${_id}`).expect(404);

    expect(response.body.errorMessage).toBeTruthy();
    expect(response.body.errorMessage).toContain(
      `Cannot find any user with this id : ${_id}`
    );
  });
  test("should return 400 for invalid ID", async () => {
    const response = await request(app).delete("/api/user/123").expect(400);

    expect(response.body.errorMessage).toBeTruthy();
    expect(response.body.errorMessage).toContain(
      "Invalid format for the user's ID: 123."
    );
  });
});

describe("GET /api/users/:id?", () => {
  describe("GET /api/users", () => {
    test("should return 200 for successful research", async () => {
      const users = [
        {
          _id: new ObjectId().toString(),
          name: "name",
          lastName: "last name",
          email: "example1@email.com",
        },
        {
          _id: new ObjectId().toString(),
          name: "name",
          lastName: "last name",
          email: "example2@email.com",
        },
      ];
      User.find.mockResolvedValue(users);

      const response = await request(app).get("/api/users").expect(200);

      expect(User.find).toHaveBeenCalledWith();
      expect(response.body).toEqual(users);
    });
    test("should return 404 for no one user found", async () => {
      User.find.mockResolvedValue(null);

      const response = await request(app).get("/api/users").expect(404);

      expect(response.body.message).toBeTruthy();
      expect(response.body.message).toContain("There isn't any user.");
    });
  });
  describe("GET /api/users/:id", () => {
    test("should return 200 for successful research", async () => {
      const user = {
        _id: new ObjectId().toString(),
        name: "name",
        lastName: "last name",
        email: "example@email.com",
      };

      User.findById.mockResolvedValue(user);

      const response = await request(app)
        .get(`/api/users/${user._id}`)
        .expect(200);

      expect(User.findById).toHaveBeenCalledWith(user._id);
      expect(response.body).toEqual(user);
    });
    test("should return 404 for no one user found", async () => {
      const _id = new ObjectId().toString();

      User.findById.mockResolvedValue(null);

      const response = await request(app).get(`/api/users/${_id}`).expect(404);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        `Cannot find any user with this id : ${_id}`
      );
    });
    test("should return 400 for invalid ID", async () => {
      const response = await request(app).get("/api/users/123").expect(400);

      expect(response.body.errorMessage).toBeTruthy();
      expect(response.body.errorMessage).toContain(
        "Invalid format for the user's ID: 123."
      );
    });
  });
});
