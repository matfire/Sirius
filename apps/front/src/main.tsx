import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, json, redirect, RouterProvider } from "react-router-dom";
import App from "./App";
import AuthProvider from "./contexts/auth.context";
import ThemeProvider from "./contexts/theme.context";
import "./index.css";
import Home from "./routes/home";
import Locations from "./routes/locations";
import Login from "./routes/login";
import NotFound from "./routes/notFound";
import Register from "./routes/register";

const router = createBrowserRouter([
  {
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
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "locations",
        element: <Locations />,
        loader: () => {
          if (!localStorage.getItem("sirius_token")) return redirect("/login")
          return json({ status: "ok" }, { status: 200 })
        }
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
