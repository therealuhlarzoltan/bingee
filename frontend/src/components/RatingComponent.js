import React from 'react';
import ReactDOM from 'react-dom';
import { useState, useEffect, useContext } from "react";
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Avatar from '@mui/material/Avatar';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Rating from '@mui/material/Rating';
import Typography from "@mui/material/Typography";


async function replyToComment(id, text) {

}

async function likeComment(id)  {

}

async function deleteComment(id) {

}

async  function editComment() {

}



function RatingComponent(props) {
    let { profile, rating, timestamp,
         profileBaseUrl
    } = props

    return (
        <Paper elevation={3} sx={{borderRadius: "4px", width: "320px", m : 2, p: 2}}>
            <Box display={"flex"} flexDirection={"row"} alignItems={"center"} sx={{gap: "6px", mb: 1}}>
                <Avatar><FontAwesomeIcon icon="fa-light fa-user" size="xl" /></Avatar>
                <Link to={"/"} style={{"text-decoration": "none", "color":"black"}}><Typography variant="subtitle" sx={{fontWeight: "bold"}}>@{profile.username}</Typography></Link>
            </Box>
            <Box>
                <Rating name="read-only" value={rating} precision={0.5} readOnly />
            </Box>
            <Box display={"flex"} flexDirection={"row-reverse"}>{props?.timestamp.substring(0, 10)}</Box>
        </Paper>
    )
}

export default RatingComponent