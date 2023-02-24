import { render } from "react-dom";
import React from 'react';
import ReactDOM from 'react-dom';
import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";

import SideDrawer from "./SideDrawer";
import { json } from "react-router-dom";
import EpisodeCard from "./EpisodeCard";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";


function HomePageContent(props) {

    const [seriesData, setSeriesData] = useState(null)
    const [currentKeys, setCurrentKeys] = useState(null)
    const [notStartedKeys, setNotStartedKeys] = useState(null)
    const [notWatchedKeys, setNotWatchedKeys] = useState(null)

    let { user, authTokens } = useContext(AuthContext);

    async function GetSeries() {
        try {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + String(authTokens?.access)
                }
            }
            let response = await fetch('/shows/api/watching/title/', requestOptions)
            let data = await response.json()
            console.log(data)
            const currently_watching_keys = Object.keys(data.currentlyWatching)
            const havent_started_yet_keys = Object.keys(data.haventStartedYet)
            const havent_watched_for_a_while_keys = Object.keys(data.haventWatchedForAWhile)
            setSeriesData(data)
            setCurrentKeys(currently_watching_keys)
            setNotStartedKeys(havent_started_yet_keys)
            setNotWatchedKeys(havent_watched_for_a_while_keys)
            
            
        } catch (error) {
            console.error(error)
        }
    }

    if (!seriesData)
    {
        GetSeries()
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
                    {seriesData && currentKeys ? 
                        currentKeys.map(index => {
                            return (
                                <EpisodeCard episode={seriesData.currentlyWatching[index]} />
                            );
                        })
                    : null}
                </Stack>
                <Divider sx={{borderTopWidth: "5px", borderRadius: "5px"}} />
            </Grid>
            <Grid item xs={9} flexDirection="row" style={{ "max-width": "100%" }}>
                <Typography variant="h3" sx={{mb: 2, mx: 2}}>Haven't Watched For a While</Typography>
                <Stack spacing={4} direction="row" flexWrap={"wrap"} sx={{paddingLeft: 2}}>
                    {notWatchedKeys ? 
                        notWatchedKeys.map(index => {
                            return (
                                <EpisodeCard episode={seriesData.haventWatchedForAWhile[index].episode_id} />
                            );
                        })
                    : null}
                </Stack>
                <Divider sx={{borderTopWidth: "5px", borderRadius: "5px"}} />
            </Grid>
            <Grid item xs={9} flexDirection="row" style={{ "max-width": "100%" }}>
                <Typography variant="h3" sx={{mb: 2, mx: 2}}>Haven't Started Yet</Typography>
                <Stack spacing={4} direction="row" flexWrap={"wrap"} sx={{paddingLeft: 2}}>
                    {notStartedKeys ? 
                        notStartedKeys.map(index => {
                            return (
                                <EpisodeCard episode={seriesData.haventStartedYet[index]} />
                            );
                        })
                    : null}
                </Stack>
            </Grid>
        </Grid>
    </Grid>

    );
}

export default HomePageContent