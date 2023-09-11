import { render } from "react-dom";
import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {useNavigate, useParams} from "react-router-dom";
import {Grid, Typography} from "@mui/material";
import SideDrawer from "../components/SideDrawer";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import AddedSeries from "../components/AddedSeries";
import NewSeries from "../components/NewSeries";
import OwnProfile from "../components/OwnProfile";
import OtherProfile from "../components/OtherProfile";
import EpisodeCard from "../components/EpisodeCard";
import Divider from "@mui/material/Divider";

function Profile() {
    let { user, authTokens } = useContext(AuthContext)
    const { username } = useParams()
    const { navigate } = useNavigate()
    const [ profileInfo, setProfileInfo ] = useState(null)
    const [series, setSeries] = useState(null)
    const [episodes, setEpisodes] = useState(null)
    const [profile, setProfile] = useState(null)

    async function getSeries(profileId) {

    }

    async function getEpisodes(profileId) {

    }

    async function getProfileInfos(username) {
        try {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + String(authTokens?.access)
                }
            }
            let response = await fetch(`/api/user/profile/${username}/`, requestOptions)
            if (response.ok) {
                const profile = await response.json()
                setProfileInfo(profile)
                getSeries(profile.id)
                getEpisodes(profiel.id)

            } else {
                navigate("/")
            }
        } catch (error) {
            console.log(error)
        }

    }


    return (
        <Grid container columnSpacing={0} rowSpacing={3}>
            <Grid item xs={3} flexDirection="column">
                <SideDrawer firstName={user.firstName} lastName={user.lastName} />
            </Grid>
            <Grid item xs={9} flexDirection="column">

            </Grid>
        </Grid>
    );
}

export default Profile