import { render } from "react-dom";
import React from 'react';
import ReactDOM from 'react-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';


function Register() {
    return (
        <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
        <div>
            <TextField
                id="username"
                label="Username"
            />
            <TextField
                id="email"
                label="Email address"
            />
            <TextField
                id="password"
                label="Password"
                type="password"
                autoComplete="current-password"
            />
            <TextField
                id="password2"
                label="Password again"
                type="password"
                autoComplete="current-password"
            />
        </div>
     </Box>   
    );
}

export default Register