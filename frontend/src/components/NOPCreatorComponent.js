import React, { useState } from 'react';
import { makeStyles, Grid, Typography, Button, Dialog, FormControl,
        DialogTitle, InputLabel, Select, MenuItem, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { buttonSuccess, buttonDanger } from '../styles/buttons';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    accordionFormControl: {
        minWidth: 240,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    buttonSuccess : buttonSuccess,
    buttonDanger : buttonDanger
}));

function AddNOPDialog(props){
    const { onClose, open, nops } = props;
    const classes = useStyles();
    const [selectedNOP, setSelectedNOP] = useState('');
    const handleChangeNOP = (event) => {
        setSelectedNOP(event.target.value);
    };
    const selectClickHandle = () => {
        onClose(nops.find(n => n.nazwa === selectedNOP));
    };
    const backClickHandle = () => onClose();

    return (
        <Dialog aria-labelledby="addnopdialog-title" open={open}>
            <DialogTitle id="addnopdialog-title">Wybierz typ odczynu z listy</DialogTitle>
            <Grid container>
                <Grid item xs={12} align="center">
                    <FormControl className={classes.formControl}>
                        <InputLabel id="nopId"> Typ odczynu </InputLabel>
                        <Select
                            labelId="nopId"
                            value={selectedNOP}
                            onChange={handleChangeNOP}>
                            {nops.map((n, i) =>{
                                return(
                                    <MenuItem key={i} value={n.nazwa}> {n.nazwa} </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6} align="center" onClick={selectClickHandle}>
                    <Button className={classes.buttonSuccess}> Wybierz </Button>
                </Grid>
                <Grid item xs={6} align="center" onClick={backClickHandle}>
                    <Button className={classes.buttonDanger}> Cofnij </Button>
                </Grid>
            </Grid>
        </Dialog>
    );
}

function NOPSelectAttribute(props){
    const { attribute } = props;
    const classes = useStyles();
    const [selected, setSelected] = useState('');

    const handleChange = (event) =>  {
        setSelected(event.target.value);
        attribute.wartosc = event.target.value;
    }

    return (
        <FormControl className={classes.accordionFormControl}>
            <InputLabel id={"attId" + attribute.id}> {attribute.nazwa} </InputLabel>
            <Select
                labelId={"attId" + attribute.id}
                value={selected}
                onChange={handleChange}>
                {attribute.info.split(';').map((x, i) =>{
                    return(
                        <MenuItem key={i} value={x}> {x} </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    )
}

function NOPNumberAttribute(props){
    const { attribute } = props;
    const [value, setValue] = useState(36.6);

    const handleChange = (event) =>  {
        setValue(event.target.value);
        attribute.wartosc = event.target.value;
    }
    return(
        <TextField
            required
            label={attribute.nazwa}
            type="number"
            value={value}
            onChange={handleChange}
            inputProps={{step: "0.1"}}
        />
    )
}

function NOPAttribute(props){
    const { attribute } = props;
    switch(attribute.typ){
        case  1: return <NOPSelectAttribute attribute={attribute}/> 
        case  0: return <NOPNumberAttribute attribute={attribute}/>
        default: throw new Error('nieznany typ');
    }
}

function NOPEntry(props){
    const {deleteClick, nop} = props;
    const classes = useStyles();
    return (
        <Grid container>
            <Grid item xs={12} align="center">
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={"panel" + nop.id + "-content"}
                        id={"panel" + nop.id + "-header"}>
                        <Typography variant="subtitle1"> {nop.nazwa} </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container>
                            {nop.atrybuty.map(a => {
                                return(
                                    <Grid item xs={12} key={a.id}>
                                        <NOPAttribute attribute={a}/>
                                    </Grid>
                                )
                            })}
                            <Grid item xs={12} align="right">
                                <Button 
                                    variant="contained"
                                    onClick={deleteClick}
                                    className={classes.buttonDanger}
                                    size="small"> 
                                    <DeleteIcon/>
                                </Button>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Grid>
        </Grid>
    )
}

function NOPCreator(props){
    const [open, setOpen] = useState(false);
    const { show, nops, selectedNOPs, setSelectedNOPs } = props;

    const onDialogClose = (selected) => {
        if(selected !== undefined){
            setSelectedNOPs([...selectedNOPs, {
                id: selected.id,
                nazwa: selected.nazwa,
                atrybuty: selected.atrybutyOdczynow.map(a => { return {...a, wartosc : ''}})
            }]);
        }
        setOpen(false);
    }

    const deleteNOP = (nop) => () => {
        setSelectedNOPs(selectedNOPs.filter(n => n.id !== nop.id));
    }

    const handleClickOpen = () => setOpen(true);

    const classes = useStyles();
    if(!show){
        return (
            <Button variant="contained" className={classes.buttonSuccess} disabled>
                Dodaj odczyn
            </Button>
        );
    }
    return (
        <Grid container>
            <Grid item  xs={12} align="center">
                {selectedNOPs.map((n, i) => {
                    return (
                        <NOPEntry
                            deleteClick={deleteNOP(n)}
                            nop={n}
                            key={i}
                        />
                    );
                })}
                <Button variant="contained" className={classes.buttonSuccess} onClick={handleClickOpen}>
                    Dodaj odczyn
                </Button>
                <AddNOPDialog onClose={onDialogClose} open={open} nops={nops}/>
            </Grid>
        </Grid>
    );
}

export default NOPCreator;