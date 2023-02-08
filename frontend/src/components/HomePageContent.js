import { render } from "react-dom";
import React from 'react';
import ReactDOM from 'react-dom';
import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";

function HomePageContent(props) {

    let { user } = useContext(AuthContext);
    return (
        
        <div>Welcome {props.username}</div>
    );
}

export default HomePageContent