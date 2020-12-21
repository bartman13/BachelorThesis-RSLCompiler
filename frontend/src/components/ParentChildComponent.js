import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../contexts/UserContext';
import axios from 'axios';
import apiURL from '../shared/apiURL';
import authHeader from '../shared/authheader';
import { makeStyles, Container, Grid, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { buttonSuccess } from '../styles/buttons';
import Form from "@material-ui/core/FormControl";
import LoadingContext from "../contexts/LoadingContext";
import SnackbarContext from "../contexts/SnackbarContext";
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    buttonSuccess : buttonSuccess
}));

function ParentChild(props){
    const { childId } = props;
    const classes = useStyles();

    const [child, setChild] = useState({});
    const [doctors, setDoctors] = useState([]);

    const { user } = useContext(UserContext);
    const { setLoading } = useContext(LoadingContext);
    const { setSnackbar } = useContext(SnackbarContext);

    const history = useHistory();

    const handleChange = (event) => {
        setChild({
            ...child,
            [event.target.name] : event.target.value
        });
    }

    const save = async () => {
        setLoading(true);
        try{
            await axios.post(apiURL + 'Dziecko/' + (childId === undefined ? '' : childId), {...child, dataUrodzenia : child.data_urodzenia + "T00:00:00"}, authHeader(user));
            setSnackbar({
                open: true,
                message: "Dane pomyślnie zapisano",
                type: "success"
            });
            history.push('/parentchildren');
        } catch (error) {
            console.error(error);
            setSnackbar({
                open: true,
                message: "Wystąpił błąd",
                type: "error"
            });
        }
        setLoading(false);
    }

    useEffect(() => {
        async function fetchData(){
            setLoading(true);
            try{
                if(childId !== undefined){
                    const childData = await axios.get(apiURL + 'Dziecko/' + childId, authHeader(user));
                    setChild({...childData.data, data_urodzenia : childData.data.dataUrodzenia.substring(0, 10)});
                }
                const doctorsData = await axios.get(apiURL + 'Lekarze', authHeader(user));
                setDoctors(doctorsData.data);
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
                            {childId === undefined?"Utwórz nowe dziecko":"Edycja danych dziecka"}
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
                            id="date"
                            label="Data urodzenia"
                            type="date"
                            name="data_urodzenia"
                            value={child.data_urodzenia || ''}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} align="center">
                        <FormControl className={classes.formControl}>
                            <InputLabel id="lekarzId"> Lekarz </InputLabel>
                            <Select
                                labelId="lekarzId"
                                value={child.lekarzId || ''}
                                onChange={handleChange}
                                name="lekarzId">
                                {doctors.map((l, i) =>{
                                    return(
                                        <MenuItem key={i} value={l.id}> {l.imie + " " + l.nazwisko} </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
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