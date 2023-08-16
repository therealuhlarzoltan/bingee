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

function AddedEpisode(props) {

    let { user, authTokens } = useContext(AuthContext)

    const [episodeDetails, setEpisodeDetails] = useState(props?.episodeData)
    const [internalEpisodeDetails, setInternalEpisodeDetails] = useState(null)
    const [episodeComments, setEpisodeComments] = useState([])
    const [episodeRatings, setEpisodeRatings] = useState([])
    const [originalUserRating, setOriginalUserRating] = useState(null)
    const [userEpisodeComment, setUserEpisodeComment] = useState("")
    const [userEpisodeRating, setUserEpisodeRating] = useState(0)
    const [hover, setHover] = React.useState(-1);

    const { id } = useParams()
    const navigate = useNavigate()

    let ratingList = [];
    let commentList = [];

    ratingList = episodeRatings.map((rating) =>
        <ListItem><RatingComponent key={rating.id} rating={rating.rating/2} profile={rating.profile} timestamp={rating.timestamp}
                                    user={user}/></ListItem>)
    commentList = episodeComments.map((comment) =>
        <ListItem><CommentComponent key={comment.id} text={comment.text} profile={comment.profile}
                                    timestamp={comment.timestamp} user={user} id={comment.id} authTokens={authTokens} likes={comment.likes} areReplies={comment.areReplies}
                                    isLiked={comment.isLiked} episodeOrSeries="episode" likeCount={comment.likes}
                                    otherComments={episodeComments} setComments={setEpisodeComments} replyId={id}/></ListItem>
    )

    function sortRatings(ratings) {
        if (ratings) {
            const profileId = ratings[0].profile.id
            ratings.forEach((rating, index) => {
                if (rating.profile.id === profileId) {
                    ratings.splice(index, index)
                }
            })

            return ratings
        }
    }

    function searchForOwnRating(ratings) {
        ratings.forEach((rating) =>
        {
            if (rating.profile.id === user.profileId) {
                setUserEpisodeRating(rating.rating / 2)
                setOriginalUserRating(rating.rating / 2)
            }
        })
    }

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
                setEpisodeRatings(data)
                searchForOwnRating(data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function getEpisodeDetails() {
        try {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + String(authTokens?.access)
                }
            }
            let response = await fetch(`/shows/api/episode/details/${id}/`, requestOptions)
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
                }
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

    useEffect(() => {
        loadComments(id)
        loadRatings(id)
    }, [])

    async function createComment(id, text) {
        if (userEpisodeComment && userEpisodeComment.length >= 4) {
            try {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": 'Bearer ' + String(authTokens?.access)
                    },
                    body: JSON.stringify({
                        "episode_id": id,
                        "text": text,
                    })
                }
                let response = await fetch('/feedback/api/comment/episode/', requestOptions)
                if (response.status === 201) {
                    let data = await response.json()
                    setEpisodeComments([data, ...episodeComments])
                }
            }
            catch (error) {
                console.error(error)
            }
        }
    }

    async function deleteRating(id) {
        try {
            const requestOptions = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + String(authTokens?.access)
                },
                body: JSON.stringify({
                    "episode_id": id,
                })
            }
            let response = await fetch(`/feedback/api/rating/episode/delete/${id}/`, requestOptions)
            if (response.status === 204) {
                let ratings = episodeRatings;
                ratings.forEach((rating, index) =>
                    rating.profile.id === user.profileId ? ratings.splice(index, 1) : null
                )
                setEpisodeRatings(ratings)
                setUserEpisodeRating(0)
            }
        }

        catch (error) {
            console.error(error)
        }
    }



    async function createRating(id, rating) {
        if (userEpisodeRating) {
            try {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": 'Bearer ' + String(authTokens?.access)
                    },
                    body: JSON.stringify({
                        "episode_id": id,
                        "rating": (rating * 2)
                    })
                }
                let response = await fetch('/feedback/api/rating/episode/', requestOptions)
                if (response.status === 201) {
                    let data = await response.json()
                    setEpisodeRatings([data, ...episodeRatings])
                    setOriginalUserRating(data.rating/2)
                }
                else if (response.status === 200) {
                    let data = await response.json()
                    let ratings = [data, ...episodeRatings]
                    ratings = sortRatings(ratings)
                    setEpisodeRatings(ratings)
                    setOriginalUserRating(data.rating/2)
                }
            }

            catch (error) {
                console.error(error)
            }
        }
    }

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
                            <Paper elevation={5}>
                                <Box sx={{display: 'flex', flexDirection: "column", borderRadius: 1, p: 1, m: 1, alignItems: "center", width: "320px"}}>
                                    <Rating
                                        name="hover-feedback"
                                        value={userEpisodeRating ? userEpisodeRating : 0}
                                        precision={0.5}
                                        onChange={(event, newValue) => {
                                            setUserEpisodeRating(newValue);
                                        }}
                                        onChangeActive={(event, newHover) => {
                                            setHover(newHover);
                                        }}
                                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                        sx={{mb: 2}}
                                    />
                                    {userEpisodeRating === originalUserRating ? <Button variant="contained" sx={{ mb: 2, color: "white", backgroundColor: grey['900'], borderColor: grey['900'], ":hover": { backgroundColor: "black", color: grey["900"], borderColor: grey["900"]}}} onClick={() => deleteRating(id)}>Remove Rating</Button> :
                                        <Button variant="contained" sx={{ mb: 2, color: "white", backgroundColor: yellow['700'], borderColor: yellow['700'], ":hover": { backgroundColor: "black", color: yellow["700"], borderColor: yellow["700"]}}} onClick={() => createRating(id, userEpisodeRating)}>Add Rating</Button>}
                                </Box>
                            </Paper>
                            <List>
                                {ratingList ? ratingList : null}
                            </List>
                        </Box>
                    </Grid>
                    <Grid item xs={5} flexDirection="column">
                        <Box sx={{display: 'flex', flexDirection: "column", bgcolor: 'background.paper', borderRadius: 1, p: 1, m: 1, alignItems: "center"}}>
                            <Typography variant="h2">Comments</Typography>
                            <TextareaAutosize
                                value={userEpisodeComment}
                                onChange={event => setUserEpisodeComment(event.target.value)}
                                minRows={3}
                                placeholder={"Add your comment here"}
                                sx={{
                                    width: "320px",
                                    fontFamily: "sans-serif",
                                    fontSize: "0.875rem",
                                    fontWeight: "400",
                                    lineHeight: "1.5",
                                    padding: "12px",
                                    borderRadius: "12px 12px 0 12px"
                                }}
                            />
                            <Button variant="contained" sx={{ color: "white", backgroundColor: yellow['700'], borderColor: yellow['700'], ":hover": { backgroundColor: "black", color: yellow["700"], borderColor: yellow["700"]}}} onClick={() => createComment(id, userEpisodeComment)}>Add Comment</Button>
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

export default AddedEpisode