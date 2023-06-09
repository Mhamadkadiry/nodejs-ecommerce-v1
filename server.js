const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const dbConnection = require("./config/database");
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subcategoryRoute");
const brandRoute = require("./routes/brandRoute");
const productRoute = require("./routes/productRoute");
const ApiError = require("./utils/apiError");
const errorMiddleware = require("./middlewares/errorMiddlware");

//Because the enviroment file is named config.env if it's
//named .env you don't need this line
dotenv.config({ path: "config.env" });

//Database connection
dbConnection();

// Express app
const app = express();
// Middlewares
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);

app.all("*", (req, res, next) => {
  // send the error message to the error handling middleware for express errors
  next(new ApiError("This page doesn't exist", 404));
});
// Error handling middleware from express
app.use(errorMiddleware);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running on Port ${PORT}`);
});

// Events
// event listener to the unhandled rejections that aren't related to express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
