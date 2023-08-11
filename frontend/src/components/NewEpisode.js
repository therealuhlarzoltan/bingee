import { render } from "react-dom";
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';


import SideDrawer from "../components/SideDrawer";

import { useContext, useState } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import AuthContext from "../context/AuthContext";
import Divider from "@mui/material/Divider";

function NewEpisode(props) {

    let { user, authTokens } = useContext(AuthContext)

    const [episodeDetails, setEpisodeDetails] = useState(props?.episodeData)
    const [internalEpisodeDetails, setInternalEpisodeDetails] = useState(null)
    const { id } = useParams()
    const navigate = useNavigate()





    useEffect(() => {
    }, [])

    return (
        <Grid container columnSpacing={0} rowSpacing={3}>
            <Grid item xs={3} flexDirection="column">
                <SideDrawer firstName={user.firstName} lastName={user.lastName} />
            </Grid>
            <Grid item xs={9} flexDirection="column">
                {!episodeDetails ? (<Stack sx={{ color: 'grey.500' }} spacing={2} direction="row" justifyItems="center" justifyContent="center">
                        <CircularProgress color="inherit" style={{ "position": "absolute", "top": "45%" }} />
                    </Stack>) :
                    <> <Grid item xs={9} flexDirection="row" sx={{height: "50%"}} style={{ "max-width": "100%" }}>
                        {episodeDetails.image ? <img src={episodeDetails.image} style={{maxHeight: "100%", width: "100%"}} /> : null}
                    </Grid>
                        <Grid item xs={9} flexDirection="row" style={{ "max-width": "100%" }}>
                            <Typography variant="h4" sx={{ my: 2 , paddingLeft: "4px"}}>{episodeDetails.episodeTitle}</Typography>
                            <Divider />
                            <ul id="episodeOverviewInfo">
                                <li>S{episodeDetails.season}E{episodeDetails.episode}</li>
                                <li><Link to={`/show/${episodeDetails.seriesId}/`} style={{"text-decoration": "none", "color":"gray", "margin": "0", "display": "inline", ":hover": {textDecoration: "underline"}}}>{episodeDetails.seriesTitle}</Link></li>
                                <li>{episodeDetails.year}</li>
                                <li>Running time: {episodeDetails.runningTimeInMinutes} minutes</li>
                            </ul>
                            <Divider />
                            <p style={{color: "gray", paddingLeft: "4px"}}>{episodeDetails.plotSummary}</p>
                            <Divider />
                        </Grid>
                    </>}
            </Grid>
        </Grid>
    );
}

export default NewEpisode