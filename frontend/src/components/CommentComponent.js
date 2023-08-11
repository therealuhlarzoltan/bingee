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
import Typography from "@mui/material/Typography";


async function replyToComment(id, text) {

}

async function likeComment(id)  {

}

async function deleteComment(id) {

}

async  function editComment() {

}



function CommentComponent(props) {
    let { profile, text, timestamp,
        likeEndpoint, replyEndpoint, deleteEndpoint,
        editEndpoint, profileBaseUrl, user
    } = props

    return (
        <Paper elevation={3} sx={{width: "320px", m: 2, p: 2, textOverflow: "scroll", borderRadius: "4px"}}>
            <Box display={"flex"} flexDirection={"row"} alignItems={"center"} sx={{gap: "6px"}}>
                <Avatar><FontAwesomeIcon icon="fa-light fa-user" size="xl" /></Avatar>
                <Link to={"/"} style={{"text-decoration": "none", "color":"black"}}><Typography variant="subtitle" sx={{fontWeight: "bold"}}>@{props?.profile.username}</Typography></Link>
            </Box>
            <Box>
                <Typography variant="paragraph">{props?.text}</Typography>
            </Box>
            <List>

            </List>
        </Paper>
    )
}

export default CommentComponent