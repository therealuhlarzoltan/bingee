import { render } from "react-dom";
import React from 'react';
import ReactDOM from 'react-dom';
import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";

import SideDrawer from "./SideDrawer";


function HomePageContent(props) {

    let { user } = useContext(AuthContext);
    return (
        
        <div>
            <SideDrawer firstName={user.firstName} lastName={user.lastName} />
        </div>

    );
}

export default HomePageContent