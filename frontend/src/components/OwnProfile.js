import { render } from "react-dom";
import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {Link, useNavigate, useParams} from "react-router-dom";
import { Grid } from "@mui/material";
import { Box, height } from "@mui/system";
import SideDrawer from "../components/SideDrawer";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import ListItem from "@mui/joy/ListItem";
import RatingComponent from "./RatingComponent";
import CommentComponent from "./CommentComponent";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import List from "@mui/joy/List";

function OwnProfile() {
    let { user, authTokens } = useContext(AuthContext)

    const navigate = useNavigate()






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

export default OwnProfile