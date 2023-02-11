import { render } from "react-dom";
import React from 'react';
import ReactDOM from 'react-dom';
import Landing from "./Landing";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import HomePageContent from "../components/HomePageContent";

function Home() {
    let {user} = useContext(AuthContext);

        return (
            user ?
                <HomePageContent username={user.username} /> : <Landing />
        );
}

export default Home