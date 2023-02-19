import { render } from "react-dom";
import React from 'react';
import ReactDOM from 'react-dom';

import { useParams } from "react-router-dom";
import { Divider, Grid } from "@mui/material";
import { Box, height } from "@mui/system";
import SideDrawer from "../components/SideDrawer";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import Typography from "@mui/material/Typography";

import { useEffect, useState } from "react";

import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';


function NewSeries(props) {

    const [seriesData, setSeriesData] = useState(props.seriesData);

    let { user, authTokens } = useContext(AuthContext);

    console.log("props: ", props)
    const genres = seriesData.apiData.genres



    return (
        <Grid container columnSpacing={0} rowSpacing={3}>
            <Grid item xs={3} flexDirection="column">
                <SideDrawer firstName={user.firstName} lastName={user.lastName} />
            </Grid>
            <Grid item xs={9} flexDirection="column">
                <Grid item xs={9} flexDirection="row" sx={{height: "50%"}} style={{ "max-width": "100%" }}>
                    {seriesData.apiData.img ? <img src={seriesData.apiData.img} style={{maxHeight: "100%", width: "100%"}} /> : null}
                </Grid>
                <Grid item xs={9} flexDirection="row" style={{ "max-width": "100%" }}>
                    <Typography variant="h4" sx={{ my: 2 , paddingLeft: "4px"}}>{seriesData.apiData.title}</Typography>
                    <Divider />
                    <ul id="seriesOverviewInfo">
                        <li>{seriesData.apiData.seriesEndYear ? "Ended" : "Still Running"}</li>
                        <li>{seriesData.apiData.numberOfEpisodes} Episodes</li>
                        <li>Running time: {seriesData.apiData.runningTimeInMinutes} minutes</li>
                        <li>{seriesData.apiData.seriesStartYear} — {seriesData.apiData.seriesEndYear ? seriesData.apiData.seriesEndYear : "Present"}</li>
                        <li>IMDB rating: {seriesData.apiData.imdbRatings}</li>
                        {genres.map((genre) => {
                            return <li>{genre}</li>
                        })}
                    </ul>
                    <Divider />
                        <p style={{color: "gray", paddingLeft: "4px"}}>{seriesData.apiData.plotOutline}</p>
                    <Divider />
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