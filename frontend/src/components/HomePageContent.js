import { render } from "react-dom";
import React from 'react';
import ReactDOM from 'react-dom';
import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";

function HomePageContent() {

    let { name } = useContext(AuthContext);

    return (

        <div>Welcome {name}</div>
    );
}

export default HomePageContent