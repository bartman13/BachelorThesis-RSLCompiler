import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../contexts/UserContext';
import axios from 'axios';
import apiURL from '../shared/apiURL';
import authHeader from '../shared/authheader';
import { makeStyles, Container, Grid, Typography, TextField, Button } from '@material-ui/core';
import { buttonSuccess } from '../styles/buttons';
import Form from "@material-ui/core/FormControl";
import LoadingContext from "../contexts/LoadingContext";
import SnackbarContext from "../contexts/SnackbarContext";

const useStyles = makeStyles((theme) => ({
    buttonSuccess : buttonSuccess
}));

function ParentChild(props){
    const { childId } = props;
    const [child, setChild] = useState({
        id: 0,
        imie: 'Janek',
        nazwisko: 'Kowalski',
        data_urodzenia: '2020-12-04T14:04'
    });

    const { user } = useContext(UserContext);
    const { setLoading } = useContext(LoadingContext);
    const { setSnackbar } = useContext(SnackbarContext);

    const classes = useStyles(); 

    const handleChange = (event) => {
        setChild({
            ...child,
            [event.target.name] : event.target.value
        })
    }

    const save = () => {
        console.log(child);
    }

    useEffect(() => {
        async function fetchData(){
            setLoading(true);
            try{
                const childData = await axios.get(apiURL + 'Rodzic/' + childId, authHeader(user));
                setChild(childData.data);
            }catch(error){
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
    }, [setChild, setLoading, setSnackbar, user, childId]);

    return(
        <Container maxWidth="md">
            <Form>
                <Grid container direction="row">
                    <Grid item xs={12} align="center">
                        <Typography variant="h4" gutterBottom>
                            Edycja danych dziecka
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <TextField 
                            label="Imię"
                            value={child.imie || ''}
                            name="imie"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} align="center">
                        <TextField 
                            label="Nazwisko"
                            value={child.nazwisko || ''}
                            name="nazwisko"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} align="center">
                        <TextField
                            id="datetime-local"
                            label="Data urodzenia"
                            type="datetime-local"
                            name="data_urodzenia"
                            value={child.data_urodzenia || ''}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} align="right">
                        <Button 
                            variant="contained"
                            color="primary"
                            onClick={save}
                            className={classes.buttonSuccess}> 
                            Zapisz 
                        </Button>
                    </Grid>
                </Grid>
            </Form>
        </Container>
    );
}

export default ParentChild;