const express = require("express");
const auth=require("./routes/auth");
const chat=require("./routes/chat");
const errorMiddleware=require("./middlewares/error");
const path = require("path");
const cors=require("cors");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cors({origin: "*",credentials: true}));
// app.use(cors({origin: ["http://localhost:5173","http://localhost:8080"],credentials: true}));

app.use(express.json());
app.use(cookieParser());

app.use("/user",auth);

app.use("/chat",chat);

app.use(express.static(path.join(__dirname,'../frontend/dist')));
app.get("*",(req,res)=>{
  res.sendFile(path.resolve(__dirname,'../frontend/dist/index.html'));
})

app.use(errorMiddleware);

module.exports= app;

