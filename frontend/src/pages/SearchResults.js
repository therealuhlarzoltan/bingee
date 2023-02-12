import { render } from "react-dom";
import React from 'react';
import ReactDOM from 'react-dom';
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import SideDrawer from "../components/SideDrawer";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import Typography from "@mui/material/Typography";

import { useEffect, useState } from "react";







function SearchResults(props) {

    let { user, authTokens } = useContext(AuthContext);

    let { q } = useParams();

    async function PerformSearch() {
        console.log("Should be searching")
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + String(authTokens?.access)
            },
            body: JSON.stringify({ "q": q})
        }
        let response = await fetch('http://127.0.0.1:8000/shows/api/search/title/', requestOptions)
        let data = await response.json()
        console.log(data)
    }

    useEffect(() => {
        PerformSearch();
    }, [])


    return (
        <Box sx={{width: "100%"}}>
            <Grid container columnSpacing={3}>
                <Grid item xs={3}>
                    <SideDrawer firstName={user.firstName} lastName={user.lastName} />
                </Grid>
                <Grid item xs={9}>
                    <Grid item xs={9}>
                        <Typography variant="h4">TV shows matching "{q}"</Typography>
                    </Grid>
                    <Grid item xs={9}>
                        Loading...
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

export default SearchResults