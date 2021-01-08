import React, { useState, useEffect, useContext } from "react";
import UserContext from '../contexts/UserContext';
import { makeStyles } from '@material-ui/core/styles';
import { Button, List, ListItem, Box, Paper } from '@material-ui/core';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import { buttonSuccess } from "../styles/buttons";
import authHeader from '../shared/authheader';
import apiURL from '../shared/apiURL';
import LoadingContext from "../contexts/LoadingContext";
import SnackbarContext from "../contexts/SnackbarContext";
import FormatDate from "../shared/formatDate";

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
    const [apps, setApps] = useState([]);
    const [appHovered, setAppHovered] = useState(-1);

    const { user } = useContext(UserContext);
    const { setLoading } = useContext(LoadingContext);
    const { setSnackbar } = useContext(SnackbarContext);

    const createNewApplicationClick = () => {history.push("/parentnewapp")};
    const makePaper = (a, i) => {
        return(
            <ListItem className={classes.listItem} button component={Link} to={"/apphistory/" + a.id} key={i}> 
                <Paper  elevation={appHovered===i?24:6} className={classes.paper} 
                    onMouseEnter={() => {setAppHovered(i)}}
                    onMouseLeave={() => {setAppHovered(-1)}}> 
                    {a.pacjent.imie + ' | '} 
                   
                    {a.pacjent.nazwisko + ' | '} 
                    
                    {FormatDate(true, a.dataUtworzenia) + ' |' } 
                   
                    {a.szczepionka}
                </Paper> 
            </ListItem>
        );
    }

    const classes = useStyles();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try{
                const response = await axios.get(apiURL + 'Rodzic', authHeader(user));
                setApps(response.data);
            } catch (error){
                console.error(error);
                setSnackbar({
                    open: true,
                    message: "Błąd ładowania danych",
                    type: "error",
                });
            }
            setLoading(false);
        }

        fetchData();
    }, [setApps, user, setLoading, setSnackbar]);

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