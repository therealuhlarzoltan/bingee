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
import LinearProgress from '@mui/joy/LinearProgress';

import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';

import grey from "@mui/material/colors";

import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import Stack from "@mui/material/Stack";


function SeriesProgressCard(props) {

    let { user, authTokens } = useContext(AuthContext)
    const [added, setAdded] = useState(props.added)
    let { progress, title, image, titleId } = props



    return (
        <Card sx={{ width: 200, height: 425, mb: 4, backgroundColor: "grey.150"}}>
            <CardContent sx={{ display: "flex", alignContent: "center", justifyContent: "flex-end", margin: 0, alignItems: "center"}}>
            </CardContent>
            <CardMedia
                component="img"
                alt="Cover"
                height="280"
                image={image}
            />
            <CardContent sx={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "flex-start", justifyItems: "flex-start" }}>
                <Stack direction={"column"} spacing={2} sx={{maxWidth: "100%"}}>
                <Link to={`/show/${titleId}`} style={{"text-decoration": "none", "color":"black"}}>
                    <Typography gutterBottom variant="subtitle2" fontSize={19}>
                        {title}
                    </Typography>
                </Link>
                  <LinearProgress color="success" determinate value={progress} variant="soft" size="lg" />
                </Stack>
            </CardContent>
        </Card>
    );

}

export default SeriesProgressCard