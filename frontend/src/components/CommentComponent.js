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
import TextareaAutosize from "@mui/base/TextareaAutosize";
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';



function CommentComponent(props) {

    const [isLiked, setIsLiked] = useState(props?.isLiked)
    const [likeCount, setLikeCount] = useState(props?.likeCount)
    const [isEditing, setIsEditing] = useState(false)
    const [isReplying, setIsReplying] = useState(false)
    const [replyText, setReplyText] = useState("")
    const [editedText, setEditedText] = useState(props?.text)
    const [text, setText] = useState(props?.text)
    const [timestamp, setTimestamp] = useState(props?.timestamp)
    const [replies, setReplies] = useState(null)
    const [isDisplayingReplies, setIsDisplayingReplies] = useState(false)

    let { profile, authTokens, user,
        areReplies, id, episodeOrSeries, otherComments, setComments, replyId
    } = props

    let replyList = []

    if (replies) {
        replyList = replies.map((comment) =>
            <CommentComponent key={comment.id} text={comment.text}
               profile={comment.profile}
               timestamp={comment.timestamp} user={user} id={comment.id}
               authTokens={authTokens} likes={comment.likes}
               areReplies={comment.areReplies}
               isLiked={comment.isLiked}
               episodeOrSeries={episodeOrSeries}
               likeCount={comment.likes}
               otherComments={replies} setComments={setReplies}
               replyId={replyId}/>)
    }
    async function replyToComment(parentId, commentId, text) {
        if (replyText && replyText.length >= 4) {
            let requestOptions;
            try {
                if (episodeOrSeries === "episode") {
                    requestOptions = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": 'Bearer ' + String(authTokens?.access)
                        },
                        body: JSON.stringify({
                            "episode_id": parentId,
                            "reply_to": commentId,
                            "text": text
                        })
                    }
                } else if (episodeOrSeries === "series") {
                    requestOptions = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": 'Bearer ' + String(authTokens?.access)
                        },
                        body: JSON.stringify({
                            "title_id": parentId,
                            "reply_to": commentId,
                            "text": text
                        })
                    }
                }
                let response = await fetch(`/feedback/api/comment/${episodeOrSeries}/`, requestOptions)
                if (response.status === 201) {
                    let data = await response.json()
                    setIsReplying(false)
                    getReplies(id)
                }
            }
            catch (error) {
                console.error(error)
            }
        }
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
        try {
            const requestOptions = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + String(authTokens?.access)
                }
            }
            let response = await fetch(`/feedback/api/comment/${episodeOrSeries}/delete/${id}/`, requestOptions)
            if (response.status === 204) {
                otherComments.forEach((comment, index) =>
                    {
                        if (comment.id === id) {
                            otherComments.splice(index, 1)
                        }
                    }
                )
                const newState = [...otherComments]
                setComments(newState)


            }
        } catch (error) {
            console.error(error)
        }
    }

    async  function editComment(id, text) {
        try {
            const requestOptions = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + String(authTokens?.access)
                },
                body: JSON.stringify({
                    "text": text
                })
            }
            let response = await fetch(`/feedback/api/comment/${episodeOrSeries}/edit/${id}/`, requestOptions)
            if (response.ok)
            {
                let data = await response.json()
                setText(data.text)
                setTimestamp(data.timestamp)
                setIsLiked(data.isLiked)
                setLikeCount(data.likes)
                setIsEditing(false)
            }

        } catch (error) {
            console.error(error)
        }
    }

    async function getReplies(id) {
        try {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer ' + String(authTokens?.access)
                }
            }
            let response = await fetch(`/feedback/api/${episodeOrSeries}/comment/replies/get/${id}/`, requestOptions)
            if (response.ok) {
                let data = await response.json()
                setReplies(data)
                setIsDisplayingReplies(true)
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Paper elevation={3} sx={{width: "320px", m: 2, p: 2, textOverflow: "scroll", borderRadius: "4px"}}>
            <Box display={"flex"} flexDirection={"row"} alignItems={"center"} sx={{gap: "6px"}}>
                <Avatar><i className="fa-regular fa-user fa-lg"/></Avatar>
                <Link to={"/"} style={{"text-decoration": "none", "color":"black"}}><Typography variant="subtitle" sx={{fontWeight: "bold"}}>@{props?.profile.username}</Typography></Link>
            </Box>
            { isEditing ? <>
                <Box>
                    <TextareaAutosize
                        value={editedText}
                        onChange={event => setEditedText(event.target.value)}
                        minRows={3}
                        placeholder={"Edit your comment here"}
                        sx={{
                            width: "320px",
                            fontFamily: "sans-serif",
                            fontSize: "0.875rem",
                            fontWeight: "400",
                            lineHeight: "1.5",
                            padding: "12px",
                            borderRadius: "12px 12px 0 12px"
                        }}
                    />
                </Box>
                <List orientation="horizontal">
                    <ListItem>
                        <Button size={"small"} onClick={() => {editComment(id, editedText);}} variant="contained" endIcon={<DoneIcon />}>
                            Done
                        </Button>
                    </ListItem>
                    <ListItem>
                        <Button size={"small"} onClick={() => {setEditedText(text), setIsEditing(false)}} variant="outlined" startIcon={<ClearIcon />}>
                            Discard
                        </Button>
                    </ListItem>
                </List>
            </> : <>
            <Box>
                <Typography variant="paragraph">{text}</Typography>
            </Box>
            <Box display={"flex"} flexDirection={"row-reverse"}>{timestamp?.substring(0, 10)}</Box>
            <List orientation="horizontal" sx={{ marginBottom: 0 }}>
                <ListItem><span style={{"cursor":"pointer", "margin-right":"5px"}}>{ isLiked ? <i className="fa-solid fa-heart fa-lg" onClick={() => likeComment(id)}></i> : <i className="fa-regular fa-heart fa-lg" onClick={() => likeComment(id)} />}</span>{likeCount}</ListItem>
                <ListItem><span style={{"cursor":"pointer"}} onClick={() => setIsReplying(true)}><i className="fa-solid fa-reply"></i></span></ListItem>
                { areReplies ? <ListItem> { isDisplayingReplies ? <span style={{"cursor":"pointer"}} onClick={() => setIsDisplayingReplies(false)}><i className="fa-solid fa-arrow-up-short-wide fa-lg"></i></span> : <span style={{"cursor":"pointer"}} onClick={() => getReplies(id)}><i className="fa-solid fa-arrow-down-short-wide fa-lg"></i></span>}</ListItem> : null }
                {profile.id === user.profileId ? <ListItem><span style={{"cursor":"pointer"}} onClick={() => setIsEditing(true)}> <i className="fa-solid fa-pen-to-square"></i></span></ListItem>: null}
                {profile.id === user.profileId ? <ListItem><span style={{"cursor":"pointer"}}><i className="fa-solid fa-trash" onClick={() => deleteComment(id)}></i></span></ListItem> : null}
            </List>
            </>}
        </Paper>
            { isReplying && <>
                <Paper elevation={3} sx={{width: "320px", m: 2, p: 2, textOverflow: "scroll", borderRadius: "4px"}}>
                    <Box display={"flex"} flexDirection={"row"} alignItems={"center"} sx={{gap: "6px"}}>
                        <Avatar><i className="fa-regular fa-user fa-lg"/></Avatar>
                        <Link to={"/"} style={{"text-decoration": "none", "color":"black"}}><Typography variant="subtitle" sx={{fontWeight: "bold"}}>@{props?.profile.username}</Typography></Link>
                    </Box>
                    <Box>
                    <TextareaAutosize
                        value={replyText}
                        onChange={event => setReplyText(event.target.value)}
                        minRows={3}
                        placeholder={`Replying to @${profile?.username}`}
                        sx={{
                            width: "320px",
                            fontFamily: "sans-serif",
                            fontSize: "0.875rem",
                            fontWeight: "400",
                            lineHeight: "1.5",
                            padding: "12px",
                            borderRadius: "12px 12px 0 12px"
                        }}
                    />
                </Box>
                <List orientation="horizontal">
                    <ListItem>
                        <Button size={"small"} onClick={() => {replyToComment(replyId, id, replyText);}} variant="contained" endIcon={<DoneIcon />}>
                            Done
                        </Button>
                    </ListItem>
                    <ListItem>
                        <Button size={"small"} onClick={() => {setReplyText(""), setIsReplying(false)}} variant="outlined" startIcon={<ClearIcon />}>
                            Discard
                        </Button>
                    </ListItem>
                </List>
                </Paper>
            </> }
                { isDisplayingReplies && <Paper sx={{marginTop: 0}} elevation={5}><Box sx={{display: "flex", flexDirection: "column", justifyContent: "flex-end", marginTop: 0}}>
                    {replyList}
                </Box></Paper>
                }
        </Box>
    )
}

export default CommentComponent