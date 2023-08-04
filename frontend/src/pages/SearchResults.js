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
import { Link } from "react-router-dom";

import { useEffect, useState } from "react";

import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Button from "@mui/material/Button";

import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

import grey from "@mui/material/colors";

import SeriesCard from "../components/SeriesCard";






function SearchResults(props) {

    const [seriesIndex, setSeriesIndex] = useState(null);
    const [seriesData, setSeriesData] = useState(null)

    let { user, authTokens } = useContext(AuthContext);

    let { q } = useParams();


    function DisplaySearchResults(status, data) {
        setSeriesData(data.data)
        const indexes = Object.keys(data.data).filter(index => data.data[index].titleType === "tvSeries" || data.data[index].titleType === "tvMiniSeries")
        setSeriesIndex(indexes)
        

    }


    async function PerformSearch() {
        setSeriesData(null);
        setSeriesIndex(null);
        try {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + String(authTokens?.access)
                }
            }
            let response = await fetch(`/shows/api/search/title/${q}/`, requestOptions)
            if (response.ok) {
                if (response.status === 204) {
                    console.log("Not found")
                }
                else {
                    let data = await response.json()
                    DisplaySearchResults(response.status, data)
                }
            }
            else {

            }
            
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        PerformSearch();
    }, [q])



    return (
            <Grid container columnSpacing={0} rowSpacing={3}>
                <Grid item xs={3} flexDirection="column">
                    <SideDrawer firstName={user.firstName} lastName={user.lastName} />
                </Grid>
                <Grid item xs={9} flexDirection="column">
                    <Grid item xs={9} flexDirection="row" style={{"max-width": "100%"}} justify="center">
                        <Typography variant="h4" sx={{ml: 2, mb: 2}}>TV shows matching "{q}"</Typography>
                    </Grid>
                    <Grid item xs={9} flexDirection="row" style={{ "max-width": "100%" }}>
                        {!seriesIndex &&
                        <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row" justifyItems="center" justifyContent="center">
                            <CircularProgress color="inherit" style={{ "position": "absolute", "top": "45%" }} />
                        </Stack>}
                        <Stack spacing={4} direction="row" flexWrap={"wrap"} sx={{paddingLeft: 2}}>
                            {seriesIndex ? 
                                seriesIndex.map(index => {
                                    return (
                                        <SeriesCard title={seriesData[index]?.title} image={seriesData[index].image?.url} titleId={seriesData[index]?.id.substring(7)} added={seriesData[index].added} />
                                    );
                                })
                            : null}
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
    );
}

export default SearchResults