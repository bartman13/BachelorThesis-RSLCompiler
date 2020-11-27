import React, { useState } from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { Grid, TextField, Select, InputLabel, MenuItem, FormControl, Typography } from '@material-ui/core';
import NOPCreator from './NOPCreatorComponent';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 240,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    vaccineDescription : {
        maxWidth : '600px'
    }
}));

function ParentNewApp(){
    const [vaccines] = useState([
        {
            id : 0,
            nazwa : 'Menveo',
            odczyny : [
                {
                    nazwa : 'Kaszel',
                    atrybuty : [
                        {
                            nazwa : 'Stopien',
                            typ : 'select',
                            info : 'lekki;średni;silny' 
                        }
                    ]
                }
            ],
            opis: `Produkt Menveo jest przeznaczony do czynnego uodpornienia dzieci (w wieku od 2 lat), młodzieży
            i dorosłych narażonych na kontakt z dwoinkami zapalenia opon mózgowych (Neisseria meningitidis)
            z grup serologicznych A, C, W135 i Y, w celu zapobiegania chorobie inwazyjnej.
            Szczepionkę należy stosować zgodnie z obowiązującymi oficjalnymi zaleceniami.`
        }
    ]); 
    const children = ["Janek Kowalski", "Piotrek Kowalski"];
    const [selectedChild, setSelectedChild] = useState('');
    const [selectedVaccine, setSelectedVaccine] = useState('');
    const handleVaccineChange = (event) => {
        setSelectedVaccine(event.target.value);
    };
    const handleChildChange = (event) => {
        setSelectedChild(event.target.value);
    };
    const classes = useStyles();

    return (
        <div> 
            <Grid container spacing={3}
                justify="center"
                alignItems="center"
                direction="row">
                <Grid item xs={12} align="center">
                <Typography variant="h4" gutterBottom>
                    Nowe zgłoszenie
                </Typography>
                </Grid>
                <Grid item  xs={12} align="center">
                    <FormControl className={classes.formControl}>
                        <InputLabel id="chldId"> Dziecko </InputLabel>
                        <Select
                            labelId="chldId"
                            value={selectedChild}
                            onChange={handleChildChange}>
                            {children.map((c, i) =>{
                                return(
                                    <MenuItem key={i} value={i}> {c} </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <TextField
                        id="datetime-local"
                        label="Data wykonania szczepienia"
                        type="datetime-local"
                        defaultValue={new Date().toISOString().substring(0, 16)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
                <Grid item  xs={12} align="center">
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
                    <Box className={classes.vaccineDescription}>
                        {vaccines.find(v => v.id === selectedVaccine)?.opis}
                    </Box>
                </Grid>
            </Grid>
            <NOPCreator 
                show={vaccines.find(v => v.id === selectedVaccine) !== undefined} 
                nops={vaccines.find(v => v.id === selectedVaccine)?.odczyny}
            />
        </div>
    );
}

export default ParentNewApp;