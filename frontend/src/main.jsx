import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter,Navigate } from "react-router-dom";
import App from "./App";
import SignIn from "./screens/Signin";
import Providers from "./services/store.jsx";
import Signup from "./screens/SignUp.jsx";
import Otp from "./screens/Otp.jsx";
import UserLayout from "./screens/AuthenticLayout.jsx";
import Chat from "./screens/Chat.jsx";
import AuthGuard from "./HOC/AuthGuard.jsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "",
    element: (
      <Providers>
          <App />
      </Providers>
    ),
    children: [
      {
        path:'/', element: <Navigate to="/signin" replace />,
      },
      {
        index:true,
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "otp",
        element: <Otp />,
      },
      {path:"/chat", element: <UserLayout><Chat></Chat></UserLayout>}
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  // </React.StrictMode> 
);
