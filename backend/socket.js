const socketIO = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const User = require("./model/userModel");
const Chat = require("./model/chatModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
var cookie = require("cookie")

let userConectSocket;

const initializeSocket = (server) => {
  io = socketIO(server, {
    pingTineOut: 60000,
    cors: {
      origin: "http://localhost:5173",
      credentials: true
    },
  });
  instrument(io, {
    auth: false,
  });

  const getToken=(socket)=>{
    const pattern = RegExp("token=.[^;]*");
     const matched = socket.handshake.headers.cookie.match(pattern);
     console.log("matched:", matched)
    if(matched){
        const [, token] = matched?.[0]?.split("=");
        return token;
    }
    // const value=socket.handshake.headers.cookie;
    // console.log("value:", value)
    // const searchParams = new URLSearchParams(value);
    // console.log("searchParams:", searchParams)
    
    // var myObject = {};
    // searchParams.forEach((value, key)=> {
    //   myObject[key] = value;
    // });
    // console.log(myObject)
    
  }

  userConectSocket = io.of("/UserConnect");

  userConectSocket.on("connection", async (socket) => {
   const token=getToken(socket);
  //  const pattern = RegExp("token=.[^;]*");
    // const matched = document.cookie.match(pattern);
    // if(matched){
    //     const [, token] = matched?.[0]?.split("=");
    console.log("token:", token)
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
    socket.on("delete message",async(data,callback) => {
      console.log("data:", data)
      const chatId=new mongoose.Types.ObjectId(data.id);
      	const chat=await Chat.findOneAndDelete({_id:chatId,sendedBy:{$eq:userId}});
      	if(!chat){
      	  return callback({error:"Couldn't find the chat"});
      	}
      	const participants=chat.participants.filter(id=>id!=userId);
    	
      	const {isOnline}=await User.findById(participants[0]);
      	if(isOnline){
      	  socket.to(participants[0].toString()).emit("delete-msg", chat._id );
      	}
      	return callback({chat:'chat deleted successfully',id:chat._id});

    })

    socket.on("getSpecificChat",async(data,callback)=>{
      // const {
      //   params: { toId },
      //   user: { id },
      // } = req;
      const skip=data.skip?data.skip:0
      const toUser = await User.findById(data.id);
      // if (!toUser) {
      //   return next(new ErrorHandler("Recived ID is not found"));
      // }
      const toIdUser = new mongoose.Types.ObjectId(data.id);
      const idUser = new mongoose.Types.ObjectId(id);

      const dataForCount=await Chat.find({ participants: { $all: [toIdUser, idUser] } }).count();
      const pageNumber = Math.ceil(dataForCount / 10);
      const currentPage=Number(skip)||1;
      const skipPage=10*(currentPage-1);
      const skipCala=Number((dataForCount-(10*currentPage)<=0)? 0 : dataForCount-(10*currentPage));
      console.log("skipCala:", skipCala)
      const chat = await Chat.find({ participants: { $all: [toIdUser, idUser] } }).sort({createdAt:-1 }).limit(10).skip(skipCala);
      // const chat = await Chat.find({ participants: { $all: [toIdUser, idUser] } }).sort({createdAt:-1 }).limit(10).skip(skipCala).sort({createdAt:1 });
      // console.log("chat:", chat)
      callback({data:chat,nextPage: currentPage >= pageNumber ? null : currentPage + 1});
    })
    
    socket.on("typing",data=>{
     socket.to(data).emit("typing",id);
    });
    socket.on("stop typing",data=>{
      socket.to(data).emit("stop typing",false);
    });
    socket.on("disconnect", async () => {
      console.log(token)
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