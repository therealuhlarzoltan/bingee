import { render } from "react-dom";
import React from 'react';
import ReactDOM from 'react-dom';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Grid, Typography } from "@mui/material";
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Stack from "@mui/material/Stack";

import { useNavigate } from "react-router-dom";
import { purple, blue } from "@mui/material/colors";


function Landing() {

    const navigate = useNavigate()
    const buttons = [
        <Button key="Login" variant="contained" sx={{ color: "white", backgroundColor: purple['500'], ":hover": { backgroundColor: blue["700"], borderColor: purple["700"] } }} onClick={() => navigate("/login")}>Login</Button>,
        <Button key="Register" variant="contained" sx={{ color: "white", backgroundColor: blue['700'], ":hover": { backgroundColor: purple["700"], borderColor: blue["700"] } }} onClick={() => navigate("/register")}>Register</Button>,
    ]

    return (
        <Grid container justifyContent="center" alignItems="center" sx={{ height: "80%" }}>
            <Grid item xs={6}>
                <Paper elevation={3}>
                    <Grid container display={"flex"} justifyContent="center" alignItems="center">
                        <Typography textAlign={"center"} variant="h2" sx={{my: "36px"}}>Welcome to Bingee</Typography>
                        <Stack spacing={2} direction="row" sx={{my: "10px"}}>
                            {buttons}
                        </Stack>
                    </Grid>
                    <Stack spacing={2} direction="row" sx={{my: "10px"}} justifyContent="center">
                        <Typography variant="subtitle2" sx={{my: "40px"}}>Forgot your password? Click here to reset it!</Typography>
                    </Stack>
                </Paper>
            </Grid>
      </Grid>
    );
}

export default Landing