const express = require("express");
const helmet = require("helmet");

const app = express();
const productRouter = require("./routes/productRoute");
const userRouter = require("./routes/userRoute");
const orderRouter = require("./routes/orderRoute");

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", productRouter);
app.use("/api", userRouter);
app.use("/api", orderRouter);

module.exports = app;
