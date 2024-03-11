import "../styles/pages/home.scss";
import { Link, useNavigate } from "react-router-dom";
import { NavUser } from "../components/NavUser";
import video from "/assets/images/videolight.png";
import call from "/assets/images/callligth.png";
import cancel from "/assets/images/cancel.png";
import about from "/assets/images/about.png";
import email from "/assets/images/email.png";
import sendMsg from "/assets/images/sendmsg.png";
import happyemoji from "/assets/images/happyemoji.png";
import dummyprofile from "/assets/images/dummyprofile.png";
import AnotherUserDetails from "../components/AnotherUserDetails";
import {
  useDeleteMessageMutation,
  useGetUserDetailsQuery,
  useGetUserQuery,
  useSearchUserProfileQuery,
  useGetChatedUsersQuery,
} from "../services/chatApi";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { socket } from "../utils/socket";
import { getViewUserAction, viewUserAction } from "../features/auth";
import { useDispatch, useSelector } from "react-redux";
import { DropDown } from "../components/DropDown";
import UserCard from "../components/UserCard";
import useGetPage from "../HOC/useGetPage";

export default function Chat() {
  const ulElement = useRef(null);
  const dispatch = useDispatch();
  const viewUser = useSelector(getViewUserAction);
  const [selectedUser, setSelectedUser] = useState();
  const [showUserNav, setShowUserNav] = useState();
  const [message, setMessage] = useState("");
  const [specificUserMsg, setSpecificUserMsg] = useState([]);
  const [chatedUser, setChatUser] = useState([]);
  const [searchUser, setSearchUser] = useState();
  const [onlineUsers, setOnlineUser] = useState([]);
  const [typing, setTyping] = useState(undefined);
  const [preview,setPreview]=useState("");
  const [uploadImg,setUploadImg]=useState();
  const {
    data: userDetails,
    isLoading,
    isError,
    error,
  } = useGetUserDetailsQuery();
  const { data: searchUserData } = useSearchUserProfileQuery(searchUser, {
    skip: !searchUser,
  });
  const [deleteMessage, { data: deletedMessageResult }] =
    useDeleteMessageMutation();
  const { data: userData, isSuccess: userDataSuccess } = useGetUserQuery(
    viewUser,
    { skip: !viewUser }
  );
  const [isConnected, setIsConnected] = useState(socket.connected);
  const chatList = useRef(null);

  const {
    data: fetchSpecificData,
    chatListRef,
    parentRef,
  } = useGetPage(socket, "getSpecificChat", { id: selectedUser }, chatList);

  useEffect(() => {
    if (fetchSpecificData) {
      setSpecificUserMsg(fetchSpecificData);
    }
  }, [fetchSpecificData]);

  useEffect(() => {
    if (deletedMessageResult) {
      setSpecificUserMsg(
        specificUserMsg.filter(({ _id }) => _id !== deletedMessageResult.id)
      );
    }
  }, [deletedMessageResult]);

  const shortTime = new Intl.DateTimeFormat("en", {
    timeStyle: "short",
  });

  const imageUpload=(e)=>{
    // var reader = new FileReader();
    // console.log(file)
    // var url = URL.createObjectURL(file.originFileObj);
    // seVideoSrc(url);
    const reader=new FileReader();
    reader.onload=()=>{
       if(reader.readyState===2){
        setPreview(reader.result);
        setUploadImg(e.target.files?.[0]);
       }
      }
      if(e.target?.files){
       reader.readAsDataURL(e.target.files?.[0])
     }
  }

  const formSubmitHandler = (e) => {
    e.preventDefault();
    // if (message) {
      console.log(uploadImg)
      socket.emit( "send message", { message,uploadImg, reciver: [selectedUser], },
        (response) => {
          setSpecificUserMsg([response,...specificUserMsg]);
        }
      );
      // asyncSendMessage({
      //   message,
      //   reciver: [selectedUser],
      // });
      setMessage("");
    // }
  };

  useEffect(() => {
    const connection = (socket) => setIsConnected(true);
    const disConnection = () => setIsConnected(false);
    const overAllMessage = (data) => {
      const value = data.map(({ chatUser: { isOnline, _id } }) => {
        if (isOnline) {
          return _id;
        }
      });
      setOnlineUser([
        ...new Set([...onlineUsers, ...value.filter((item) => item)]),
      ]);
      setChatUser(data);
      setShowUserNav(data?.chatUser);
    };
    const onlineUsersFun = (data) => {
      setOnlineUser([...onlineUsers, data]);
    };
    const offlineUsers = (data) => {
      setOnlineUser(onlineUsers.filter((user) => user != data));
    };

    const typing = (data) => setTyping(data);
    const stopTyping = (data) => setTyping(undefined);

    socket.connect();
    socket.on("disconnect", disConnection);
    socket.on("overAllMessage", overAllMessage);
    socket.on("onlineUsers", onlineUsersFun);
    socket.on("offlineUsers", offlineUsers);
    socket.on("typing", typing);
    socket.on("stop typing", stopTyping);
    return () => {
      socket.off("connect", connection);
      socket.off("overAllMessage", overAllMessage);
      socket.off("onlineUsers", onlineUsersFun);
      socket.off("offlineUsers", offlineUsers);
      socket.off("typing", typing);
      socket.off("stop typing", stopTyping);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const demo = (data) => {
      if (selectedUser == data.user._id) {
        setSpecificUserMsg((prev) => [ data.chat,...prev]);
        setTyping(false);
      } else {
        const chat = chatedUser.map((item) => {
          if (
            data.chat.sendedBy === item.chatUser._id &&
            data.chat.sendedBy != selectedUser
          ) {
            return {
              ...item,
              message: {
                ...item.message,
                unReadedMsg: item.message.unReadedMsg
                  ? item.message.unReadedMsg + 1
                  : 1,
              },
            };
          }
          return item;
        });
        setChatUser(chat);
      }
      if (!chatedUser.some(({ chatUser: { _id } }) => _id == data.user._id)) {
        setChatUser([
          ...chatedUser,
          { message: { ...data.chat }, chatUser: { ...data.user } },
        ]);
        setSelectedUser(data.user._id);
      }
    };
    const deleteMsg = (data) => {
      setSpecificUserMsg(specificUserMsg.filter(({ _id }) => _id !== data));
    };
    socket?.on("recieve-msg", demo);
    socket.on("delete-msg", deleteMsg);
    return () => {
      socket?.off("recieve-msg", demo);
      socket.off("delete-msg", deleteMsg);
    };
  });

  const activeUser = (id) => {
    return onlineUsers?.some((key) => key == id);
  };

  const viewUserFun = (id) => dispatch(viewUserAction(id));

  const userTyping = (e) => {
    setMessage(e.target.value);
    if (socket) {
      socket.emit("typing", selectedUser);
      let lastTypingTime = new Date().getTime();
      let timerLength = 3000;
      setTimeout(() => {
        let timeNow = new Date().getTime();
        let timeDiff = timeNow - lastTypingTime;
        if (timeDiff >= timerLength) {
          socket.emit("stop typing", selectedUser);
        }
      }, timerLength);
    }
  };

  const deletMsg = (id) => {
    console.log("id:", id);
    socket.emit(
      "delete message",
      {
        id,
      },
      (response) => {
        setSpecificUserMsg(
          specificUserMsg.filter(({ _id }) => _id !== response.id)
        );
      }
    );
  };

  const dropDownValue = [{ name: "Delete", action: deletMsg }];

  return (
    <>
      <nav className="primary-nav-bar">
        <div className="message-text">
          <h5>Message</h5>
          <input
            type="search"
            placeholder="Search..."
            className="user-search-input"
            onChange={(e) => setSearchUser(e.target.value)}
          />
        </div>
        <ul>
          {searchUser &&
            searchUserData?.map(
              ({ _id, firstName, lastName, email, role, avator, isOnline }) => (
                <div
                  key={_id}
                  className={`search-user rounded ${
                    activeUser(_id) ? "online-user" : ""
                  }
               ${selectedUser ? "active" : ""}`}
                  onClick={() => {
                    setSelectedUser(_id);
                    setShowUserNav({ _id, firstName, email, avator, isOnline });
                  }}
                >
                  <div className="image-con">
                    <img
                      onClick={() => viewUserFun(_id)}
                      src={avator ? avator : dummyprofile}
                      alt="search-user"
                    />
                  </div>
                  <div>
                    <p className="general-text-bold text-capitalize">
                      {firstName}
                    </p>
                    <p className="general-text">{email}</p>
                  </div>
                </div>
              )
            )}
        </ul>
        <ul>
          {chatedUser?.map((item, index) => (
            <NavUser
              {...{
                ...item,
                setSelectedUser,
                selectedUser,
                activeUser,
                setShowUserNav,
              }}
              key={index}
            />
          ))}
        </ul>
      </nav>
      {selectedUser ? (
        <div className="chat-container">
          <div className="chat-top-con">
            <UserCard {...{ ...showUserNav, activeUser }} />
            <div className="video-call">
              <Link href={"/"}>
                <img src={video} alt="video" />
              </Link>
              <Link href={"/"}>
                <img src={call} alt="call" />
              </Link>
            </div>
          </div>
          <ul
            className="chat-body-content d-flex flex-column-reverse"
            style={{ overflowAnchor: "none" }}
            ref={ulElement}
          >
            {specificUserMsg?.map(
              ({ message, sendedBy, updatedAt, _id }, index) => {
                const isAnOtherUser = chatedUser?.find(
                  ({ chatUser }) => chatUser._id == sendedBy
                )?.chatUser;
                if (specificUserMsg.length == index + 1) {
                  return (
                    <li
                      className={!isAnOtherUser ? "isAnotherUser" : ""}
                      key={index}
                      ref={chatListRef}
                    >
                      {!isAnOtherUser && (
                        <DropDown>
                          <DropDown.Header></DropDown.Header>
                          <DropDown.Body
                            value={dropDownValue}
                            id={_id}
                          ></DropDown.Body>
                        </DropDown>
                      )}
                      <img
                        className="chat-user-profile"
                        onClick={() =>
                          viewUserFun(isAnOtherUser?._id || userDetails._id)
                        }
                        src={
                          isAnOtherUser?.avator ||
                          userDetails.avator ||
                          dummyprofile
                        }
                        alt="dummyprofile"
                      />
                      <div className="chat-msg-con">
                        <div className="message-container">{message}</div>
                        <p className="d-flex alig-items-center gap-2">
                          <span className="user-data">
                            {isAnOtherUser?.firstName || userDetails.firstName}
                          </span>
                          <span className="user-data">
                            {updatedAt
                              ? shortTime?.format(new Date(updatedAt))
                              : null}
                          </span>
                        </p>
                      </div>
                    </li>
                  );
                } else {
                  return (
                    <li
                      className={!isAnOtherUser ? "isAnotherUser" : ""}
                      key={index}
                    >
                      {!isAnOtherUser && (
                        <DropDown>
                          <DropDown.Header></DropDown.Header>
                          <DropDown.Body
                            value={dropDownValue}
                            id={_id}
                          ></DropDown.Body>
                        </DropDown>
                      )}
                      <img
                        className="chat-user-profile"
                        onClick={() =>
                          viewUserFun(isAnOtherUser?._id || userDetails._id)
                        }
                        src={
                          isAnOtherUser?.avator ||
                          userDetails.avator ||
                          dummyprofile
                        }
                        alt="dummyprofile"
                      />
                      <div className="chat-msg-con">
                        <div className="message-container">{message}</div>
                        <p className="d-flex alig-items-center gap-2">
                          <span className="user-data">
                            {isAnOtherUser?.firstName || userDetails.firstName}
                          </span>
                          <span className="user-data">
                            {
                               new Date(updatedAt)?.toLocaleDateString("en-US",{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                            }
                            {" "}
                            {updatedAt
                              ? shortTime?.format(new Date(updatedAt))
                              : null}
                          </span>
                        </p>
                      </div>
                    </li>
                  );
                }
              }
            )}
          </ul>
          {typing === selectedUser ? <p>Typing...</p> : null}
          <form className="sender-form" onSubmit={formSubmitHandler}>
            <input
              type="text"
              value={message}
              onChange={(e) => userTyping(e)}
              placeholder="send message ...."
            />
            <label htmlFor="upload-img" className="sendMsg-btn me-4">
              <img
                src="assets/images/attachment.png"
                alt="link"
                className="loader-img"
              />
            </label>
            <input
              type="file"
              id="upload-img"
              accept="audio/*,video/*,image/*" 
              className="d-none"
              onChange={imageUpload}
            />
            <button type="submit" className="sendMsg-btn p-0">
              <img src={sendMsg} alt="sendmsg" />
            </button>
          </form>
        </div>
      ) : (
        <div className="message-not-found">
          <img src={happyemoji} alt="happyemoji" className="happyemoji" />
          <p className="ternary-topic text-center">
            <b>
              Search for other users in our chat and
              <br /> start a conversation with
              <br /> someone new
            </b>
          </p>
        </div>
      )}
      {viewUser &&
        (userDataSuccess ? (
          <div className="another-user-data">
            <div className="another-user-top">
              <p className="another-user">Contact details</p>
              <button
                type="button"
                className="p-0"
                onClick={() => viewUserFun(undefined)}
              >
                <img src={cancel} alt="cancel" />
              </button>
            </div>
            <div className="another-user-main">
              <img
                src={userData?.avator || dummyprofile}
                className="another-user-img"
                alt="user"
              />
              <p className="another-usename">{userData?.firstName}</p>
              <p className="another-usename">
                {activeUser(userData?._id) || userData?.isOnline
                  ? "online"
                  : userData.lastSeen}
              </p>
              <AnotherUserDetails
                img={email}
                topic="Email"
                data={userData?.email}
              />
              <AnotherUserDetails
                img={about}
                topic="About"
                data={userData?.about}
              />
              <AnotherUserDetails
                img={call}
                topic="Phone Number"
                data={987654321}
              />
            </div>
          </div>
        ) : (
          "loading"
        ))}
    </>
  );
}
