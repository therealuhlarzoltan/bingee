import { render } from "react-dom";
import React from 'react';
import ReactDOM from 'react-dom';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useState } from "react";


import { useContext } from "react";
import AuthContext from "../context/AuthContext";

function Logout() {

    const [alert, setAlert] = useState(null);
    const [error, setError] = useState(null);

    let { logout } = useContext(AuthContext);

    async function handleLogoutButtonClicked() {
        const { error } = await logout();
        if (error) {
            setAlert("An unexpected error occurred — we couldn't log you out");
            setError(true);
        }
    }


    return (
        <div>
            <Grid Grid container rowSpacing={2} columnSpacing={4}>
                <Grid item xs={12} id="alert-grid">
                    {error ? <Alert severity="error" sx={{ width: "36%", margin: "auto", mb: 2 }}
                                    action={
                                        <IconButton
                                            aria-label="close"
                                            color="inherit"
                                            size="small"
                                            onClick={() => {
                                                setError(null);
                                                setAlert(null);
                                            }}
                                        >
                                            <CloseIcon fontSize="inherit" />
                                        </IconButton>
                                    }
                    >
                        {alert}
                    </Alert> : null}
                </Grid>
            </Grid>
            <h1>Logout</h1>
            <Button sx={{"marginTop": "10px"}}
                    color="error"
                    size="large"
                    variant="contained"
                    onClick={handleLogoutButtonClicked}
            >
                Logout
            </Button>
        </div>
    );
}

export default Logout