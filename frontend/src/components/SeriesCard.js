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
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';

import grey from "@mui/material/colors";

import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";


function SeriesCard(props) {

    let { user, authTokens } = useContext(AuthContext)
    const [added, setAdded] = useState(props.added)

    async function add() {
        try {
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + String(authTokens?.access)
                },
                body: JSON.stringify({
                    "title_id": props?.titleId.substring(0, props?.titleId.length-1),
                    "title": props?.title,
                    "image": props?.image})
            }
            let response = await fetch('/shows/api/add/title/', requestOptions)
            if (response.ok)
            {
                setAdded(true)
            }
            
        } catch (error) {
            console.error(error)
        }
    }

    async function remove() {
        try {
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + String(authTokens?.access)
                },
                body: JSON.stringify({
                    "title_id": props?.titleId.substring(0, props?.titleId.length - 1)
                })
            }
            let response = await fetch('/shows/api/remove/title/', requestOptions)
            if (response.ok)
            {
                setAdded(false)
            }
            
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Card sx={{ width: 200, height: 425, mb: 4, backgroundColor: "grey.150"}}>
            <CardContent sx={{ display: "flex", alignContent: "center", justifyContent: "flex-end", margin: 0, alignItems: "center"}}>
                {added ? <Button variant="outlined" onClick={() => remove()} sx={{ backgroundColor: "grey.900", color: "white", ":hover": { backgroundColor: "gray", borderColor: "grey" } }}>Remove  <PlaylistRemoveIcon sx={{mx: 1}} /></Button> : <Button variant="outlined" onClick={() => add()} sx={{ backgroundColor: "grey.900", color: "white", ":hover": { backgroundColor: "gray", borderColor: "grey" } }}>Add  <PlaylistAddIcon sx={{mx: 1}} /></Button>}
            </CardContent>
            <CardMedia
                component="img"
                alt="Cover"
                height="280"
                image={props?.image}
            />
            <CardContent sx={{ display: "flex", alignContent: "center", alignItems: "center", justifyContent: "flex-start", justifyItems: "flex-start" }}>
                <Link to={`/show/${props?.titleId}`} style={{"text-decoration": "none", "color":"black"}}>
                    <Typography gutterBottom variant="subtitle2" fontSize={19}>
                        {props?.title}
                    </Typography>
                </Link>
            </CardContent>
        </Card> 
    );    

}

export default SeriesCard