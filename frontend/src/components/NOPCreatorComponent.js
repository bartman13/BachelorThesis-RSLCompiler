import React, { useState } from 'react';
import { makeStyles, Grid, Typography, Button, Dialog, FormControl,
        DialogTitle, InputLabel, Select, MenuItem, List, ListItem } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
    button : {
        backgroundColor: '#4c9a2a',
        '&:hover' :{
            backgroundColor: '#76ba1b'
        }
    }
}));

const dialogStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    buttonSuccess : {
        backgroundColor: '#009900',
        '&:hover' :{
            backgroundColor: '#00dd00'
        }
    },
    buttonDanger : {
        backgroundColor: '#990000',
        '&:hover' :{
            backgroundColor: '#dd0000'
        }
    }
}));

function AddNOPDialog(props){
    const { onClose, open, nops } = props;
    const classes = dialogStyles();
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
            <Grid container spacing={3}>
                <Grid item  xs={12} align="center">
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
                <Grid item  xs={6} align="center" onClick={selectClickHandle}>
                    <Button className={classes.buttonSuccess}> Wybierz </Button>
                </Grid>
                <Grid item  xs={6} align="center" onClick={backClickHandle}>
                    <Button className={classes.buttonDanger}> Cofnij </Button>
                </Grid>
            </Grid>
        </Dialog>
    );
}

function NOPEntry(props){
    const {selectedNOPs, setSelectedNOPs, nop} = props;
    const deleteClick = () => {
        setSelectedNOPs(selectedNOPs.filter(n => n.nazwa !== nop.nazwa));
    }
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} align="center">
                {nop.nazwa}
                <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={deleteClick} 
                    style={ { margin : '5px' } }
                    size="small"> 
                    <DeleteIcon fontSize={"small"}/>
                </Button>
            </Grid>
        </Grid>
    )
}

function NOPCreator(props){
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => setOpen(true);
    const { show, nops } = props;
    const [selectedNOPs, setSelectedNOPs] = useState([]);

    const onDialogClose = (selected) => {
        if(selected !== undefined){
            selectedNOPs.push(selected);
        }
        setOpen(false);
    }

    const classes = useStyles();
    if(!show){
        return (
            <div></div>
        );
    }
    return (
        <Grid container spacing={3}>
            <Grid item  xs={12} align="center">
                    <Typography variant="h6" gutterBottom>
                        Występujące niepożadane odczyny
                    </Typography>
                    <List>
                        {selectedNOPs.map((n, i) => {
                            return (
                                <ListItem key={i}>
                                    <NOPEntry
                                        selectedNOPs={selectedNOPs}
                                        setSelectedNOPs={setSelectedNOPs} 
                                        nop={n}
                                    />
                                </ListItem>
                                );
                        })}
                    </List>
                    <Button variant="contained" className={classes.button} onClick={handleClickOpen}>
                            Dodaj odczyn
                    </Button>
                    <AddNOPDialog onClose={onDialogClose} open={open} nops={nops}/>
                </Grid>
        </Grid>
    );
}

export default NOPCreator;