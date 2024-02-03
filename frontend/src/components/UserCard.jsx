import dummyprofile from "/assets/images/dummyprofile.png";
import { useDispatch } from "react-redux";
import { chatApi } from "../services/chatApi";
import { viewUserAction } from "../features/auth";

const UserCard = ({activeUser,_id,avator, firstName,isOnline }) => {
     const dispatch=useDispatch();
     const viewUserFun=(id)=>dispatch(viewUserAction(id));
  return (
    <li className={`navuser-container rounded  ${activeUser(_id)?"online-user":""}`}>
        <button className="user-logo btn p-0" onClick={()=>viewUserFun(_id)}>
         <img src={avator?avator:dummyprofile}  alt="avator"/>
        </button>
        <div className="last-msg-con gap-0">
            <p className="general-text fw-bold text-capitalize">{firstName}</p>
            <p className="general-text user-name">{isOnline?"Online":""}</p>
        </div>
    </li>
  )
}

export default UserCard