import { Navigate } from "react-router-dom";
import { render } from "react-dom";
import React from 'react';
import ReactDOM from 'react-dom';

function PrivateRoute(props) {
    console.log("Hello from private route")
    const authenticated = false
    return (
        authenticated ?
            props.route :
            <Navigate to={"/"} replace={true}/>
    );
}

export default PrivateRoute