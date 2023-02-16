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

import SideDrawer from "./SideDrawer";

function NewSeries(props) {

    const [seriesData, setSeriesData] = useState(null);

    let { user, authTokens } = useContext(AuthContext);
    const { id } = useParams();



    return (
        <Grid container columnSpacing={0} rowSpacing={3}>
            <Grid item xs={3} flexDirection="column">
                <SideDrawer firstName={user.firstName} lastName={user.lastName} />
            </Grid>
            <Grid item xs={9} flexDirection="column">
                <Grid item xs={9} flexDirection="row"  sx={{height: "40%"}}>
                    {seriesData.img ? <img src={seriesData.img} /> : null}
                </Grid>
                <Grid item xs={9} flexDirection="row">
                    
                </Grid>
                <Grid item xs={9} flexDirection="row">
                    
                </Grid>
                <Grid item xs={5} flexDirection="column">
                    
                </Grid>
                <Grid item xs={4} flexDirection="column">
                    
                </Grid>
            </Grid>
        </Grid>
    
    );
}

export default NewSeries