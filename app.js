const express = require("express");
const helmet = require("helmet");

const app = express();
const productRouter = require("./routes/productRoute");
const userRouter = require("./routes/userRoute");

app.use(helmet());
app.use(express.json());

app.use("/api", productRouter);
app.use("/api", userRouter);

module.exports = app;
