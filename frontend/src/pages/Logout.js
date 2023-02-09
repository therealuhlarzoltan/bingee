import { render } from "react-dom";
import React from 'react';
import ReactDOM from 'react-dom';
import Button from "@mui/material/Button";

import { useContext } from "react";
import AuthContext from "../context/AuthContext";

function Logout() {

    let { logout } = useContext(AuthContext);

    return (
        <div>
        <h1>Logout</h1>
        <Button sx={{"marginTop": "10px"}}
                    color="error"
                    size="large"
                    variant="contained"
                    onClick={logout}
                >
                Logout
            </Button> 
        </div>
    );
}

export default Logout