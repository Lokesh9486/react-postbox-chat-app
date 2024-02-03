const { default: mongoose } = require("mongoose");
const catchAsyncError = require("../middlewares/catchAsyncError");
const Chat = require("../model/chatModel");
const User = require("../model/userModel");
const { getIO, getUserIO } = require("../socket");
const ErrorHandler = require("../utils/errorHandler");

exports.getChatedUser = catchAsyncError(async (req, res, next) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);

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
  return res.status(200).json(chat);
});

exports.sendMessage = catchAsyncError(async (req, res, next) => {
  const {
    user,
    body: { message, reciver },
  } = req;

  const chat = await Chat.create({
    message,
    participants: [...reciver, user.id],
    sendedBy: user.id,
  });

  const {isOnline}=await User.findById(reciver);
  
  if(isOnline){
    getUserIO().to(reciver).emit("recieve-msg", { user, chat,reciver:reciver[0] });
  }

  return res.status(200).json(chat);
});

exports.deleteMessage=catchAsyncError(async(req,res,next)=>{
  const userId=new mongoose.Types.ObjectId(req.user.id);
  const chatId=new mongoose.Types.ObjectId(req.body.chatId);
  const chat=await Chat.findOneAndDelete({_id:chatId,sendedBy:{$eq:userId}});
  if(!chat){
    return next(new ErrorHandler("Couldn't find the chat"));
  }
  const participants=chat.participants.filter(id=>id!=req.user.id);

  const {isOnline}=await User.findById(participants[0]);
  if(isOnline){
    getUserIO().to(participants[0].toString()).emit("delete-msg", chat._id );
  }
  return res.status(200).json({chat:'chat deleted successfully',id:chat._id});
});

exports.getMessage = catchAsyncError(async (req, res, next) => {
  const {
    params: { toId },
    user: { id },
  } = req;
  const toUser = await User.findById(toId);
  if (!toUser) {
    return next(new ErrorHandler("Recived ID is not found"));
  }
  const toIdUser = new mongoose.Types.ObjectId(toId);
  const idUser = new mongoose.Types.ObjectId(id);
  const chat = await Chat.find({ participants: { $all: [toIdUser, idUser] } });
  return res.status(200).json(chat);
});

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findById(id);
  return res.status(200).json(user);
});

exports.searchUsersProfile = catchAsyncError(async (req, res, next) => {
  const { user } = req.params;
  const searchedUser = new mongoose.Types.ObjectId(req.user._id);
  const users = await User.aggregate()
    .match({ firstName: new RegExp(user, "i"), _id: { $ne: searchedUser } })
    .project(
      "-OTP -OTPExpries -createdAt -updatedAt -__v -IsOTPVerfied -password"
    );
    // "-chatUser.password -chatUser.OTP -chatUser.OTPExpries -chatUser.createdAt -chatUser.updatedAt -chatUser.__v -chatUser.IsOTPVerfied -_id"
  return res.status(200).json(users);
});

exports.getUser=catchAsyncError(async(req,res,next)=>{
   const {userId}=req.params;
   const user=await User.findById(userId).select(
    "-OTP -OTPExpries -createdAt -updatedAt -__v -IsOTPVerfied -password"
  );
   return res.status(200).json(user);
});