import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../contexts/UserContext'
import { Box, Button, Container, makeStyles } from '@material-ui/core';
import { Grid, TextField, Select, InputLabel, MenuItem, FormControl, Typography,
    FormControlLabel, Checkbox, Snackbar } from '@material-ui/core';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import NOPCreator from './NOPCreatorComponent';
import FormData from 'form-data';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import authHeader from '../shared/authheader';
import apiURL from '../shared/apiURL';
import Alert from './AlertComponent';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 240,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    }
}));

function ParentNewApp(){
    const [vaccines, setVaccines] = useState([
        {
            id : 0,
            nazwa : 'Menveo',
            opis: `Produkt Menveo jest przeznaczony do czynnego uodpornienia dzieci (w wieku od 2 lat), młodzieży
            i dorosłych narażonych na kontakt z dwoinkami zapalenia opon mózgowych (Neisseria meningitidis)
            z grup serologicznych A, C, W135 i Y, w celu zapobiegania chorobie inwazyjnej.
            Szczepionkę należy stosować zgodnie z obowiązującymi oficjalnymi zaleceniami.`
        }
    ]); 
    const [children, setChildren] = useState([
        {id: 0, imie: "Janek", nazwisko: "Kowalski"},
        {id: 1, imie: "Piotrek", nazwisko: "Kowalski"}
    ]);
    const [nops, setNops] = useState([
                {
                    nazwa : 'Kaszel',
                    id : 0,
                    atrybuty : [
                        {
                            id : 0,
                            nazwa : 'Stopień',
                            typ : 'select',
                            info : 'Lekki;Średni;Silny' 
                        },
                        {
                            id: 1,
                            nazwa: 'Typ',
                            typ: 'select',
                            info: 'Mokry;Suchy'
                        }
                    ]
                },
                {
                    nazwa: 'Gorączka',
                    id: 1,
                    atrybuty: [
                        {
                            id: 3,
                            nazwa: 'Temperatura',
                            typ: 'number',
                            info: 'Stopnie Celsjusza'
                        }
                    ]
                }
            ]);
    const [selectedChild, setSelectedChild] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 16));
    const [selectedVaccine, setSelectedVaccine] = useState('');
    const [imageKsZd, setImageKsZd] = useState('');
    const [selectedNOPs, setSelectedNOPs] = useState([]);
    const [contact, setContact] = useState(false);
    const [touched] = useState([false, false, false]);
    const [snackbarState, setSnackbarState] = useState({
        open: false,
        message: '',
        type: 'success'
    });
    const {user} = useContext(UserContext);
    const history = useHistory();

    const handleVaccineChange = async (event) => {
        setSelectedVaccine(event.target.value);
        setNops([]);
        const n = await axios(apiURL + 'Rodzic/', authHeader(user));
        setNops(n.data);
        touched[0] = true;
    };
    const handleChildChange = (event) => {
        setSelectedChild(event.target.value);
        touched[1] = true;
    };
    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };
    const handleImageKsZdChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => {
              setImageKsZd({ 
                  file: e.target.result, 
                  name: event.target.files[0].name, 
                  type: event.target.files[0].type
                });
            };
            reader.readAsDataURL(event.target.files[0]);
            touched[2] = true;
        }
    };
    const handleContactChange = (event) => {
        setContact(event.target.checked);
    };
    const submit = async () => {
        let data = new FormData();
        data.append('data', selectedDate);
        data.append('szczepionkaId', selectedVaccine);
        data.append('pacjentId', selectedChild);
        data.append('prosba_o_kontakt', contact);
        data.append('nopy', selectedNOPs.map(n => {
            return {
                id: n.id,
                atrybuty: n.atrybuty.map(a => {
                    return {
                        id: a.id,
                        wartosc: a.wartosc
                    };
                })
            };
        }));
        data.append('zdjecieKsZd', imageKsZd.file);
        try {
            await axios.post(apiURL + 'Rodzic/', data, {
                headers : {
                    'accept': 'application/json',
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`
                }
            });
            setSnackbarState({
                open: true,
                type: 'success',
                message: 'Zgłoszenie pomyślnie utworzono'
            });
            setTimeout(() => {
                history.push('/parenthome');
            }, 2000); 
        } catch (error) {
            console.error(error);
            setSnackbarState({
                open: true,
                type: 'error',
                message: 'Wystąpił błąd'
            });
        }
    };
    const snackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarState({
            ...snackbarState,
            open: false
        });
    };

    const classes = useStyles();

    useEffect(() => {
        axios.get(apiURL + 'Rodzic/', authHeader(user))
            .then(data => setChildren(data.data));
        axios.get(apiURL + 'Rodzic/', authHeader(user))
            .then(data => setVaccines(data.data));
    });

    return (
        <Container maxWidth='md'> 
            <Grid container spacing={3}
                direction="row">
                <Grid item xs={12} align="center">
                <Typography variant="h4" gutterBottom>
                    Nowe zgłoszenie
                </Typography>
                </Grid>
                <Grid item xs={1} align="center">
                  <Box padding={2}> 1. </Box>
                </Grid>
                <Grid item xs={11}>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="chldId"> Dziecko </InputLabel>
                        <Select
                            labelId="chldId"
                            value={selectedChild}
                            onChange={handleChildChange}>
                            {children.map((c, i) =>{
                                return(
                                    <MenuItem key={i} value={c.id}> {c.imie + ' ' + c.nazwisko} </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={1} align="center">
                  <Box padding={2}> 2. </Box>
                </Grid>
                <Grid item xs={11}>
                    <TextField
                        id="datetime-local"
                        label="Data wykonania szczepienia"
                        type="datetime-local"
                        value={selectedDate}
                        onChange={handleDateChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item xs={1} align="center">
                  <Box padding={2}> 3. </Box>
                </Grid>
                <Grid item xs={11}>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="vaccId"> Nazwa szczepionki </InputLabel>
                        <Select
                            labelId="vaccId"
                            value={selectedVaccine}
                            onChange={handleVaccineChange}>
                            {vaccines.map(v =>{
                                return(
                                    <MenuItem key={v.id} value={v.id}> {v.nazwa} </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                    <Box>
                        {vaccines.find(v => v.id === selectedVaccine)?.opis}
                    </Box>
                </Grid>
                <Grid item xs={1} align="center">
                  <Box padding={2}> 4. </Box>
                </Grid>
                <Grid item xs={11}>
                    <Button variant="outlined" component="label" color="primary">
                        Zdjęcie książeczki zdrowia dziecka <AttachFileIcon/>
                        <input type="file" hidden
                            onChange={handleImageKsZdChange}/>
                    </Button>
                    <br/>
                    <img alt='' src={imageKsZd?.file} style={{maxWidth : '300px'}}/>
                </Grid>
                <Grid item xs={1} align="center">
                  <Box padding={2}> 5. </Box>
                </Grid>
                <Grid item xs={11} align="center">
                    <Typography variant="h6" gutterBottom>
                        Występujące niepożądane odczyny
                    </Typography>
                    <NOPCreator 
                        show={nops.length > 0 && touched[0] === true}
                        nops={nops}
                        selectedNOPs={selectedNOPs}
                        setSelectedNOPs={setSelectedNOPs}
                    />
                </Grid>
                <Grid item xs={1} align="center">
                  <Box padding={2}> 6. </Box>
                </Grid>
                <Grid item xs={11}>
                    <FormControlLabel
                        control={<Checkbox color="primary"
                                    onChange={handleContactChange}/>}
                        label="Proszę o kontakt"
                        style={{marginTop : '7px'}}
                    />
                </Grid>
                <Grid item xs={12} align="right">
                    <Button 
                        variant="contained"
                        color="primary"
                        disabled={touched.includes(false)}
                        onClick={submit}> Utwórz </Button>
                </Grid>
            </Grid>
            <Snackbar open={snackbarState.open} onClose={snackbarClose}>
                <Alert severity={snackbarState.type} onClose={snackbarClose}>
                    {snackbarState.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default ParentNewApp;