import React from 'react';
import { render } from "react-dom";;
import ReactDOM from 'react-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useState } from "react";
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';

import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

import { Navigate } from 'react-router-dom';

import { blue, white, purple } from '@mui/material/colors';
import { Paper } from '@mui/material';



function Login() {

    const [status, setStatus] = useState(null)
    const [alert, setAlert] = useState(null)

    let { login } = useContext(AuthContext);
    let { user } = useContext(AuthContext);

    const [username, setUsername] = useState("");
    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    };

    const [password, setPassword] = useState("");
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    async function handleLoginButtonClicked() {
        try {
            let result = await login(username, password)
            if (result.response.ok) {
                setStatus(200);
            }
            else {


                if (result.response.status === 400 || result.response.status === 401) {
                    const key = Object.keys(result.data)[0];
                    let field = key;
                    let firstLetter = field.charAt(0).toUpperCase();
                    field = field.slice(1);
                    const str = firstLetter + field
                    setAlert(`${str}:  ${result.data[key]}`);
                    setStatus(result.response.status);
                }
            }
        } catch (error) {
            setStatus(500)
            setAlert("Something went wrong — please try again later!")
        }

    }


    return (
        <Box sx={{ width: '100%' }}>
            {user ? <Navigate to={"/"} replace={true} /> : null}
            <Grid container rowSpacing={1.5} alignItems="center" justify="center" direction="column">
                <Grid item xs={12} id="alert-grid">
                    {status === 200 ? <Navigate to={"/"} replace={true} /> : null}
                    {status && status != 200 ?
                        <Alert severity="error" sx={{margin: "auto", mb: 2 }}
                               action={
                                   <IconButton
                                       aria-label="close"
                                       color="inherit"
                                       size="small"
                                       onClick={() => {
                                           setStatus(null);
                                           setAlert(null);
                                       }}
                                   >
                                       <CloseIcon fontSize="inherit" />
                                   </IconButton>
                               }
                        >
                            {alert}
                        </Alert> : null
                    }
                </Grid>
                <Paper elevation={3} sx={{width: "30%"}}>
                    <Grid container rowSpacing={1.5} alignItems="center" justify="center" direction="column" >
                        <Grid item xs={12}>
                            <Typography variant="h2" gutterBottom sx={{mt: 4}}>
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
                            <Button sx={{"marginTop": "10px", color: purple['500'], borderColor: purple["700"], ":hover": { backgroundColor: purple["700"], color: "white", borderColor: purple["700"] }, mb: 4 }}
                                    size="large"
                                    variant="outlined"
                                    onClick={handleLoginButtonClicked}
                            >
                                Login
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Box>
    );
}

export default Login