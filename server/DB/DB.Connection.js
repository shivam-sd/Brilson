const mongoose = require("mongoose");

const DBConnection = async () => {
  mongoose
    .connect(`${process.env.DB_URI}`)
    .then(() => {
      console.log("Connection.....");
    })
    .then((res) => {
      console.log("DataBase Connected");
    })
    .catch((err) => {
      console.log("Error in DB Connection", err);
    });
};


module.exports = DBConnection;