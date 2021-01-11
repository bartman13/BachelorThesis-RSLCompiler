import React, { useState, useEffect, useContext } from "react";
import UserContext from '../contexts/UserContext';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Box, Paper, Grid, TextField, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { buttonSuccess } from "../styles/buttons";
import authHeader from '../shared/authheader';
import apiURL from '../shared/apiURL';
import LoadingContext from "../contexts/LoadingContext";
import SnackbarContext from "../contexts/SnackbarContext";
import formatDate from "../shared/formatDate";
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%'
    },
    paper : {
        width: '100%',
        height: '100%',
        padding: '20px',
        cursor: 'pointer'
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

    const classes = useStyles();

    const createNewApplicationClick = () => {history.push("/parentnewapp")};
    const makePaper = (a, i) => {
        const onPaperClick = () => {
            history.push("/apphistory/" + a.id)
        };

        return(
            <Paper elevation={appHovered===i?24:6} className={classes.paper} 
                onMouseEnter={() => {setAppHovered(i)}}
                onMouseLeave={() => {setAppHovered(-1)}}
                onClick={onPaperClick}> 
                <Grid container spacing={3}>
                    <Grid item xs={12} align="center">
                        <Typography> Zgłoszenie nr {a.id} </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            defaultValue={a.pacjent.imie || ''}
                            label="Imię pacjenta"
                            variant="filled"
                            fullWidth
                            InputProps={{
                                readOnly: true
                            }}
                            inputProps={{
                                style: {cursor : "pointer"}
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            defaultValue={a.pacjent.nazwisko || ''}
                            label="Nazwisko pacjenta"
                            variant="filled"
                            fullWidth
                            InputProps={{
                                readOnly: true
                            }}
                            inputProps={{
                                style: {cursor : "pointer"}
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            defaultValue={a.dataSzczepienia ? formatDate(true, a.dataSzczepienia) : ''}
                            label="Data szczepienia"
                            variant="filled"
                            fullWidth
                            InputProps={{
                                readOnly: true
                            }}
                            inputProps={{
                                style: {cursor : "pointer"}
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            defaultValue={a.dataUtworzenia ? formatDate(true, a.dataUtworzenia) : ''}
                            label="Data utworzenia zgłoszenia"
                            variant="filled"
                            fullWidth
                            InputProps={{
                                readOnly: true
                            }}
                            inputProps={{
                                style: {cursor : "pointer"}
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {a.noweDane ? <Alert severity="info"> Nowe informacje </Alert> : null}
                    </Grid>
                </Grid>
            </Paper>
        );
    }

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
                <Grid container spacing={3}>
                    {apps.map((a, i) =>
                        <Grid item xs={12} md={6} lg={4} align="center" key={i}>
                            {makePaper(a, i)}
                        </Grid>     
                    )}
                </Grid>
            </div>
        </div>
    );
}

export default ParentVaccinationsList;