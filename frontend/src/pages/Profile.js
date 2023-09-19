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
import EpisodeCard from "../components/EpisodeCard";
import SeriesCard from "../components/SeriesCard"
import Divider from "@mui/material/Divider";
import SeriesProgressCard from "../components/SeriesProgressCard";
import ListItem from "@mui/joy/ListItem";
import List from "@mui/joy/List";

function Profile() {
    let { user, authTokens } = useContext(AuthContext)
    const { username } = useParams()
    const { navigate } = useNavigate()
    const [ profileInfo, setProfileInfo ] = useState(null)
    const [series, setSeries] = useState([])
    const [episodes, setEpisodes] = useState([])
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        getProfileInfos(username)
    }, []);

    async function getSeries(profileId) {
        try {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + String(authTokens?.access)
                }
            }
            let response = await fetch(`/accounts/api/user/profile/series/get/${profileId}/`, requestOptions)
            if (response.ok) {
                let data = await response.json()
                console.log(data)
                setSeries(...series, data)
            } else {

            }
        } catch (error) {
            console.error(error)
        }
    }

    async function getEpisodes(profileId) {
        try {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + String(authTokens?.access)
                }
            }
            let response = await fetch(`/accounts/api/user/profile/episodes/get/${profileId}/`, requestOptions)
            if (response.ok) {
                let data = await response.json()
                console.log(data)
                setEpisodes(...episodes, data)
            } else {

            }
        } catch (error) {
            console.error(error)
        }
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
            let response = await fetch(`/accounts/api/user/profile/${username}/`, requestOptions)
            if (response.ok) {
                const profile = await response.json()
                setProfileInfo(profile)
                console.log(profile)
                getSeries(profile.id)
                getEpisodes(profile.id)

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
                <Grid item xs={9} flexDirection="row" style={{ "max-width": "100%" }}>
                    <Typography variant="h3" sx={{mb: 2, mx: 2}}>Currently Watching</Typography>
                    <Stack spacing={4} direction="row" flexWrap={"wrap"} sx={{paddingLeft: 2}}>
                        {series.map((series) => {
                            return (
                                <SeriesProgressCard title={series.title} progress={series.percentage_complete} titleId={series.title_id} image={series.image} />
                    );
                })}
                    </Stack>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default Profile