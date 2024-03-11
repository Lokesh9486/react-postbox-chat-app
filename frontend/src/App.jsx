import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./globals.css";
import getCookies from "./utils/getCookies";
import { useEffect } from "react";

function App() {
  const navigate = useNavigate();
  const token = getCookies();
  useEffect(()=>{
    // if (!token) {
    //   return navigate("/signin");
    // }
    // else{
    //   return navigate("/chat");
    // }
  },[token,navigate])

  return <Outlet />;
}

export default App;
