import "../styles/pages/home.scss";
import {Link,useNavigate} from "react-router-dom";
import logo from "/assets/images/postboxlogo.png";
import { LinkComponent } from "../components/LinkComponent";
import dummyprofile from "/assets/images/dummyprofile.png";
import { useGetUserDetailsQuery } from "../services/chatApi";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getViewUserAction, viewUserAction } from "../features/auth";
import Skeleton from "../components/Skeleton";

export default function UserLayout({ children }) {
  const viewUser=useSelector(getViewUserAction);
  const dispatch=useDispatch();
  const navigate = useNavigate();
  const secondaryNavBarData1 = [
    {
      image: "messagelight",
      active: "messagedark",
      path: "/chat",
    },
    {
      image: "videolight",
      active: "videodark",
      path: "/video",
    },
    {
      image: "callligth",
      active: "calldark",
      path: "/call",
    },
  ];

  const secondaryNavBarData2 = [
    {
      image: "notification",
      active: "notificationdark",
      path: "/notification",
    },
    {
      image: "settinglight",
      active: "settingdark",
      path: "/setting",
    },
  ];

  const {data: userDetails,isLoading,isSuccess,isError,error} = useGetUserDetailsQuery();
  
  useEffect(() => {
    if (isError && !isSuccess) {
      navigate("/signin");
    }
  }, [isError,isSuccess]);
  return (
    <main className="chat-section">
      <section className={`main-container ${viewUser ? "active" : ""}`}>
        <nav className="seconadry-nav-bar">
          <Link href="/">
          <img className="logo" src={logo} alt="logo" />
          </Link>
          <ul>
            {secondaryNavBarData1.map((item, index) => (
              <LinkComponent {...item} key={index} />
            ))}
          </ul>
          <div>
            <ul>
              {secondaryNavBarData2.map((item, index) => (
                <LinkComponent {...item} key={index} />
              ))}
            </ul>
            <div className="user-logo-container">
            <button type="button" >
              <img onClick={()=>dispatch(viewUserAction(userDetails._id))} className="user-logo" src={userDetails?.avator||dummyprofile} alt="user-logo" />
            </button>
            </div>
          </div>
        </nav>
        {isLoading?<Skeleton/>:children}
      </section>
    </main>
  );
}
