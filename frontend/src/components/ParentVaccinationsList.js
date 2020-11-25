import React, { useState, useEffect, useContext } from "react";
import UserContext from '../contexts/UserContext'
import { makeStyles } from '@material-ui/core/styles';
import { Button, List, ListItem, Box } from '@material-ui/core';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%'
    },
}));

function ParentVaccinationsList(){
    const history = useHistory();
    const createNewApplicationClick = () => {history.push("/parentnewapp")};
    const classes = useStyles();
    const [apps, setApps] = useState([]);
    const {user} = useContext(UserContext);
    useEffect(() => {
        axios.get('https://localhost:44304/Rodzic',
            {
                params: {
                    id: user.id
                }
            },
            {
                headers: { Authorization: `Bearer ${user.token}` }
            }
        ).then(data => setApps(data.data));
    });
    return(
        <div className="container">
            <div className={classes.root}>
                <Box p={3}>
                    <Button variant="contained" color="primary" onClick={createNewApplicationClick}> Utwórz nowe </Button>
                </Box>
                <List component="nav">
                    {apps.map((a, i) => (<ListItem button component={Link} to={"/apphistory/" + a.id} key={i}> 
                        {a.pacjent.imie + " " +a.pacjent.nazwisko + ", " + a.data + ", " + a.szczepionka} </ListItem>))}
                </List>
            </div>
        </div>
    );
}

export default ParentVaccinationsList;