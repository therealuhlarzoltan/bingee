import { render } from "react-dom";
import React from 'react';
import ReactDOM from 'react-dom';
import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { grey, purple } from "@mui/material/colors";

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExploreIcon from '@mui/icons-material/Explore';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function SideDrawer(props) {

  const navigate = useNavigate();
  let { firstName, lastName, username } = props;

  function handleSearchFormSubmitted() {
    if (searchValue != "") {
      navigate(`/search/${searchValue}/`);
    }
 
  }

  const [searchValue, setSearchValue] = useState("");

  const handleSearchValueChanged = (event) => {
    setSearchValue(event.target.value)
  }


  // const drawerWidth = 320;

    return (
        <Drawer
        sx={{
          backgroundColor: grey[800],
          color: purple[800],
          width: "25%",
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: "25%",
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Typography variant="h3" sx={{m: 2}}>Bingee</Typography>
        </Toolbar>
        <Divider />
        <List>
          <ListItem key={"search"}>
              <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
              >
                <IconButton type="button" sx={{ p: '10px'}} aria-label="search" onClick={handleSearchFormSubmitted}>
                  <SearchIcon />
                </IconButton>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search TV Series"
                  inputProps={{ 'aria-label': 'search google maps' }}
                  onChange={handleSearchValueChanged}
                />
              </Paper>
          </ListItem>
            <ListItem key={"Watchlist"} disablePadding>
              <ListItemButton onClick={() => navigate("/")}>
                <ListItemIcon>
                    <PlaylistAddCheckIcon />
                </ListItemIcon>
                <ListItemText primary={"Watchlist"} />
              </ListItemButton>
            </ListItem>
            <ListItem key={"Profile"} disablePadding>
              <ListItemButton onClick={() => navigate(`/profile/${username}/`)}>
                <ListItemIcon>
                    <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText primary={"Profile"} />
              </ListItemButton>
            </ListItem>


        </List>
        
        <Divider />
        <Typography variant="subtitle2" sx={{ mt: 2, ml: 2 }}>{firstName?.toUpperCase()} {lastName?.toUpperCase()}</Typography>
        <List>
            <ListItem key={"Settings"} disablePadding>
              <ListItemButton onClick={() => navigate("/settings/")}>
                <ListItemIcon>
                <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary={"Settings"} />
              </ListItemButton>
            </ListItem>
            <Link to={"/logout/"} style={{"text-decoration": "none", "color":"black"}}>
            <ListItem key={"Logout"} disablePadding>
              
              <ListItemButton>
                <ListItemIcon>
                    <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary={"Logout"} />
              </ListItemButton>
            </ListItem>
            </Link>
        </List>
      </Drawer>
    );
}

export default SideDrawer