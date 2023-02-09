import { createContext } from "react";
import { useState, useEffect } from "react";
import { render } from "react-dom";
import React from 'react';
import ReactDOM from 'react-dom';
import jwt_decode from "jwt-decode"
import { redirect } from "react-router-dom";

const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({ children }) => {
    
    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null)
    let [user, setUser] = useState(() => localStorage.getItem("authTokens") ? jwt_decode(localStorage.getItem("authTokens")) : null)

    let login = async (username, password) => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "username": username, "password": password })
        }
        let response = await fetch('http://127.0.0.1:8000/accounts/token/obtain/', requestOptions)
        let data = await response.json()

        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwt_decode(data.access))
            localStorage.setItem("authTokens", JSON.stringify(data));
        }

        return {
            "data": data,
            "response": response
        }
        
    }

    let logout = () => {
        setUser(null);
        setAuthTokens(null);
        localStorage.removeItem("authTokens");
        window.location.href = "/";
    }

    let contextData = {
        "login": login,
        "user": user,
        "logout": logout,
    }

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
}

