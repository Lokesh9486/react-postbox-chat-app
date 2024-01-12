const express=require('express');
const router=express.Router();
const {isAuthenticateUser}=require('../middlewares/authentication');
const { getChatedUser, sendMessage, getMessage, getUserDetails, searchUsersProfile, deleteMessage, getUser } = require('../controllers/chatController');

router.route('/getChatedUser').get(isAuthenticateUser,getChatedUser);

router.route('/message').post(isAuthenticateUser,sendMessage)
                        .delete(isAuthenticateUser,deleteMessage);

router.route('/getMessage/:toId').get(isAuthenticateUser,getMessage);

router.route("/getUserDetails").get(isAuthenticateUser,getUserDetails);

router.route("/searchUsersProfile/:user").get(isAuthenticateUser,searchUsersProfile);

router.route("/getUser/:userId").get(isAuthenticateUser,getUser);

module.exports =router;