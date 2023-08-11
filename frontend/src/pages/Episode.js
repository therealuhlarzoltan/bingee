import { render } from "react-dom";
import React from 'react';
import ReactDOM from 'react-dom';
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import { Box, height } from "@mui/system";
import SideDrawer from "../components/SideDrawer";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import Typography from "@mui/material/Typography";

import { useEffect, useState } from "react";

import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import AddedEpisode from "../components/AddedEpisode";
import NewEpisode from "../components/NewEpisode";


function Episode() {

    const { id } = useParams();
    const [episodeData, setEpisodeData] = useState(null);

    let { authTokens } = useContext(AuthContext)

    async function lookUpEpisode(id) {
        try {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + String(authTokens?.access)
                },
            }
            let response = await fetch(`/shows/api/episode/details/${id}/`, requestOptions)
            if (response.ok) {
                let data = await response.json()
                console.log(data)
                console.log(data.episode)
                setEpisodeData(data)

            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        lookUpEpisode(id)
    }, [])




    return (
        !episodeData ? <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row" justifyItems="center" justifyContent="center">
                <CircularProgress color="inherit" style={{ "position": "absolute", "top": "45%" }} />
            </Stack> :
            (episodeData && episodeData.internalData?.added ? (<AddedEpisode episodeData={episodeData.episode} />) : (episodeData && <NewEpisode episodeData={episodeData.episode} />))


    );

}

export default Episode