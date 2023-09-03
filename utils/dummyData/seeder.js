const fs = require("fs");
require("colors");
const dotenv = require("dotenv");
const Product = require("../../models/Product");
const dbConnection = require("../../config/database");

dotenv.config({ path: "../../config.env" });

dbConnection();

const products = JSON.parse(fs.readFileSync("./data.json"));

const insertData = async () => {
  try {
    await Product.create(products);
    console.log("Data Inserted".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data Destroyed".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-i") {
  // node seeder.js -i
  insertData();
} else if (process.argv[2] === "-d") {
  destroyData();
}
