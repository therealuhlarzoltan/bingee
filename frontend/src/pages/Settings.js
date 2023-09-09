import {useContext, useEffect, useState} from "react";
import AuthContext from "../context/AuthContext";
import {Box} from "@mui/system";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import PortraitIcon from '@mui/icons-material/Portrait';
import { render } from "react-dom";
import React from 'react';
import ReactDOM from 'react-dom';
import SideDrawer from "../components/SideDrawer";
import Divider from '@mui/material/Divider';
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import {blue, pink} from "@mui/material/colors";
import InputLabel from "@mui/material/InputLabel";
import {Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import SaveIcon from '@mui/icons-material/Save';
import LockResetIcon from '@mui/icons-material/LockReset';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';

function Settings() {
    const { user, authContext, authTokens } = useContext(AuthContext);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [isPasswordChangeDialogOpen, setPasswordChangeDialogOpen] = useState(false)
    const [isSuccessfulOpen, setSuccessfulOpen] = useState(false)
    const [isWarningOpen, setWarningOpen] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [warningMessage, setWarningMessage] = useState("")
    const [isErrorOpen, setErrorOpen] = useState(false)
    const [userName, setUserName] = useState(null)
    const [firstName, setFirstName] = useState(null)
    const [lastName, setLastName] = useState(null)
    const [email, setEmail] = useState(null)
    const [gender, setGender] = useState(null)
    const [country, setCountry] = useState(null)
    const [birthDate, setBirthDate] = useState(null)
    const [originalInfos, setOriginalInfos] = useState({})

    useEffect(() => {
        getUserInfos(user?.profileId)
    }, []);

    async function getUserInfos(profileId) {
        try {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + String(authTokens?.access)
                },
            }
            let response = await fetch(`/accounts/api/user/info/own/get/${profileId}/`, requestOptions)
            if (response.ok) {
                let data = await response.json()
                setFirstName(data.first_name)
                originalInfos["firstName"] = data.first_name
                setLastName(data.last_name)
                originalInfos["lastName"] = data.last_name
                setUserName(data.username)
                originalInfos["username"] = data.username
                setEmail(data.email)
                originalInfos["email"] = data.email
                setGender(data.gender)
                originalInfos["gender"] = data.gender
                setCountry(data.country)
                originalInfos["country"] = data.country
                setBirthDate(data.birth_date)
                originalInfos["birthDate"] = data.birth_date
            }
            } catch (error) {
            console.log(error)
        }
    }

    async function makeAccountDeleteRequest() {

    }

    async function makeAccountChangeRequest(profileId) {
        try {
            if (checkForChanges()) {
              const requestOptions = {
                  method: "PUT",
                  headers: {
                      "Content-Type": "application/json",
                      "Authorization": 'Bearer ' + String(authTokens?.access)
                  },
                  body: JSON.stringify({
                      "username": userName,
                      "first_name": firstName,
                      "last_name": lastName,
                      "email": email,
                      "gender": gender,
                      "country": country,
                      "birth_date": birthDate
                  })
              }
              let response = await fetch(`/accounts/api/user/info/own/change/${profileId}/`, requestOptions)
                if (response.ok) {
                    setSuccessMessage("Successfully updated your profile infos!")
                    setSuccessfulOpen(true)
                    let { username, first_name, last_name, email, gender, country, birth_date} = await response.json()
                    setUserName(username)
                    setFirstName(first_name)
                    setLastName(last_name)
                    setEmail(email)
                    setGender(gender)
                    setCountry(country)
                    setBirthDate(birth_date)
                } else {
                    if (response.status === 400) {
                        let errorMsg = createErrorMessage(await response.json())
                        setErrorMessage(errorMsg)
                    }
                    else {
                        setErrorMessage("Failed to update your profile infos. Please Try Again!")
                    }
                    setErrorOpen(true)
                }

            } else {
                setWarningMessage("No changes were made. Could not update your profile infos!")
                setWarningOpen(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    function checkForChanges() {
        let newInfos = {
            "username": userName,
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "gender": gender,
            "country": country,
            "birthDate": birthDate
        }
        for (let key in newInfos) {
            if (originalInfos[key] !== newInfos[key])
                return true
        }

        return false
    }

    function createErrorMessage(data) {
        const key = Object.keys(data)[0]
        let fieldName = key
        fieldName = fieldName[0].toUpperCase() + fieldName.slice(1)
        if (fieldName.includes("_")) {
            const separatorIndex = fieldName.indexOf("_")
            fieldName = fieldName.replace("_", " ")
            fieldName = fieldName.substring(0, separatorIndex + 1) + fieldName[separatorIndex + 1].toUpperCase() + fieldName.substring(separatorIndex + 2)
        }

        return `${fieldName}: ${data[key]}`
    }

    const successAlert =
        <Alert sx={{m: 2}} onClose={() => setSuccessfulOpen(false)}>{successMessage}</Alert>

    const errorAlert = <Alert severity="error" sx={{m: 2}} onClose={() => setErrorOpen(false)}>{errorMessage}</Alert>
    const warningAlert = <Alert severity="warning" sx={{m: 2}} onClose={() => setWarningOpen(false)}>{warningMessage}</Alert>



    return (
        <Grid container columnSpacing={0} rowSpacing={3}>
            <Grid item xs={3} flexDirection="column">
                <SideDrawer firstName={user.firstName} lastName={user.lastName} />
            </Grid>
            <Grid item xs={9} flexDirection="column" sx={{p: 4}}>
                { isSuccessfulOpen && successAlert }
                { isWarningOpen && warningAlert }
                { isErrorOpen && errorAlert }
                <Paper elevation={3} sx={{p: 1, borderRadius: "16px"}}>
                    <Typography variant="h4" sx={{mb: 2}}>
                        Information
                        <Divider orientation="horizontal" />
                    </Typography>
                    <Grid container xs={12} flexDirection="row" columnSpacing={0}>
                    <Grid item xs={4} flexDirection="column" align="left">
                        <Stack direction={"row"} spacing={2}>
                            <PortraitIcon sx={{height: "350px", width: "350px", margin: "0px", padding: "0px"}} />
                            <Divider orientation="vertical" flexItem/>
                        </Stack>
                    </Grid>
                        <Grid xs={8} container rowSpacing={2} columnSpacing={5} sx={{p: 1, m: 0}}>
                            <Grid item xs={6} align="right">
                                <TextField
                                    id="username"
                                    onChange={(event) => setUserName(event.target.value)}
                                    value={userName}
                                    label={"Username"}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} align="left">
                                <TextField
                                    id="email"
                                    label={"Email"}
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} align="right">
                                <TextField
                                    id="first_name"
                                    label={"First Name"}
                                    value={firstName}
                                    onChange={(event) => setFirstName(event.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} align="left">
                                <TextField
                                    id="last_name"
                                    label={"Last Name"}
                                    value={lastName}
                                    onChange={(event) => setLastName(event.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6} align="right">
                                <FormControl>
                                    <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        value={gender}
                                        onChange={(event) => setGender(event.target.value)}
                                        name="radio-buttons-group"
                                    >
                                        <FormControlLabel value="M" control={<Radio sx={{ color: blue[800], '&.Mui-checked': { color: blue[600] } }} />} label="Male" />
                                        <FormControlLabel value="F" control={<Radio sx={{ color: pink[800], '&.Mui-checked': { color: pink[600] } }}/>} label="Female" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} align="left">
                                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                    <InputLabel shrink>
                                        Country
                                    </InputLabel>
                                    <Select
                                        id="country-select"
                                        labelId="country-select-label"
                                        label={"Country"}
                                        notched={true}
                                        autoWidth
                                        value={country}
                                        onChange={(event) => setCountry(event.target.value)}
                                        LabelProps={{shrink: true}}
                                    >
                                        <MenuItem value={"US"}>United States</MenuItem>
                                        <MenuItem value={"HU"}>Hungary</MenuItem>
                                        <MenuItem value={"UK"}>United Kingdom</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} display={"flex"} justifyContent={"space-evenly"}>
                                <Button
                                    size="large"
                                    variant="contained"
                                    endIcon={<SaveIcon/>}
                                    onClick={() => makeAccountChangeRequest(user?.profileId)}
                                >
                                    Save
                                </Button>
                                <Button
                                    size="large"
                                    variant="contained"
                                    endIcon={<LockResetIcon/>}
                                    onClick={() => setErrorOpen(true)}
                                >
                                    Change Password
                                </Button>
                                <Button
                                    color={"error"}
                                    size="large"
                                    variant="contained"
                                    endIcon={<DeleteIcon/>}
                                    onClick={() => setDeleteDialogOpen(true)}
                                >
                                    Delete Account
                                </Button>
                            </Grid>
                            <Dialog
                                open={isDeleteDialogOpen}
                                onClose={() => (setDeleteDialogOpen(false))}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">
                                    {"Are you sure you want to delete your account?"}
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        This means that all of your data will be permanently lost. This action cannot be reversed.
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setDeleteDialogOpen(false)}
                                            autoFocus
                                            variant={"outlined"}
                                            size={"large"}
                                            color={"primary"}
                                    >
                                        No
                                    </Button>
                                    <Button onClick={() => makeAccountDeleteRequest()}
                                            color={"error"}
                                            variant={"contained"}
                                            size={"large"}
                                    >
                                        Yes
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Grid>
                        </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default Settings