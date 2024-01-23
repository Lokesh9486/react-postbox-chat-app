const mongoose = require("mongoose");

const connection = () => {
  console.log(process.env.CONNECTION_STRING)
  mongoose
    .connect(process.env.CONNECTION_STRING)
    .then((con) => {
      console.log(`MongoDB id connected to host ${con.connection.host}`);
    })
    .catch((error) => {
      console.log(error.mesage);
    });
};

module.exports = connection;
