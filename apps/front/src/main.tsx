import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from './App'
import './index.css'
import Home from './routes/home'
import Login from './routes/login'
import NotFound from './routes/notFound'
import Register from './routes/register'

const router = createBrowserRouter([{
  path: "/",
  element: <App />,
  errorElement: <NotFound />,
  children: [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "login",
      element: <Login />
    },
    {
      path: "register",
      element: <Register />
    }
  ]
}])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
