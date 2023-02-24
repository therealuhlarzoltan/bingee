import { render } from "react-dom";
import React from 'react';
import ReactDOM from 'react-dom';

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
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';

import grey from "@mui/material/colors";
import { useParams, useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";

import { useState } from "react";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";


function EpisodeCard(props) {

    let { authTokens } = useContext(AuthContext);

    const [episode, setEpisode] = useState(props.episode)

    async function markAsWatched() {
        try {
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + String(authTokens?.access)
                },
                body: JSON.stringify({
                    "episode_id": episode.episode_id,
                    })
            }
            let response = await fetch('/shows/api/watch/episode/next/', requestOptions)
            if (response.ok) {
                let data = await response.json()
                setEpisode(data.nextEpisode)
            }
        } catch (error) {
            console.error(error)
        }
    }



    return (
        <Card sx={{ width: 200, height: 425, mb: 4, backgroundColor: "grey.150"}}>
            <CardContent sx={{ display: "flex", alignContent: "center", justifyContent: "flex-end", margin: 0, alignItems: "center"}}>
                <VisibilityIcon sx={{cursor: "pointer"}} onClick={() => markAsWatched()} />
            </CardContent>
            <CardMedia
                component="img"
                alt="Cover"
                height="280"
                image={episode.series.image}
            />
            <CardContent>
                <Stack direction="column" alignContent="flex-start"  justifyContent="space-around" spacing={0}>
                <Link to={`/episode/${props?.episodeId}/`} style={{"text-decoration": "none", "color":"black", "margin": "0", "display": "inline"}}>
                    <Typography gutterBottom variant="h5" sx={{m: 0, display: "inline"}}>
                        S{episode.season}E{episode.episode}
                    </Typography>
                </Link>
                <Link to={`/show/${episode.titleId}/`} style={{"text-decoration": "none", "color":"gray", "margin": "0", "display": "inline"}}>
                    <Typography gutterBottom variant="h6" sx={{m: 0, display: "inline"}}>
                        {episode.series.title}
                    </Typography>
                </Link>
                </Stack>
            </CardContent>
        </Card> 
    ); 
}

export default EpisodeCard