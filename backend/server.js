const app = require("./app.js");
const dotenv = require("dotenv");
const path = require("path");
const  connection  = require("./config/dataBase");
const { initializeSocket } = require("./socket.js");

dotenv.config({ path: path.join(__dirname, "config/config.env") });

connection();

const server=app.listen(process.env.PORT, () => {
  console.log(`Server listening to the port on ${process.env.PORT}`);
});

initializeSocket(server);


