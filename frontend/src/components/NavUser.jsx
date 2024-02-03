import dummyprofile from "/assets/images/dummyprofile.png";
import { useDispatch } from "react-redux";
import { chatApi } from "../services/chatApi";
import { viewUserAction } from "../features/auth";
import "../styles/components/navUser.scss";

export const NavUser = ({setSelectedUser,selectedUser,activeUser,setShowUserNav,
   chatUser:{_id,avator, firstName, lastName, email, role,isOnline },
  message: {message, createdAt,unReadedMsg}={}}) => {
    const dispatch=useDispatch();
    const selectUser=(id)=>{
      setSelectedUser(id);
      setShowUserNav({_id, firstName, email, avator,isOnline })
      // dispatch(chatApi.util.invalidateTags(['Chat']))
    }
    const viewUserFun=(id)=>dispatch(viewUserAction(id));
  return (
    <li className={`navuser-container rounded ${selectedUser===_id?"active":""} 
    ${activeUser(_id)?"online-user":""}`} onClick={()=>selectUser(_id)}>
        <div className="user-logo">
       <img src={avator?avator:dummyprofile} onClick={()=>viewUserFun(_id)} alt="avator"/>
        </div>
        <div className="last-msg-con">
            <div className="secondary-con1">
              <div>
                <p className="user-name">{firstName}</p>
               {message&&<p className="user-name">{message}</p>}
              </div>
                {/* {1&&<p className="time">{1}</p>} */}
                {unReadedMsg?<p className="unreaded-msg">{unReadedMsg}</p>:null}
            </div>
            <div className="secondary-con2">
                {/* <p className={true?"green-text":"last-msg"}>{true?"Typing":"last-msg"}</p> */}
            </div>
        </div>
    </li>
  )
}
