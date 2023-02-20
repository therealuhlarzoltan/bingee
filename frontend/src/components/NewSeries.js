import { render } from "react-dom";
import React from 'react';
import ReactDOM from 'react-dom';

import { Button, Divider, Grid } from "@mui/material";
import { Box, height } from "@mui/system";
import SideDrawer from "../components/SideDrawer";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import Typography from "@mui/material/Typography";

import { useEffect, useState } from "react";

import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import { yellow } from "@mui/material/colors";
import AddBoxIcon from '@mui/icons-material/AddBox';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

import { useParams, useNavigate } from "react-router-dom";


function NewSeries(props) {

    const [seriesData, setSeriesData] = useState(props.seriesData);

    const { id } = useParams()

    const navigate = useNavigate()

    let { user, authTokens } = useContext(AuthContext);

    console.log("props: ", props)
    const genres = seriesData.apiData.genres

    async function addSeries() {
        try {
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + String(authTokens?.access)
                },
                body: JSON.stringify({
                    "title_id": id,
                    "title": seriesData.apiData.title,
                    "image": seriesData.apiData.img })
            }
            let response = await fetch('/shows/api/add/title/', requestOptions)
            navigate("/")
            
        } catch (error) {
            console.error(error)
        }
    }



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
                <Grid item xs={9} flexDirection="row" align="center" style={{"max-width": "100%"}}>
                    <Button variant="contained" color="primary" sx={{ color: "black", backgroundColor: yellow['700'], borderColor: yellow['700'], ":hover": { backgroundColor: "white", color: yellow["700"], borderColor: yellow["700"]}, width: "450px", my: 5 }} onClick={addSeries}>Add TV Show <LibraryAddIcon/></Button>
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