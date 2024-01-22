import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App, { loader as rootLoader } from "./App";
import SignIn from "./screens/Signin";
import { Provider } from "react-redux";
import Providers from "./services/store.jsx";
import Signup from "./screens/SignUp.jsx";
import Otp from "./screens/Otp.jsx";
import UserLayout from "./screens/AuthenticLayout.jsx";
import Chat from "./screens/Chat.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Providers>
        <App />
      </Providers>
    ),
    // loader:rootLoader
    children: [
      {
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
