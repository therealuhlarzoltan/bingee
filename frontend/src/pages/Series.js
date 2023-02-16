import { render } from "react-dom";
import React from 'react';
import ReactDOM from 'react-dom';
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import { Box, height } from "@mui/system";
import SideDrawer from "../components/SideDrawer";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import Typography from "@mui/material/Typography";

import { useEffect, useState } from "react";

import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import AddedSeries from "../components/AddedSeries";
import NewSeries from "../components/NewSeries";


function Series(props) {

    return (
        props?.added ? <AddedSeries /> : <NewSeries />
    );
}

export default Series