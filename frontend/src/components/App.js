import React, { Component } from "react";
import { render } from "react-dom";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, } from "react-router-dom";

import { AuthProvider } from "../context/AuthContext";

import Login from "../pages//Login";
import Home from "../pages/Home";
import Logout from "../pages/Logout";
import Register from "../pages/Register";
import SearchResults from "../pages/SearchResults";

import PrivateRoute from "../pages/PrivateRoute";


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