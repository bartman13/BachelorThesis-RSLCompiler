import React, { useState, useEffect, useContext } from "react";
import UserContext from '../contexts/UserContext';
import SnackbarContext from '../contexts/SnackbarContext';
import LoadingContext from '../contexts/LoadingContext';
import axios from 'axios';
import apiURL from '../shared/apiURL';
import authHeader from '../shared/authheader';
import { List, ListItem, Container, Typography, Grid, Button, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { buttonSuccess } from '../styles/buttons';

const useStyles = makeStyles((theme) => ({
    buttonSuccess : buttonSuccess
}));

function ParentChildrenList(){
    const [children, setChildren] = useState([]);

    const { user } = useContext(UserContext);
    const { setLoading } = useContext(LoadingContext);
    const { setSnackbar } = useContext(SnackbarContext);

    const classes = useStyles();

    useEffect(() => {
        async function fetchData(){
            setLoading(true);
            try{
                const childrenData = await axios.get(apiURL + 'Dzieci', authHeader(user));
                setChildren(childrenData.data);
            }catch(error){
                console.error(error);
                setSnackbar({
                    open: true,
                    message: "Błąd ładowania danych",
                    type: "error"
                });
            }
            setLoading(false);
        }

        fetchData();
    }, [setChildren, setLoading, setSnackbar, user]);

    return(
        <Container maxWidth='md'>
            <Grid container spacing={3}
                direction="row">
                <Grid item align="center" xs={12}>
                    <Typography variant="h4" gutterBottom>
                        Moje dzieci
                    </Typography>
                </Grid>
                <Grid item align="center" xs={12}>
                    <List>
                        {children.map(c => {
                            return (
                                <ListItem key={c.id}
                                    component={Link}
                                    to={'/parentchildren/' + c.id}>
                                    {c.imie + " " + c.nazwisko} 
                                </ListItem>
                            );
                        })}
                    </List>
                </Grid>
                <Grid item align="right" xs={12}>
                    <Button
                        className={classes.buttonSuccess}
                        component={Link}
                        to={'/addchild'}>
                            Dodaj nowe dziecko
                    </Button>
                </Grid>
            </Grid>
        </Container> 
    );
}

export default ParentChildrenList;