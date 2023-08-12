import { render } from "react-dom";
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';


import SideDrawer from "../components/SideDrawer";

import { useContext, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import AuthContext from "../context/AuthContext";
import Divider from "@mui/material/Divider";
import {Box} from "@mui/system";
import Paper from "@mui/material/Paper";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import {Button} from "@mui/material";
import {grey, yellow} from "@mui/material/colors";
import List from "@mui/joy/List";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import ListItem from "@mui/joy/ListItem";
import RatingComponent from "./RatingComponent";
import CommentComponent from "./CommentComponent";

function NewEpisode(props) {

    let { user, authTokens } = useContext(AuthContext)

    const [episodeDetails, setEpisodeDetails] = useState(props?.episodeData)
    const [internalEpisodeDetails, setInternalEpisodeDetails] = useState(null)
    const [episodeComments, setEpisodeComments] = useState([])
    const [episodeRatings, setEpisodeRatings] = useState([])
    const { id } = useParams()
    const navigate = useNavigate()

    let ratingList = [];
    let commentList = [];

    ratingList = episodeRatings.map((rating) =>
        <ListItem><RatingComponent key={rating.id} rating={rating.rating/2} profile={rating.profile} timestamp={rating.timestamp} /></ListItem>)
    commentList = episodeComments.map((comment) =>
        <ListItem><CommentComponent key={comment.id} text={comment.text} profile={comment.profile}/></ListItem>
    )

    async function loadComments(id) {
        try {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + String(authTokens?.access)
                }
            }
            let response = await fetch(`/feedback/api/comment/episode/get/${id}/`, requestOptions)
            if (response.ok) {
                let data = await response.json()
                console.log(data)
                setEpisodeComments(data)
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
            let response = await fetch(`/feedback/api/rating/episode/get/${id}/`, requestOptions)
            if (response.ok) {
                let data = await response.json()
                console.log(data)
                setEpisodeRatings(data)
            }
        } catch (error) {
            console.error(error)
        }
    }





    useEffect(() => {
        loadComments(id)
        loadRatings(id)
    }, [])

    return (
        <Grid container columnSpacing={0} rowSpacing={3}>
            <Grid item xs={3} flexDirection="column">
                <SideDrawer firstName={user.firstName} lastName={user.lastName} />
            </Grid>
            <Grid item xs={9} flexDirection="column">
                {!episodeDetails ? (<Stack sx={{ color: 'grey.500' }} spacing={2} direction="row" justifyItems="center" justifyContent="center">
                        <CircularProgress color="inherit" style={{ "position": "absolute", "top": "45%" }} />
                    </Stack>) :
                    <> <Grid item xs={9} flexDirection="row" sx={{height: "50%"}} style={{ "max-width": "100%" }}>
                        {episodeDetails.image ? <img src={episodeDetails.image} style={{maxHeight: "100%", width: "100%"}} /> : null}
                    </Grid>
                        <Grid item xs={9} flexDirection="row" style={{ "max-width": "100%" }}>
                            <Typography variant="h4" sx={{ my: 2 , paddingLeft: "4px"}}>{episodeDetails.episodeTitle}</Typography>
                            <Divider />
                            <ul id="episodeOverviewInfo">
                                <li>S{episodeDetails.season}E{episodeDetails.episode}</li>
                                <li><Link to={`/show/${episodeDetails.seriesId}/`} style={{"text-decoration": "none", "color":"gray", "margin": "0", "display": "inline", ":hover": {textDecoration: "underline"}}}>{episodeDetails.seriesTitle}</Link></li>
                                <li>{episodeDetails.year}</li>
                                <li>Running time: {episodeDetails.runningTimeInMinutes} minutes</li>
                            </ul>
                            <Divider />
                            <p style={{color: "gray", paddingLeft: "4px"}}>{episodeDetails.plotSummary}</p>
                            <Divider />
                        </Grid>
                    </>}
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

export default NewEpisode