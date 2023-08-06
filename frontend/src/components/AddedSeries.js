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
import Comment from "./Comment";
import UserRating from "./UserRating";
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';

import { useEffect, useState } from "react";

import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

import { yellow } from "@mui/material/colors";
import AddBoxIcon from '@mui/icons-material/AddBox';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

import { useParams, useNavigate } from "react-router-dom";
import {adjustDateSectionValue} from "@mui/x-date-pickers/internals/hooks/useField/useField.utils";
import MinHeightTextarea from "./StyledTextArea";
function AddedSeries(props) {
    const [seriesData, setSeriesData] = useState(props.seriesData);
    const [seriesRatings, setSeriesRatings] = useState([])
    const [seriesComments, setSeriesComments] = useState([])
    const [userSeriesRating, setUserSeriesRating] = useState(null)
    const [userSeriesComment, setUserSeriesComment] = useState("")
    const [hover, setHover] = React.useState(-1);

    const { id } = useParams()

    const navigate = useNavigate()

    let { user, authTokens } = useContext(AuthContext);

    let ratingList = []

    ratingList = seriesRatings.map((rating) =>
        <UserRating key={rating.id} rating={rating.rating} />
        //<li key={rating.id}>{rating.rating}</li>
    )

    useEffect(() => {
        loadRatings(id)
        loadComments(id)
    }, []);

    const genres = seriesData.apiData.genres

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
                console.log(data)
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
                console.log(data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function createComment(id, text) {
        console.log("function called")
        console.log("comment to send: ", userSeriesComment)
        if (userSeriesComment && userSeriesComment.length > 4) {
            try {
                console.log("condition passed")
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
            }
            catch (error) {
                console.error(error)
            }
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
                        "rating": rating
                    })
                }
                let response = await fetch('/feedback/api/rating/series/', requestOptions)
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
                <Grid item xs={5} flexDirection="column">
                    <Typography variant="h4">Ratings</Typography>
                    <Box sx={{display: 'flex', flexDirection: "column", bgcolor: 'background.paper', borderRadius: 1, p: 1, m: 1, alignItems: "center"}}>
                        <Typography variant="subtitle">Add Your Rating!</Typography>
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
                        />
                        <Button variant="contained" sx={{ color: "white", backgroundColor: yellow['700'], borderColor: yellow['700'], ":hover": { backgroundColor: "black", color: yellow["700"], borderColor: yellow["700"]}}} onClick={() => createRating(id, userSeriesRating)}>Add Rating</Button>
                    </Box>
                </Grid>
                <Grid item xs={4} flexDirection="column">
                    <Box sx={{display: 'flex', flexDirection: "column", bgcolor: 'background.paper', borderRadius: 1, p: 1, m: 1, alignItems: "center"}}>
                        <Typography variant="h4">Comments</Typography>
                        <TextareaAutosize
                            value={userSeriesRating}
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
                            {ratingList ? ratingList : null}
                        </List>
                        <Button onClick={() => {console.log(ratingList); console.log(seriesRatings);}}>Debugger</Button>
                    </Box>
                </Grid>
            </Grid>
        </Grid>

    );



}

export default AddedSeries