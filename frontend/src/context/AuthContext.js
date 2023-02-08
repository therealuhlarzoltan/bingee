import { createContext } from "react";
import { useState, useEffect } from "react";
import { render } from "react-dom";
import React from 'react';
import ReactDOM from 'react-dom';

const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({ children }) => {

    let [authTokens, setAuthTokens] = useState(null)
    let [user, setUser] = useState(null)

    let login = async (username, password) => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "username": username, "password": password })
        }
        let response = await fetch('http://127.0.0.1:8000/accounts/token/obtain/', requestOptions)
        let data = await response.json()
        return {
            "data": data,
            "response": response
        }
        
    }

    let contextData = {
        "login":login
    }

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
}

