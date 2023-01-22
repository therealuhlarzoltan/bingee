import React, { Component } from "react";
import { render } from "react-dom";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, } from "react-router-dom";

import Login from "./Login";
import Home from "./Home";
import Logout from "./Logout";
import Register from "./Register";

 const router = createBrowserRouter([
   {
     path: "/",
     element: <Home/>,
  },
  {
    path: "login/",
    element: <Login />
   },
   {
    path: "logout/",
    element: <Logout />
   },
   {
    path: "register/",
    element: <Register />
  },

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
    <RouterProvider router={router} />
  </React.StrictMode>
);

// const appDiv = document.getElementById("app");
// render(<App />, appDiv);