import { render } from "react-dom";
import React from 'react';
import ReactDOM from 'react-dom';
import Landing from "./Landing";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import HomePageContent from "../components/HomePageContent";

function Home() {
    const authenticated = true

    return (
        authenticated ?
            <HomePageContent />: <Landing />
            
    );
}

export default Home