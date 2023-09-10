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
    const [loaded, setLoaded] = useState(false)

    let login = async (username, password) => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "username": username, "password": password })
        }
        let response = await fetch('/accounts/token/obtain/', requestOptions)
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

    let logout = async () => {
        try {
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + String(authTokens?.access),
                },
                body: JSON.stringify({
                    "refresh_token": authTokens?.refresh
                })
            }
            let response = await fetch('/accounts/token/logout/', requestOptions)
            }  catch (error) {
                return {"error": true}
            }
            setUser(null);
            setAuthTokens(null);
            localStorage.removeItem("authTokens");
            window.location.href = "/";
            return {"error": false}     
    }

    let update = async () => {
        try {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "refresh": authTokens?.refresh })
            }
            let response = await fetch('/accounts/token/refresh/', requestOptions)
            let data = await response.json()

            if (response.ok) {
                setAuthTokens(data);
                setUser(jwt_decode(data.access))
                localStorage.setItem("authTokens", JSON.stringify(data));
                setLoaded(true);
            }
            else {
                setUser(null);
                setAuthTokens(null);
                localStorage.removeItem("authTokens");
                window.location.href = "/";
            }
        } catch (error) {
            setUser(null);
            setAuthTokens(null);
            localStorage.removeItem("authTokens");
            window.location.href = "/";
        }
        
        setLoaded(true);
    }

    let contextData = {
        "login": login,
        "user": user,
        "logout": logout,
        "update": update,
        "authTokens": authTokens,
    }

    useEffect(()=> {

        if (!loaded && authTokens) {
            update();
        }
        else {
            setLoaded(true);
        }

        let interval = setInterval(() => {
            if (authTokens)
            {
                update();
            }
        }, 240000);
        return () => clearInterval(interval);
        
    }, [authTokens, loaded])
    

    return (
        <AuthContext.Provider value={contextData}>
            { loaded ? children : null}
        </AuthContext.Provider>
    );
}

