import {io} from "socket.io-client";
import getCookies from "./getCookies";
export const socket = io("http://localhost:8000/UserConnect",{
  // autoConnect: false,
  withCredentials:true,
        // auth:{
        //   token:getCookies()
        // }
      }
      );