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


function CommentComponent(props) {

    const [isLiked, setIsLiked] = useState(props?.isLiked)
    const [likeCount, setLikeCount] = useState(props?.likeCount)

    let { profile, text, timestamp, authTokens, user,
        areReplies, id, episodeOrSeries
    } = props

    async function replyToComment(id, text) {

    }

    async function likeComment(id)  {
        try {
            if (!isLiked) {
                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": 'Bearer ' + String(authTokens?.access)
                    }
                }
                let response = await fetch(`/feedback/api/like/${episodeOrSeries}/comment/${id}/`, requestOptions)
                if (response.status === 201) {
                    let data = await response.json()
                    setIsLiked(true)
                    setLikeCount(data["likes"])
                }
            } else {
                const requestOptions = {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": 'Bearer ' + String(authTokens?.access)
                    }
                }
                let response = await fetch(`/feedback/api/like/${episodeOrSeries}/comment/${id}/`, requestOptions)
                if (response.status === 200) {
                    let data = await response.json()
                    setIsLiked(false)
                    setLikeCount(data["likes"])
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    async function deleteComment(id) {

    }

    async  function editComment() {

    }

    return (
        <Paper elevation={3} sx={{width: "320px", m: 2, p: 2, textOverflow: "scroll", borderRadius: "4px"}}>
            <Box display={"flex"} flexDirection={"row"} alignItems={"center"} sx={{gap: "6px"}}>
                <Avatar><i className="fa-regular fa-user fa-lg"/></Avatar>
                <Link to={"/"} style={{"text-decoration": "none", "color":"black"}}><Typography variant="subtitle" sx={{fontWeight: "bold"}}>@{props?.profile.username}</Typography></Link>
            </Box>
            <Box>
                <Typography variant="paragraph">{props?.text}</Typography>
            </Box>
            <Box display={"flex"} flexDirection={"row-reverse"}>{timestamp?.substring(0, 10)}</Box>
            <List orientation="horizontal">
                <ListItem><span style={{"cursor":"pointer", "margin-right":"5px"}}>{ isLiked ? <i className="fa-solid fa-heart fa-lg" onClick={() => likeComment(id)}></i> : <i className="fa-regular fa-heart fa-lg" onClick={() => likeComment(id)} />}</span>{likeCount}</ListItem>
                <ListItem><span style={{"cursor":"pointer"}}><i className="fa-solid fa-reply"></i></span></ListItem>
                { areReplies ? <ListItem><span style={{"cursor":"pointer"}}><i className="fa-solid fa-arrow-down-short-wide fa-lg"></i></span></ListItem> : null }
                {profile.id === user.profileId ? <ListItem><span style={{"cursor":"pointer"}}> <i className="fa-solid fa-pen-to-square"></i></span></ListItem>: null}
                {profile.id === user.profileId ? <ListItem><span style={{"cursor":"pointer"}}><i className="fa-solid fa-trash"></i></span></ListItem> : null}
            </List>
        </Paper>
    )
}

export default CommentComponent