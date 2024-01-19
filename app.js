const express = require("express");
const helmet = require("helmet");

const app = express();
const productRouter = require("./routes/productRoute");

app.use(helmet());
app.use(express.json());

app.use("/api", productRouter);

module.exports = app;
