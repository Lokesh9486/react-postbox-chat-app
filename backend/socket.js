const socketIO = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const User = require("./model/userModel");
const Chat = require("./model/chatModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

let userConectSocket;

const initializeSocket = (server) => {
  io = socketIO(server, {
    pingTineOut: 60000,
    cors: {
      origin: "*",
    },
  });
  instrument(io, {
    auth: false,
  });

  userConectSocket = io.of("/UserConnect");

  userConectSocket.on("connection", async (socket) => {
    const token = socket.handshake.auth.token;
    console.log("userConectSocket.on ~ token:", token)
    const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    socket.join(id);
    await User.findByIdAndUpdate({ _id: id }, { $set: { isOnline: true} });
    socket.broadcast.emit("onlineUsers", id);
    const userId = new mongoose.Types.ObjectId(id);

  const chat = await Chat.aggregate()
    .match({ participants: userId })
    .addFields({
      otherUser: {
        $filter: {
          input: "$participants",
          as: "otherUsers",
          cond: {
            $ne: ["$$otherUsers", userId],
          },
        },
      },
    })
    .lookup({
      from: "users",
      localField: "otherUser",
      foreignField: "_id",
      as: "chatedUser",
    })
    .unwind("$chatedUser")
    .group({
      _id: "$chatedUser._id",
      message: {
        $last: {
          message: "$message",
          createdAt: "$createdAt",
        },
      },
      chatUser: { $first: "$chatedUser" },
    })
    .project(
      "-chatUser.password -chatUser.OTP -chatUser.OTPExpries -chatUser.createdAt -chatUser.updatedAt -chatUser.__v -chatUser.IsOTPVerfied -_id"
    )
    .sort("-message.createdAt");

    socket.emit("overAllMessage",chat);

    socket.on("send message",async(data,callback)=>{
      const { message, reciver  } = data;
    
      const chat = await Chat.create({
        message,
        participants: [...reciver, id],
        sendedBy: id,
      });
    
      const {isOnline}=await User.findById(reciver);
      
      if(isOnline){
        socket.to(reciver).emit("recieve-msg", { user:{_id:id}, chat,reciver:reciver[0] });
      }
    
      callback(chat)

    })

    socket.on("getSpecificChat",async(data,callback)=>{
      // const {
      //   params: { toId },
      //   user: { id },
      // } = req;
      const toUser = await User.findById(data);
      // if (!toUser) {
      //   return next(new ErrorHandler("Recived ID is not found"));
      // }
      const toIdUser = new mongoose.Types.ObjectId(data);
      const idUser = new mongoose.Types.ObjectId(id);
      const chat = await Chat.find({ participants: { $all: [toIdUser, idUser] } });
      callback(chat);
    })
    
    socket.on("typing",data=>{
     socket.to(data).emit("typing",id);
    });
    socket.on("stop typing",data=>{
      socket.to(data).emit("stop typing",false);
    });
    socket.on("disconnect", async () => {
      const token = socket.handshake.auth.token;
      const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
      await User.findByIdAndUpdate({ _id: id }, { $set: { isOnline: false,lastSeen: Date.now() } });
      socket.broadcast.emit("offlineUsers", id);
      socket.leave(id);
      socket.disconnect();
    });
    
  });
};

const getUserIO = () => {
  if (!userConectSocket) {
    return new Error("Socket.io has not been initilization");
  }
  return userConectSocket;
};

module.exports = { initializeSocket, getUserIO };
