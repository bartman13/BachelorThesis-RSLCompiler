import React, { useState, useEffect, useContext } from "react";
import UserContext from '../contexts/UserContext'
import { makeStyles } from '@material-ui/core/styles';
import { Button, List, ListItem, Box, Paper } from '@material-ui/core';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import { buttonSuccess } from "../styles/buttons";
import authHeader from '../shared/authheader';
import apiURL from '../shared/apiURL';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%'
    },
    listItem : {
        "&:hover": {
            backgroundColor: 'inherit'
        },
        margin: '10px'
    },
    paper : {
        backgroundColor: '#dbf0ff',
        width: '100%',
        padding: '14px'
        
    },
    button: buttonSuccess
    
}));

function ParentVaccinationsList(){
    const history = useHistory();
    const createNewApplicationClick = () => {history.push("/parentnewapp")};
    const classes = useStyles();
    const [apps, setApps] = useState([]);
    const {user} = useContext(UserContext);
    const [appHovered, setAppHovered] = useState(-1);

    const makePaper = (a, i) => {
        return(
            <ListItem className={classes.listItem} button component={Link} to={"/apphistory/" + a.id} key={i}> 
                <Paper  elevation={appHovered===i?24:6} className={classes.paper} 
                    onMouseEnter={() => {setAppHovered(i)}}
                    onMouseLeave={() => {setAppHovered(-1)}}> 
                    {a.pacjent.imie + ' | '} 
                   
                    {a.pacjent.nazwisko + ' | '} 
                    
                    {a.data + ' |' } 
                   
                    {a.szczepionka}
                </Paper> 
            </ListItem>
        );
    }

    useEffect(() => {
        axios.get(apiURL + 'Rodzic/' + user.id, authHeader(user)
        ).then(data => setApps(data.data));

    },[setApps, user]);
    return(
        <div className="container">
            <div className={classes.root}>
                <Box p={3}>
                    <Button variant="contained" className={classes.button} onClick={createNewApplicationClick}> Utwórz nowe </Button>
                </Box>
                <List component="nav">
                    {apps.map((a, i) => makePaper(a, i))}
                </List>
              

            </div>
        </div>
    );
}

export default ParentVaccinationsList;