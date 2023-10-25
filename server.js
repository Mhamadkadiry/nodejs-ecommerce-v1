const path = require("path");
const dotenv = require("dotenv");

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const dbConnection = require("./config/database");
const mountRoutes = require("./routes");
const ApiError = require("./utils/apiError");
const errorMiddleware = require("./middlewares/errorMiddlware");
const { webhookCheckout } = require("./services/orderService");

//Because the enviroment file is named config.env if it's
//named .env you don't need this line
dotenv.config({ path: "config.env" });

//Database connection
dbConnection();

// Express app
const app = express();

// Enable corshe
app.use(cors());
app.options("*", cors());

// Compress all responses
app.use(compression());

// Checkout webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);
// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount
mountRoutes(app);

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
