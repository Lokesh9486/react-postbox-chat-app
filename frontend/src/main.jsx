import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App,{loader as rootLoader} from './App'
import SignIn from './screens/Signin'

const router=createBrowserRouter([
  {path:'/',element:<App/>,
// loader:rootLoader
children:[{
  path:"signin",element:<SignIn/>
}]
},
  
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
)
