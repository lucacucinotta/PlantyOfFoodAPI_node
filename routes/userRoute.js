const express = require("express");
const {
  postUser,
  putUser,
  deleteUser,
  getUsers,
} = require("../controller/user/userController");

const router = express.Router();

router.post("/users", postUser);
router.put("/users/:id", putUser);
router.delete("/users/:id", deleteUser);
router.get("/users/:id?", getUsers);

module.exports = router;
