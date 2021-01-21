import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../contexts/UserContext';
import SnackbarContext from '../contexts/SnackbarContext';
import LoadingContext from '../contexts/LoadingContext';
import { Box, Button, Container, makeStyles } from '@material-ui/core';
import { Grid, TextField, Select, InputLabel, MenuItem, FormControl, Typography,
    FormControlLabel, Checkbox, Collapse, Dialog, DialogTitle,
    IconButton, Tooltip } from '@material-ui/core';
import { buttonSuccess, buttonDanger } from '../styles/buttons';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import NOPCreator from './NOPCreatorComponent';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import authHeader from '../shared/authheader';
import apiURL from '../shared/apiURL';
import toFormData from '../shared/objectToFormData';
import Alert from '@material-ui/lab/Alert';
import datenow from '../shared/datenow';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 240,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    buttonSuccess: buttonSuccess,
    buttonDanger: buttonDanger
}));

function ParentNewApp(){
    const [vaccines, setVaccines] = useState([]); 
    const [children, setChildren] = useState([]);
    const [nops, setNops] = useState([]);
    const [selectedChild, setSelectedChild] = useState('');
    const [selectedDate, setSelectedDate] = useState(datenow());
    const [selectedVaccine, setSelectedVaccine] = useState('');
    const [selectedVaccines, setSelectedVaccines] = useState([]);
    const [imageKsZd, setImageKsZd] = useState('');
    const [selectedNOPs, setSelectedNOPs] = useState([]);
    const [contact, setContact] = useState(false);
    const [requiredNotSet, setRequiredNotSet] = useState([false, false, false, false]);
    const [open, setOpen] = useState(false);
    
    const { user } = useContext(UserContext);
    const { setLoading } = useContext(LoadingContext);
    const { setSnackbar } = useContext(SnackbarContext);

    const history = useHistory();

    const handleVaccineChange = async (event) => {
        setSelectedVaccine(event.target.value);
    };
    const handleChildChange = (event) => {
        setSelectedChild(event.target.value);
        requiredNotSet[0] = false;
        setRequiredNotSet([...requiredNotSet]);
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
            requiredNotSet[2] = false;
            setRequiredNotSet([...requiredNotSet]);
        }
    };
    const handleContactChange = (event) => {
        setContact(event.target.checked);
    };
    const selectClickHandle = () => {
        setSelectedVaccines(v => [...v, ...(vaccines.filter(v => v.id === selectedVaccine))]);
        setOpen(false);
        requiredNotSet[1] = false;
        setRequiredNotSet([...requiredNotSet]);
        setSelectedVaccine('');
    }
    const submit = async () => {
        if(selectedChild === ''){
            requiredNotSet[0] = true;
        }
        if(selectedVaccines.length === 0){
            requiredNotSet[1] = true;
        }
        if(!imageKsZd){
            requiredNotSet[2] = true;
        }
        if(selectedNOPs.length === 0){
            requiredNotSet[3] = true;
        } else {
            requiredNotSet[3] = false;
        }
        if(requiredNotSet.filter(item => item).length > 0){
            setRequiredNotSet([...requiredNotSet]);
            return;
        }
        setLoading(true);
        const app = {
            data: selectedDate,
            szczepionkiId: selectedVaccines.map(v => v.id),
            pacjentId: selectedChild,
            prosbaOKontakt: contact,
            zdjecieKsZd: imageKsZd.file,
            nopy: selectedNOPs.map(n => {
                return {
                    id: n.id,
                    data: n.data,
                    atrybuty: n.atrybuty.map(a => {
                        return {
                            id: a.id,
                            wartosc: a.wartosc
                        };
                    })
                };
            })
        };
        const data = toFormData(app);
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
        setLoading(false);
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

    useEffect(() => {
        async function fetchNops(){
            setLoading(true);
            try{
                const nopsData = await axios.get(apiURL + 'Nop/' + 
                    selectedVaccines.map(v => v.id).join(","), 
                    authHeader(user));
                setNops(nopsData.data);
                setSelectedNOPs([]);
            }catch(error){
                console.error(error);
                setSnackbar({
                    open: true,
                    type: 'error',
                    message: 'Błąd ładowania danych'
                });
            }
            setLoading(false);
        }
        if(selectedVaccines.length > 0) fetchNops();
    }, [setLoading, setSnackbar, user, selectedVaccines]);

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
                    <Collapse in={requiredNotSet[0]}>
                        <Alert severity="error"> To pole jest wymagane </Alert>
                    </Collapse>
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
                    <Grid container>
                        <Grid item xs={12}>
                            <Box m={2}>
                                Lista użytych szczepionek:
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <ol>
                                {selectedVaccines.length > 0 ? selectedVaccines.map(v =>
                                    <li key={v.id}>
                                        {v.nazwa}
                                        <Tooltip title="Usuń">
                                            <IconButton edge="end" aria-label="delete" onClick={() => { 
                                                setSelectedVaccines(vs => vs.filter(x => x.id !== v.id));
                                            }}>
                                                <RemoveCircleIcon style={{fill: "red"}}/>
                                            </IconButton>
                                        </Tooltip>
                                    </li>
                                ) : <div> Brak wybranych szczepionek </div>}
                            </ol>
                        </Grid>
                        <Grid item xs={2} align="center">
                            <Tooltip title="Dodaj">
                                <IconButton edge="end" aria-label="delete" onClick={() => setOpen(true)}>
                                    <AddCircleIcon style={{fill: "green"}}/>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <Collapse in={requiredNotSet[1]}>
                        <Alert severity="error"> 
                            Wymagane jest dodanie przynajmniej jednej szczepionki 
                        </Alert>
                    </Collapse>
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
                    <Collapse in={requiredNotSet[2]}>
                        <Alert severity="error"> Zdjęcie książeczki zdrowia jest wymagane </Alert>
                    </Collapse>
                </Grid>
                <Grid item xs={1} align="center">
                  <Box padding={2}> 5. </Box>
                </Grid>
                <Grid item xs={11} align="center">
                    <Typography variant="h6" gutterBottom>
                        Występujące niepożądane odczyny
                    </Typography>
                    <NOPCreator 
                        show={selectedVaccines !== [] && nops.length > 0}
                        nops={nops}
                        selectedNOPs={selectedNOPs}
                        setSelectedNOPs={setSelectedNOPs}
                    />
                    <Collapse in={requiredNotSet[3] && selectedNOPs.length === 0}>
                        <Alert severity="error"> Wymagane jest dodanie co najmniej jednego odczynu </Alert>
                    </Collapse>
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
                        onClick={submit}> Utwórz </Button>
                </Grid>
            </Grid>
            <Dialog aria-labelledby="addvacdialog-title" open={open}>
                <Box m={2}>
                    <DialogTitle id="addvacdialog-title">Wybierz szczepionkę z listy</DialogTitle>
                    <Grid container spacing={3}>
                        <Grid item xs={12} align="center">
                            <FormControl className={classes.formControl}>
                                <InputLabel id="vaccId"> Nazwa szczepionki </InputLabel>
                                <Select
                                    labelId="vaccId"
                                    value={selectedVaccine}
                                    onChange={handleVaccineChange}>
                                    {vaccines
                                        .filter(v => !selectedVaccines.includes(v))
                                        .map(v =>{
                                            return(
                                                <MenuItem key={v.id} value={v.id}> {v.nazwa} </MenuItem>
                                            ); 
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <Box>
                                {vaccines.find(v => v.id === selectedVaccine)?.opis}
                            </Box>
                        </Grid>
                        <Grid item xs={6} align="center" onClick={selectClickHandle}>
                            <Button className={classes.buttonSuccess}> Wybierz </Button>
                        </Grid>
                        <Grid item xs={6} align="center" onClick={() => setOpen(false)}>
                            <Button className={classes.buttonDanger}> Cofnij </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Dialog>
        </Container>
    );
}

export default ParentNewApp;