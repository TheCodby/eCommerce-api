require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const authRoutes = require("./api/routes/auth");
const { connectToServer } = require("./db/db");
const categoryRouter = require("./api/routes/category");
const productRouter = require("./api/routes/product");
const adminRouter = require("./api/routes/admin");
const { verifyUser, verifyAdmin } = require("./api/middlewares/verifyToken");

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined"));

app.use("/auth", authRoutes);
app.use("/product", verifyUser, productRouter);
app.use("/category", verifyUser, categoryRouter);
app.use("/admin", verifyUser, verifyAdmin, adminRouter);
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: error.message,
  });
  return;
});
app.listen(process.env.PORT, async () => {
  await connectToServer();
  console.log(`Successfully connected to port ${process.env.PORT}`);
});
