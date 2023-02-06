import React from 'react';
import { render } from "react-dom";;
import ReactDOM from 'react-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { pink, blue } from '@mui/material/colors';
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useState } from "react";
import Typography from '@mui/material/Typography';

import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

function Login() {

    let {login} = useContext(AuthContext)

    const [username, setUsername] = useState("");
    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    };

    const [password, setPassword] = useState("");
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    function handleLoginButtonClicked() {
        console.log("Login button clicked")
        login(username, password)
    }

    return (
        <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1.5} alignItems="center" justify="center" direction="column">
            <Grid item xs={12}>
                <Typography variant="h2" gutterBottom>
                    Login
                </Typography>
            </Grid>
            <Grid item xs={8} align="center"> 
                <TextField
                    id="username"
                    label="Username"
                    value={username}
                    onChange={handleUsernameChange}
                /> 
            </Grid>
            <Grid item xs={8} align="center">
                <TextField
                        id="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    /> 
            </Grid>
            <Grid xs={8}>
                <Button sx={{"marginTop": "10px"}}
                    color="primary"
                    size="large"
                    variant="outlined"
                    onClick={handleLoginButtonClicked}
                >
                Login
                </Button>    
            </Grid>
            <Grid xs={8}>
                    
            </Grid>
            <Grid xs={8}>
                    
            </Grid>
            </Grid>
            </Box>
    );
}

export default Login