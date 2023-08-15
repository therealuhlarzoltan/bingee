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
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';

import { useParams, useNavigate } from "react-router-dom";
import {RatingComponent} from "./RatingComponent";
import CommentComponent from "./CommentComponent";


function NewSeries(props) {

    const [seriesData, setSeriesData] = useState(props.seriesData);
    const [seriesRatings, setSeriesRatings] = useState([])
    const [seriesComments, setSeriesComments] = useState([])

    const { id } = useParams()

    const navigate = useNavigate()

    let { user, authTokens } = useContext(AuthContext);

    let ratingList = [];
    let commentList = [];

    ratingList = seriesRatings.map((rating) =>
        <ListItem><RatingComponent key={rating.id} rating={rating.rating/2} profile={rating.profile} timestamp={rating.timestamp}
                                    user={user}/></ListItem>)
    commentList = seriesComments.map((comment) =>
        <ListItem><CommentComponent key={comment.id} text={comment.text} profile={comment.profile} timestamp={comment.timestamp}
                                    user={user} comment={comment.id} authTokens={authTokens}
                                    likes={comment.likes} areReplies={comment.areReplies}
                                    isLiked={comment.isLiked} episodeOrSeries="series"/></ListItem>
    )

    useEffect(() => {
        loadRatings(id)
        loadComments(id)

    }, []);

    async function loadComments(id) {
        try {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + String(authTokens?.access)
                }
            }
            let response = await fetch(`/feedback/api/comment/series/get/${id}/`, requestOptions)
            if (response.ok) {
                let data = await response.json()
                setSeriesComments(data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function loadRatings(id) {
        try {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + String(authTokens?.access)
                }
            }
            let response = await fetch(`/feedback/api/rating/series/get/${id}/`, requestOptions)
            if (response.ok) {
                let data = await response.json()
                setSeriesRatings(data)
            }
        } catch (error) {
            console.error(error)
        }
    }


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
                <Grid container columnSpacing={3} xs={9} sx={{m: 4, p: 4}} style={{ "max-width": "100%" }}>
                    <Grid item xs={5} flexDirection="column">
                        <Box sx={{display: 'flex', flexDirection: "column", bgcolor: 'background.paper', borderRadius: 1, p: 1, m: 1, alignItems: "center"}}>
                            <Typography variant="h2" sx={{ mb: 3 }}>Ratings</Typography>
                            <List>
                                {ratingList ? ratingList : null}
                            </List>
                        </Box>
                    </Grid>
                    <Grid item xs={5} flexDirection="column">
                        <Box sx={{display: 'flex', flexDirection: "column", bgcolor: 'background.paper', borderRadius: 1, p: 1, m: 1, alignItems: "center"}}>
                            <Typography variant="h2">Comments</Typography>
                            <List>
                                {commentList ? commentList : null}
                            </List>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    
    );
}

export default NewSeries