const express = require("express");
const auth=require("./routes/auth");
const chat=require("./routes/chat");
const errorMiddleware=require("./middlewares/error");
const cors=require("cors");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cors({origin: "http://localhost:5173",credentials: true}));

app.use(express.json());
app.use(cookieParser());

app.use("/user",auth);

app.use("/chat",chat);

app.use(errorMiddleware);

module.exports= app;

