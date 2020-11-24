import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Button, List, ListItem, Box } from '@material-ui/core';
import { useHistory, Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%'
    },
}));

function ParentVaccinationsList(){
    const history = useHistory();
    const createNewApplicationClick = () => {history.push("/parentnewapp")};
    const classes = useStyles();
    const apps = [
        {id: 0, pacjent: {imie : "Janek", nazwisko : "Kowalski"}, data : "2020-11-24T20:35:45.699Z", szczepionka: "Szczepionka 1"},
        {id: 1, pacjent: {imie : "Piotrek", nazwisko : "Kowalski"}, data : "2020-11-24T20:35:45.699Z", szczepionka: "Szczepionka 2"},
        {id: 2, pacjent: {imie : "Janek", nazwisko : "Kowalski"}, data : "2020-11-24T20:35:45.699Z", szczepionka: "Szczepionka 3"}
    ];
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