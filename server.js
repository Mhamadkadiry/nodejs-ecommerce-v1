const express = require("express");
const dotenv = require("dotenv");

//Because the enviroment file is named config.env if it's
//named .env you don't need this line
dotenv.config({ path: "config.env" });

const app = express();
app.get("/", (req, res) => {
  res.send("our api 1");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`App running on Port ${PORT}`);
});
