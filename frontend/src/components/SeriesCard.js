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

import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

import grey from "@mui/material/colors";


function SeriesCard(props) {

    return (
        <Card sx={{ width: 200, height: 425, mb: 4, backgroundColor: "grey.150"}}>
            <CardContent sx={{ display: "flex", alignContent: "center", justifyContent: "flex-end", margin: 0, alignItems: "center"}}>
                <Button variant="outlined" sx={{backgroundColor: "grey.900", color: "white", ":hover": {backgroundColor: "gray", borderColor: "grey"}}}>Add  <PlaylistAddIcon/></Button>
            </CardContent>
            <CardMedia
                component="img"
                alt="Cover"
                height="280"
                image={props?.image}
            />
            <CardContent sx={{display: "flex", alignContent: "center", alignItems: "center", justifyContent: "flex-start", justifyItems: "flex-start"}}>
                <Typography gutterBottom variant="subtitle2" fontSize={19}>
                    {props?.title}
                </Typography>
            </CardContent>
        </Card> 
    );    

}

export default SeriesCard