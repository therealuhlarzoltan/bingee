import { render } from "react-dom";
import React from 'react';
import ReactDOM from 'react-dom';
import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";

import SideDrawer from "./SideDrawer";
import { json } from "react-router-dom";


function HomePageContent(props) {

    let { user, authTokens } = useContext(AuthContext);

    async function GetSeries() {
        try {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + String(authTokens?.access)
                }
            }
            let response = await fetch('/shows/api/watching/title/', requestOptions)
            let data = await response.json()
            console.log(data)
            
        } catch (error) {
            console.error(error)
        }
    }

    GetSeries()


    return (
        
        <div>
            <SideDrawer firstName={user.firstName} lastName={user.lastName} />
        </div>

    );
}

export default HomePageContent