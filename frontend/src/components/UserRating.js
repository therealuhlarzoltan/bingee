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


async function replyToComment(id, text) {

}

async function likeComment(id)  {

}

async function deleteComment(id) {

}

async  function editComment() {

}



function UserRating(props) {
    let { profile, rating, timestamp,
        deleteEndpoint, editEndpoint, profileBaseUrl
    } = props

    return (
        <Paper elevation={3} sx={{borderRadius: "4px"}}>
            <Box>
                <Avatar><FontAwesomeIcon icon="fa-light fa-user" size="xl" /></Avatar>
            </Box>
            <Box>
                <Rating name="read-only" value={rating} readOnly />
            </Box>
            <List>

            </List>
        </Paper>
    )
}

export default UserRating