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
import InputLabel from '@mui/material/InputLabel';
import { Select } from "@mui/material";
import { pink, blue } from '@mui/material/colors';
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useState } from "react";
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { margin } from "@mui/system";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { Link } from "react-router-dom";



function Register() {

    const [status, setStatus] = useState("");
    const [alert, setAlert] = useState("");

    const [country, setCountry] = useState("");
    const handleCountryChange = (event) => {
        setCountry(event.target.value);
    };
    const [username, setUsername] = useState("");
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };
    const [email, setEmail] = useState("");
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    const [firstName, setFirstName] = useState("");
    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };
    const [lastName, setLastName] = useState("");
    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };
    const [password, setPassword] = useState("");
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const [password2, setPassword2] = useState("");
    const handlePassword2Change = (event) => {
        setPassword2(event.target.value);
    };
    const [gender, setGender] = useState("M");
    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };


    function handleRegistrationResponse(response, status) {

        const faulty_words = ["password2", "first_name", "last_name", "birth_date"]

        if (status === 201) {
            setStatus(201);
        }
        else if (status === 400) {
            let key;
            if (response.hasOwnProperty("message")) {
                const keys = Object.keys(response.message);
                key = keys[0];
            }
            else {
                key = Object.keys(response)[0];
            }
            
            let field;
            if (faulty_words.includes(key)) {
                if (key === "password2") {
                    field = "Password confirmation";
                }
                if (key === "birth_date") {
                    field = "Birth date";
                }
                if (key === "first_name") {
                    field = "First name";
                }
                if (key === "last_name") {
                    field = "Last name";
                }
            }
            else
            {
                field = key;
            }
            
            let firstLetter = field.charAt(0).toUpperCase();
            field = field.slice(1);
            const str = firstLetter + field 
            if (response.hasOwnProperty("message")) {
                setAlert(`${str}:  ${response.message[key]}`);
            }
            else {
                setAlert(`${str}:  ${response[key]}`);
            }
            
            setStatus(400);
        }
        else {
            setAlert("Something went wrong — please try again later!");
            setStatus(500);
        }
    }


    function handleRegisterButtonClicked() {
        const newUser = {
            username: username,
            email: email,
            password: password,
            password2: password2,
            first_name: firstName,
            last_name: lastName,
            gender: gender,
            country: country,
            birth_date: "2003-04-18"
        };

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        };
        fetch("/accounts/register/", requestOptions)
        .then(response =>  response.json().then(data => ({status: response.status, data: data})))
        .then(obj => handleRegistrationResponse(obj.data, obj.status))
        .catch((error) => setStatus(500));
    }

    return (
        <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={2} columnSpacing={4}>
            <Grid item xs={12} id="alert-grid">
                    {status === 201 ?
                         <Alert severity="success" sx={{ width: "36%", margin: "auto", mb: 2 }}
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setStatus("");
                                    }}
                                >
                                 <CloseIcon fontSize="inherit" />
                             </IconButton>
                            }
                        > 
                            User created — you may <Link to="/login" style={{"text-decoration":"underline", "font-weight":"bold", "color":"black"}}>login</Link> now!
                        </Alert> : null}
                    {status === 400 ?
                        <Alert severity="error" sx={{ width: "36%", margin: "auto", mb: 2 }}
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setStatus("");
                                    }}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                        > 
                            {alert}
                    </Alert> : null}
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h2" gutterBottom>
                    Register
                </Typography>
            </Grid>
            <Grid item xs={6} align="right"> 
                <TextField
                    id="username"
                    label="Username"
                    value={username}
                    onChange={handleUsernameChange}
                /> 
            </Grid>
            <Grid item xs={6} align="left">
                <TextField
                        id="email"
                        label="Email"
                        value={email}
                        onChange={handleEmailChange}
                    /> 
            </Grid>
            <Grid item xs={6} align="right">
                <TextField
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                /> 
            </Grid>
            <Grid item xs={6} align="left">
                <TextField
                    id="password2"
                    label="Password Confirmation"
                    type="password"
                    value={password2}
                    onChange={handlePassword2Change}
                    /> 
            </Grid>
            <Grid item xs={6} align="right">
                <TextField
                    id="first_name"
                    label="First Name"
                    value={firstName}
                    onChange={handleFirstNameChange}
                /> 
            </Grid>
            <Grid item xs={6} align="left">
                <TextField
                    id="last_name"
                    label="Last Name"
                    value={lastName}
                    onChange={handleLastNameChange}
                    /> 
            </Grid>
            <Grid item xs={6} align="right">
                <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="M"
                            name="radio-buttons-group"
                            value={gender}
                            onChange={handleGenderChange}
                        >
                            <FormControlLabel value="M" control={<Radio sx={{ color: blue[800], '&.Mui-checked': { color: blue[600] } }} />} label="Male" />
                            <FormControlLabel value="F" control={<Radio sx={{ color: pink[800], '&.Mui-checked': { color: pink[600] } }}/>} label="Female" />
                        </RadioGroup>
                </FormControl> 
            </Grid>
            <Grid item xs={6} align="left">
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="country-select-input-label">Country</InputLabel>
                    <Select
                        labelId="country-select-label"
                        id="country-select"
                        value={country}
                        onChange={handleCountryChange}
                        autoWidth
                        label="Country"
                    >
                    <MenuItem value={"US"}>United States</MenuItem>
                    <MenuItem value={"HU"}>Hungary</MenuItem>
                    <MenuItem value={"UK"}>United Kingdom</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <Button
    
                    color="primary"
                    size="large"
                    variant="outlined"
                    onClick={handleRegisterButtonClicked}
                >
                Register
                </Button>    
            </Grid>
        </Grid>
      </Box>
    );
}

export default Register