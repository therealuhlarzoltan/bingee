import { render } from "react-dom";
import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import SideDrawer from "../components/SideDrawer";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import AddedSeries from "../components/AddedSeries";
import NewSeries from "../components/NewSeries";
import OwnProfile from "../components/OwnProfile";
import OtherProfile from "../components/OtherProfile";

function Profile() {
    let { user, authTokens } = useContext(AuthContext)
    const { username } = useParams();
    const [ profileInfo, setProfileInfo ] = useState(null);

    useEffect(() => {
        getProfileInfos(username)
    }, [])

    async function getProfileInfos(username){
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + String(authTokens?.access)
            }
        }
        let response = await fetch(`/profiles/api/profile/info/get/${username}/`, requestOptions)
        if (response.ok) {
            let data = await response.json()
            setProfileInfo(data)
        }
    }


    !profileInfo ? <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row" justifyItems="center" justifyContent="center">
            <CircularProgress color="inherit" style={{ "position": "absolute", "top": "45%" }} />
        </Stack> :
        (user.profileId === profileInfo.profileId ? (<OwnProfile profileInfo={profileInfo} />) : (<OtherProfile profileInfo={profileInfo} />))
}

export default Profile