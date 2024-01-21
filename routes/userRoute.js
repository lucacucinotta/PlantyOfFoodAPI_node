const express = require("express");
const {
  postUser,
  putUser,
  deleteUser,
  getUsers,
} = require("../controller/user/userController");

const router = express.Router();

router.post("/user", postUser);
router.put("/user/:id", putUser);
router.delete("/user/:id", deleteUser);
router.get("/users/:id?", getUsers);

module.exports = router;
