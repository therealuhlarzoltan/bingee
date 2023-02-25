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
import AddedSeries from "../components/AddedSeries";
import NewSeries from "../components/NewSeries";


function Series() {

    const { id } = useParams();
    const [seriesData, setSeriesData] = useState(null);
    const [firstLoad, setFirstLoad] = useState(true)

    let { authTokens } = useContext(AuthContext)

    async function lookUpShow(id) {
        setFirstLoad(false)
        try {
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + String(authTokens?.access)
                },
                body: JSON.stringify({ "title_id": id })
            }
            let response = await fetch('/shows/api/details/title/', requestOptions)
            if (response.ok) {
                let data = await response.json()
                setSeriesData(data)
            
            }
        } catch (error) {
            console.error(error)
        }
    }

    if (firstLoad) {
        lookUpShow(id)
    }
    

    return (
        !seriesData ? <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row" justifyItems="center" justifyContent="center">
        <CircularProgress color="inherit" style={{ "position": "absolute", "top": "45%" }} />
        </Stack> :
        (seriesData && seriesData.internalData?.added ? (<AddedSeries seriesData={seriesData} />) : (seriesData && <NewSeries seriesData={seriesData} />))
        
        
    );
    
}

export default Series