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


import grey from "@mui/material/colors";
import { useParams, useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";

import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";


function EpisodeCardWithoutControls(props) {
    let { episode } = props

    return (
        <Card sx={{ width: 200, height: 425, mb: 4, backgroundColor: "grey.150"}}>
            <CardMedia
                component="img"
                alt="Cover"
                height="280"
                image={episode.series.image}
            />
            <CardContent>
                <Stack direction="column" alignContent="flex-start"  justifyContent="space-around" spacing={0}>
                    <Link to={`/episode/${episode.episode_id}/`} style={{"text-decoration": "none", "color":"black", "margin": "0", "display": "inline"}}>
                        <Typography gutterBottom variant="h5" sx={{m: 0, display: "inline", ":hover": {textDecoration: "underline"}}}>
                            S{episode.season}E{episode.episode}
                        </Typography>
                    </Link>
                    <Link to={`/show/${episode.series.title_id}/`} style={{"text-decoration": "none", "color":"gray", "margin": "0", "display": "inline"}}>
                        <Typography gutterBottom variant="h6" sx={{m: 0, display: "inline", ":hover": {textDecoration: "underline"}}}>
                            {episode.series.title}
                        </Typography>
                    </Link>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default EpisodeCardWithoutControls