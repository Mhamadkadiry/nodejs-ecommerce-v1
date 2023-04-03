const mongoose = require("mongoose");

//connect database
const dbConnection = () => {
  mongoose.connect(process.env.DB_LINK).then((conn) => {
    console.log(`Database Connected: ${conn.connection.host}`);
  });
  // .catch((err) => {
  //   console.error(`Database Error: ${err}`);
  //   process.exit(1);
  // });
};

module.exports = dbConnection;
