import React, { Component } from "react";
import { render } from "react-dom";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { AuthProvider } from "../context/AuthContext";

import Login from "../pages//Login";
import Home from "../pages/Home";
import Logout from "../pages/Logout";
import Register from "../pages/Register";
import SearchResults from "../pages/SearchResults";

import PrivateRoute from "../pages/PrivateRoute";
import Series from "../pages/Series";
import Episode from "../pages/Episode";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";


 const router = createBrowserRouter([
   {
     path: "/",
     element: <Home />
  },
  {
    path: "login/",
    element: <Login />
   },
   {
    path: "logout/",
     element: <PrivateRoute route={<Logout />} />
   },
   {
    path: "register/",
    element: <Register />
   },
   {
     path: "search/:q",
     element: <PrivateRoute route={<SearchResults />} />
   },
    {
    path: "show/:id",
    element: <PrivateRoute route={<Series />} />
    },
    {
     path: "episode/:id",
     element: <PrivateRoute route={<Episode/>} />
    },
     {
         path: "profile/:username",
         element: <PrivateRoute route={<Profile/>} />
     },
     {
         path: "settings/",
         element: <PrivateRoute route={<Settings/>} />
     }

]);

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  // render() {
  //   return (
  //     <div>
  //       <Home />
  //     </div>
  //   );
  // }
}
ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

// const appDiv = document.getElementById("app");
// render(<App />, appDiv);