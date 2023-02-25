import { render } from "react-dom";
import React from 'react';
import ReactDOM from 'react-dom';

import SideDrawer from "../components/SideDrawer";

import { useContext, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import AuthContext from "../context/AuthContext";

function Episode() {

    let {user, authTokens} = useContext(AuthContext)

    const [episodeDetails, setEpisodeDetails] = useState(null)
    const [internalEpisodeDetails, setInternalEpisodeDetails] = useState(null)
    const { id } = useParams()
    const navigate = useNavigate()

    async function getEpisodeDetails() {
        try {
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + String(authTokens?.access)
                },
                body: JSON.stringify({
                    "episode_id": id })
            }
            let response = await fetch('/shows/api/episode/details/', requestOptions)
            if (response.ok)
            {
                let data = await response.json()
                setEpisodeDetails(data.episode)
            }
            
        } catch (error) {
            console.error(error)
        }
    }

    async function getInternalEpisodeDetails() {
        try {
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + String(authTokens?.access)
                },
                body: JSON.stringify({
                    "episode_id": id })
            }
            let response = await fetch('/shows/api/episode/details/internal/', requestOptions)
            if (response.ok)
            {
                let data = await response.json()
                setInternalEpisodeDetails(data.episode)
            }
            
        } catch (error) {
            console.error(error)
        }
    }

    if (!episodeDetails)
    {
        getEpisodeDetails()
    }

    if (!internalEpisodeDetails)
    {
        getInternalEpisodeDetails()
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

export default Episode