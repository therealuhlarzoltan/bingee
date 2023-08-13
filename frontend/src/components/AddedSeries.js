import { render } from "react-dom";
import React from 'react';
import ReactDOM from 'react-dom';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import { Button, Divider, Grid } from "@mui/material";
import { Box, height } from "@mui/system";
import SideDrawer from "../components/SideDrawer";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import Typography from "@mui/material/Typography";
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import CommentComponent from "./CommentComponent";
import RatingComponent from "./RatingComponent";
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';

import { useEffect, useState } from "react";

import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import { yellow, grey } from "@mui/material/colors";
import AddBoxIcon from '@mui/icons-material/AddBox';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

import { useParams, useNavigate } from "react-router-dom";
import {adjustDateSectionValue} from "@mui/x-date-pickers/internals/hooks/useField/useField.utils";
import Paper from "@mui/material/Paper";

function AddedSeries(props) {
    const [seriesData, setSeriesData] = useState(props.seriesData);
    const [seriesRatings, setSeriesRatings] = useState([])
    const [seriesComments, setSeriesComments] = useState([])
    const [userSeriesRating, setUserSeriesRating] = useState(null)
    const [userSeriesComment, setUserSeriesComment] = useState("")
    const [hover, setHover] = React.useState(-1);
    const [originalUserRating, setOriginalUserRating] = useState(0)

    const { id } = useParams()

    const navigate = useNavigate()

    let { user, authTokens } = useContext(AuthContext);

    let ratingList = [];
    let commentList = [];

    ratingList = seriesRatings.map((rating) =>
        <ListItem><RatingComponent key={rating.id} rating={rating.rating/2} profile={rating.profile} timestamp={rating.timestamp} /></ListItem>)
    commentList = seriesComments.map((comment) =>
        <ListItem><CommentComponent key={comment.id} text={comment.text} profile={comment.profile}/></ListItem>
    )

    useEffect(() => {
        loadRatings(id)
        loadComments(id)

    }, []);

    const genres = seriesData.apiData.genres

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
                setUserSeriesRating(rating.rating / 2)
                setOriginalUserRating(rating.rating / 2)
            }
        })
    }


    async function removeSeries(){
        try {
            const requestOptions = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + String(authTokens?.access)
                }
            }
            let response = await fetch(`/shows/api/remove/title/${id}/`, requestOptions)
            navigate("/")

        } catch (error) {
            console.error(error)
        }
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
                searchForOwnRating(data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function createComment(id, text) {
        if (userSeriesComment && userSeriesComment.length > 4) {
            try {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": 'Bearer ' + String(authTokens?.access)
                    },
                    body: JSON.stringify({
                        "title_id": id,
                        "text": text,
                    })
                }
                let response = await fetch('/feedback/api/comment/series/', requestOptions)
                if (response.status === 201) {
                    let data = await response.json()
                    setSeriesComments([data, ...seriesComments])
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
                    "title_id": id,
                })
            }
            let response = await fetch(`/feedback/api/rating/series/delete/${id}/`, requestOptions)
            if (response.status === 204) {
                let ratings = seriesRatings;
                ratings.forEach((rating, index) =>
                    rating.profile.id === user.profileId ? ratings.splice(index, 1) : null
                )
                setSeriesRatings(ratings)
                setUserSeriesRating(0)
            }
        }

        catch (error) {
            console.error(error)
        }
    }



    async function createRating(id, rating) {
        if (userSeriesRating) {
            try {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": 'Bearer ' + String(authTokens?.access)
                    },
                    body: JSON.stringify({
                        "title_id": id,
                        "rating": (rating * 2)
                    })
                }
                let response = await fetch('/feedback/api/rating/series/', requestOptions)
                if (response.status === 201) {
                    let data = await response.json()
                    setSeriesRatings([data, ...seriesRatings])
                    setOriginalUserRating(data.rating/2)
                }
                else if (response.status === 200) {
                    let data = await response.json()
                    let ratings = [data, ...seriesRatings]
                    ratings = sortRatings(ratings)
                    setSeriesRatings(ratings)
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
                    <Button variant="contained" color="primary" sx={{ color: "black", backgroundColor: yellow['700'], borderColor: yellow['700'], ":hover": { backgroundColor: "white", color: yellow["700"], borderColor: yellow["700"]}, width: "450px", my: 5 }} onClick={removeSeries}>Remove TV Show <PlaylistRemoveIcon/></Button>
                </Grid>
                <Grid container columnSpacing={3} xs={9} sx={{m: 4, p: 4}} style={{ "max-width": "100%" }}>
                <Grid item xs={5} flexDirection="column">
                    <Box sx={{display: 'flex', flexDirection: "column", bgcolor: 'background.paper', borderRadius: 1, p: 1, m: 1, alignItems: "center"}}>
                        <Typography variant="h2" sx={{ mb: 3 }}>Ratings</Typography>
                        <Paper elevation={5}>
                            <Box sx={{display: 'flex', flexDirection: "column", borderRadius: 1, p: 1, m: 1, alignItems: "center", width: "320px"}}>
                        <Rating
                            name="hover-feedback"
                            value={userSeriesRating ? userSeriesRating : 0}
                            precision={0.5}
                            onChange={(event, newValue) => {
                                setUserSeriesRating(newValue);
                            }}
                            onChangeActive={(event, newHover) => {
                                setHover(newHover);
                            }}
                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                            sx={{mb: 2}}
                        />
                        {userSeriesRating === originalUserRating ? <Button variant="contained" sx={{ mb: 2, color: "white", backgroundColor: grey['900'], borderColor: grey['900'], ":hover": { backgroundColor: "black", color: grey["900"], borderColor: grey["900"]}}} onClick={() => deleteRating(id)}>Remove Rating</Button> :
                        <Button variant="contained" sx={{ mb: 2, color: "white", backgroundColor: yellow['700'], borderColor: yellow['700'], ":hover": { backgroundColor: "black", color: yellow["700"], borderColor: yellow["700"]}}} onClick={() => createRating(id, userSeriesRating)}>Add Rating</Button>}
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
                            value={userSeriesComment}
                            onChange={event => setUserSeriesComment(event.target.value)}
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
                        <Button variant="contained" sx={{ color: "white", backgroundColor: yellow['700'], borderColor: yellow['700'], ":hover": { backgroundColor: "black", color: yellow["700"], borderColor: yellow["700"]}}} onClick={() => createComment(id, userSeriesComment)}>Add Comment</Button>
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

export default AddedSeries