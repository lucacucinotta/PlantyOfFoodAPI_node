const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT;
const DATABASE = process.env.DATABASE;

mongoose
  .connect(DATABASE)
  .then(() => {
    console.log("Database connected.");
    app.listen(PORT, () => {
      console.log(`Server available at port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Error connecting to database: ${err}`);
  });
