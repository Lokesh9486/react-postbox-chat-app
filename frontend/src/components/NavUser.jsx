import Image from "next/legacy/image";
import dummyprofile from "../../public/images/dummyprofile.png";
import { useDispatch } from "react-redux";
import "@/styles/components/navUser.scss";
import { chatApi } from "@/services/chatApi";
import { viewUserAction } from "@/features/auth";

export const NavUser = ({setSelectedUser,selectedUser,activeUser,
  chatUser:{_id,avator, firstName, lastName, email, role,isOnline },
   message: {message, createdAt,unReadedMsg}={}}) => {
    const dispatch=useDispatch();
    const selectUser=(id)=>{
      setSelectedUser(id);
      // dispatch(chatApi.util.invalidateTags(['Chat']))
    }
    const viewUserFun=(id)=>dispatch(viewUserAction(id));
  return (
    <li className={`navuser-container ${selectedUser===_id?"active":""} 
    ${activeUser(_id)?"online-user":""}`} onClick={()=>selectUser(_id)}>
        <div className="user-logo">
       <Image src={avator?avator:dummyprofile} onClick={()=>viewUserFun(_id)} width="100%" height="100%" objectFit="cover" alt="avator"/>
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
