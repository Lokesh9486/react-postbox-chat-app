import {io} from "socket.io-client";
export const socket = io("http://192.168.1.16:8000/UserConnect",{
  autoConnect: false,
  withCredentials:true,
        // auth:{
        //   token:getCookies()
        // }
      }
      );