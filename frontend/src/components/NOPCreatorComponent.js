import React, { useContext, useEffect, useState } from 'react';
import {
    makeStyles, Grid, Typography, Button, Dialog, FormControl,
    DialogTitle, InputLabel, Select, MenuItem, TextField, Link,
    Avatar, IconButton, Box
} from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { buttonSuccess, buttonDanger } from '../styles/buttons';
import UserContext from '../contexts/UserContext';
import SnackbarContext from '../contexts/SnackbarContext';
import authHeader from '../shared/authheader';
import apiURL from '../shared/apiURL';
import axios from 'axios';
import LinearProgressWithLabel from '../shared/LinearProgressWithLabel';
import fileDownload from 'js-file-download';

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
    buttonSuccess: buttonSuccess,
    buttonDanger: buttonDanger
}));

function AddNOPDialog(props) {
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
            <Box m={2}>
                <DialogTitle id="addnopdialog-title">Wybierz typ odczynu z listy</DialogTitle>
                <Grid container spacing={3}>
                    <Grid item xs={12} align="center">
                        <FormControl className={classes.formControl}>
                            <InputLabel id="nopId"> Typ odczynu </InputLabel>
                            <Select
                                labelId="nopId"
                                value={selectedNOP}
                                onChange={handleChangeNOP}>
                                {nops.map((n, i) => {
                                    return (
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
            </Box>
        </Dialog>
    );
}

function NOPFilesAttribute(props) {
    const { attribute } = props;
    const [files, setFiles] = useState([]);

    const { user } = useContext(UserContext);
    const { setSnackbar } = useContext(SnackbarContext);

    useEffect(() => {
        attribute.wartosc = files.map(file => file.link).join(";");
    }, [files, attribute]);

    const handleFilesChange = async (event) => {
        if (event.target.files) {
            const filesToUpload = Array.from(event.target.files);
            event.target.value = '';
            filesToUpload.forEach(file => {
                file.progress = 0;
                setFiles(files => [...files, file]);
            });
            filesToUpload.forEach(async (file) => {
                let formData = new FormData();
                formData.append("file", file);
                try{
                    const response = await axios.post(
                        apiURL + 'upload',
                        formData,
                        { 
                            headers: {
                                'accept': 'application/json',
                                "Content-Type": `multipart/form-data, boundary=${formData._boundary}`,
                                ...(authHeader(user).headers)
                            },
                            onUploadProgress: (event) => {
                                file.progress = Math.round((100 * event.loaded) / event.total);
                                setFiles(files => [...files]);
                            }
                        }
                    );
                    file.link = response.data;
                    setFiles(files => [...files]);
                } catch (error) {
                    console.log(error);
                    setSnackbar({
                        open: true,
                        type: 'error',
                        message: 'Nie udało się załadować pliku ' + file.name
                    });
                    setFiles([...files.filter(f => f!== file)]);
                }
            });
        }
    };

    const handleFileDelete = async (file) => {
        setFiles(files => [...files.filter(f => f!== file)]);
        try{
            await axios.delete(apiURL + 'file/' + file.link, authHeader(user));
        } catch (error) {
            console.log(error);
        }
    };

    const handleFileDownload = async (file) => {
        try{
            const blob = await axios.get(apiURL + 'file/' + file.link, {
                responseType: 'blob',
                ...authHeader(user)
            });
            fileDownload(blob.data, file.name);
        } catch(error) {
            console.error(error);
            setSnackbar({
                open: true,
                type: 'error',
                message: 'Nie udało się pobrać pliku ' + file.name
            });
        }
    };

    const fileLink = (file) => {
        return (
            <Link
                component="button"
                variant="body2"
                onClick={() => { handleFileDownload(file); }}
            >
                {file.name}
            </Link>
        );
    };

    const FileListItem = (props) => {
        const { file } = props;
        if(file.link){
            return (
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <InsertDriveFileIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={fileLink(file)} />
                    <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => { handleFileDelete(file); }}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            );
        }
        return (
            <div>
                {file.name}
                <LinearProgressWithLabel value={file.progress}/>
            </div>
        );
    };

    return (
        <div>
            <Button variant="outlined" component="label" color="primary">
                Dodaj plik <AttachFileIcon />
                <input type="file" hidden multiple
                    onChange={handleFilesChange} />
            </Button>
            <List>
                {files.map((file, index) => <FileListItem key={index} file={file} />)}
            </List>
        </div>
    );
}

function NOPTextAttribute(props) {
    const { attribute } = props;
    const [value, setValue] = useState("");

    const handleChange = (event) => {
        setValue(event.target.value);
        attribute.wartosc = event.target.value;
    };
    return (
        <TextField
            required
            label={attribute.nazwa}
            value={value}
            onChange={handleChange}
            multiline
            rows={5}
            rowsMax={10}
            style={{width: '100%', margin: '10px'}}
        />
    );
}

function NOPSelectAttribute(props) {
    const { attribute } = props;
    const classes = useStyles();
    const [selected, setSelected] = useState('');

    const handleChange = (event) => {
        setSelected(event.target.value);
        attribute.wartosc = event.target.value;
    };

    return (
        <FormControl className={classes.accordionFormControl}>
            <InputLabel id={"attId" + attribute.id}> {attribute.nazwa} </InputLabel>
            <Select
                labelId={"attId" + attribute.id}
                value={selected}
                onChange={handleChange}>
                {attribute.info.split(';').map((x, i) => {
                    return (
                        <MenuItem key={i} value={x}> {x} </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
}

function NOPNumberAttribute(props) {
    const { attribute } = props;
    const [value, setValue] = useState(attribute.info.split(';')[1]);

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    useEffect(() => {
        attribute.wartosc = value;
    }, [value, attribute]);

    return (
        <TextField
            required
            label={attribute.nazwa}
            type="number"
            value={value}
            onChange={handleChange}
            inputProps={{ step: attribute.info.split(';')[2] }}
        />
    );
}

function NOPAttribute(props) {
    const { attribute } = props;
    switch (attribute.typ) {
        case 0: return <NOPNumberAttribute attribute={attribute} />
        case 1: return <NOPSelectAttribute attribute={attribute} />
        case 2: return <NOPFilesAttribute attribute={attribute} />
        case 3: return <NOPTextAttribute attribute={attribute} />
        default: throw new Error('nieznany typ');
    }
}

function NOPEntry(props) {
    const { deleteClick, nop } = props;

    const [date, setDate] = useState(new Date().toISOString().substring(0, 16));

    const handleDateChange = (event) => {
        setDate(event.target.value);
    };

    useEffect(() => {
        nop.data = date;
    }, [date, nop]);

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
                            <Grid item xs={12} align="left">
                                <Box fontWeight='fontWeightMedium' 
                                    display='inline'
                                    margin='10%'
                                > 
                                    Data i czas pojawienia odczynu:
                                </Box>
                            </Grid>
                            <Grid item xs={12} align="center">
                                <TextField
                                    id="datetime-local"
                                    label="Data i czas"
                                    type="datetime-local"
                                    value={date}
                                    onChange={handleDateChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} align="left">
                                <Box fontWeight='fontWeightMedium' 
                                    display='inline'
                                    margin='10%'
                                > 
                                    Dodatkowe dane o odczynu:
                                </Box>
                            </Grid>
                            {nop.atrybuty.map(a => {
                                return (
                                    <Grid item xs={12} key={a.id}>
                                        <NOPAttribute attribute={a} />
                                    </Grid>
                                )
                            })}
                            <Grid item xs={12} align="right">
                                <Button
                                    variant="contained"
                                    onClick={deleteClick}
                                    className={classes.buttonDanger}
                                    size="small">
                                    <DeleteIcon />
                                </Button>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Grid>
        </Grid>
    )
}

function NOPCreator(props) {
    const [open, setOpen] = useState(false);
    const { show, nops, selectedNOPs, setSelectedNOPs } = props;

    const onDialogClose = (selected) => {
        if (selected !== undefined) {
            setSelectedNOPs([...selectedNOPs, {
                id: selected.id,
                nazwa: selected.nazwa,
                atrybuty: selected.atrybutyOdczynow.map(a => { return { ...a, wartosc: '' } })
            }]);
        }
        setOpen(false);
    }

    const deleteNOP = (nop) => () => {
        setSelectedNOPs(selectedNOPs.filter(n => n.id !== nop.id));
    }

    const handleClickOpen = () => setOpen(true);

    const classes = useStyles();
    if (!show) {
        return (
            <Button variant="contained" className={classes.buttonSuccess} disabled>
                Dodaj odczyn
            </Button>
        );
    }
    return (
        <Grid container>
            <Grid item xs={12} align="center">
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
                <AddNOPDialog onClose={onDialogClose} open={open} nops={nops} />
            </Grid>
        </Grid>
    );
}

export default NOPCreator;