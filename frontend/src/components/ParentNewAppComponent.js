import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../contexts/UserContext';
import SnackbarContext from '../contexts/SnackbarContext';
import LoadingContext from '../contexts/LoadingContext';
import { Box, Button, Container, makeStyles } from '@material-ui/core';
import { Grid, TextField, Select, InputLabel, MenuItem, FormControl, Typography,
    FormControlLabel, Checkbox } from '@material-ui/core';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import NOPCreator from './NOPCreatorComponent';
import FormData from 'form-data';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import authHeader from '../shared/authheader';
import apiURL from '../shared/apiURL';
import toFormData from '../shared/objectToFormData';

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
    const [vaccines, setVaccines] = useState([]); 
    const [children, setChildren] = useState([]);
    const [nops, setNops] = useState([]);
    const [selectedChild, setSelectedChild] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 16));
    const [selectedVaccine, setSelectedVaccine] = useState('');
    const [imageKsZd, setImageKsZd] = useState('');
    const [selectedNOPs, setSelectedNOPs] = useState([]);
    const [contact, setContact] = useState(false);
    const [touched] = useState([false, false, false]);
    
    const { user } = useContext(UserContext);
    const { setLoading } = useContext(LoadingContext);
    const { setSnackbar } = useContext(SnackbarContext);

    const history = useHistory();

    const handleVaccineChange = async (event) => {
        setSelectedVaccine(event.target.value);
        setLoading(true);
        try{
            const nopsData = await axios.get(apiURL + 'Nop/' + event.target.value, authHeader(user));
            setNops(nopsData.data);
            console.log(nopsData.data);
            setSelectedNOPs([]);
        }catch(error){
            console.error(error);
            setSnackbar({
                open: true,
                type: 'error',
                message: 'Błąd ładowania danych'
            });
        }
        touched[0] = true;
        setLoading(false);
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
                  file: event.target.files[0], 
                  image: e.target.result
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
        data.append('ProsbaOKontakt', contact);
        toFormData( selectedNOPs.map(n => {
            return {
                id: n.id,
                atrybuty: n.atrybuty.map(a => {
                    return {
                        id: a.id,
                        wartosc: a.wartosc
                    };
                })
            };
        }), data, 'nopy');
        data.append('zdjecieKsZd', imageKsZd.file);
        try {
            await axios.post(apiURL + 'UtworzZgloszenie', data, {
                headers : {
                    'accept': 'application/json',
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    ...(authHeader(user).headers)
                }
            });
            setSnackbar({
                open: true,
                type: 'success',
                message: 'Zgłoszenie pomyślnie utworzono'
            });
            history.push('/parenthome');
        } catch (error) {
            console.error(error);
            setSnackbar({
                open: true,
                type: 'error',
                message: 'Wystąpił błąd'
            });
        }
    };

    const classes = useStyles();

    useEffect(() => {
        async function fetchData(){
            setLoading(true);
            try{
                const childrenData = await axios.get(apiURL + 'Dzieci', authHeader(user));
                setChildren(childrenData.data);
                const vaccineData = await axios.get(apiURL + 'Szczepionki', authHeader(user));
                setVaccines(vaccineData.data);
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
    }, [setChildren, setVaccines, setLoading, setSnackbar, user]);
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
                    <img alt='' src={imageKsZd?.image} style={{maxWidth : '300px'}}/>
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
        </Container>
    );
}

export default ParentNewApp;