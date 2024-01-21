import { Outlet } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.css";
import "./globals.css";

export async function loader(){
  // const cookieStore = cookies()
  // const token = cookieStore.get('token')
  // if(!token){
  //   return redirect("/signin");
  // }
  // return  redirect("/chat");
}

function App() {
  return (
    <Outlet/>
  )
}

export default App
