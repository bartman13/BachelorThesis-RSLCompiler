import React, { useEffect, useState, useContext } from "react";
import AppTimeline from "./TimeLine";
import { Button, Grid, Paper, makeStyles, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import UserContext from '../contexts/UserContext';
import SnackbarContext from '../contexts/SnackbarContext';
import LoadingContext from '../contexts/LoadingContext';
import axios from 'axios';
import authHeader from '../shared/authheader';
import apiURL from '../shared/apiURL';
import fileDownload from 'js-file-download';
import LinkMUI from '@material-ui/core/Link';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    paper : {
        padding: 20,
        margin: 20,
        height: '100%'
    }
}));

const legendStyles = makeStyles((theme) => ({
    dot : {
        height: '10px',
        width: '10px',
        borderRadius: '50%',
        display: 'inline-block'
    },
    blueOutlined : {
        border: '2px solid blue'
    },
    cyanOutlined : {
        border: '2px solid cyan'
    },
    greenOutlined : {
        border: '2px solid green'
    },
    orangeOutlined : {
        border: '2px solid orange'
    },
    redOutlined : {
        border: '2px solid red'
    },
    default : {
        border: '2px solid #bbb'
    },
    blueFilled : {
        border: '1px solid blue',
        backgroundColor: 'blue'
    },
    greenFilled : {
        border: '1px solid green',
        backgroundColor: 'green'
    },
    orangeFilled : {
        border: '1px solid orange',
        backgroundColor: 'orange'
    },
    redFilled : {
        border: '1px solid red',
        backgroundColor: 'red'
    }
}));

function LegendDot({ type }){
    const classes = legendStyles();

    switch (type) {
        case 0: return <span className={clsx(classes.dot, classes.blueOutlined)}> </span>;
        case 1: return <span className={clsx(classes.dot, classes.cyanOutlined)}> </span>;
        case 2: return <span className={clsx(classes.dot, classes.greenOutlined)}> </span>;
        case 3: return <span className={clsx(classes.dot, classes.orangeOutlined)}> </span>;
        case 4: return <span className={clsx(classes.dot, classes.redOutlined)}> </span>;
        case 5: return <span className={clsx(classes.dot, classes.default)}> </span>;
        case 6: return <span className={clsx(classes.dot, classes.blueFilled)}> </span>;
        case 7: return <span className={clsx(classes.dot, classes.greenFilled)}> </span>;
        case 8: return <span className={clsx(classes.dot, classes.orangeFilled)}> </span>;
        default: return <span className={clsx(classes.dot, classes.redFilled)}> </span>;
    }
}

function FileListAttribute({ attr }){
    const [files, setFiles] = useState([]);

    const { user } = useContext(UserContext);
    const { setSnackbar } = useContext(SnackbarContext);

    useEffect(() => {
        attr.wartosc.split(';').forEach(async (filename) => {
            try{
                const fileInfo = await axios.get(apiURL + 'fileInfo/' + filename, authHeader(user));
                setFiles(fs => [...fs, {name: fileInfo.data, link: filename}]);
            } catch(error) {
                console.error(error);
                setSnackbar({
                    open: true,
                    type: 'error',
                    message: 'Błąd ładowania danych'
                });
            }
        });
    }, [setFiles, user, attr, setSnackbar]);

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
                message: 'Nie udało się pobrać pliku'
            });
        }
    };

    const FileLink = ( { file } ) => {
        return (
            <LinkMUI
                component="button"
                variant="body2"
                onClick={() => { handleFileDownload(file); }}
            >
                {file.name.length > 15 ? file.name.substring(0,14) + "..." : file.name}
            </LinkMUI>
        );
    };

    return (
        <div> Dodane pliki: <ol>{files.map((f, i) => <li key={i} > <FileLink file={f}/> </li>)} </ol> </div>
    )
}

function EventDescription({ event }){
    if(event.typ === 0){
        return (
            <div> {event.tresc} </div>
        );
    }
    if(event.typ === 1){
        return (
            <div> {event.tytul} </div>
        );
    }
    if(event.typ < 10 && event.typ > 4){
        return (
            <div>
                Nowa decyzja lekarza: {event.tytul} ({event.tresc})
            </div>
        );
    }
    return (
        <div>
            Dodanie nowego odczynu - {event.tytul}:
            <ul>
                {event.atrybuty.map((a, i) => {
                    if(a.typ === 2){
                        return <li key={i}> <FileListAttribute attr={a}/> </li>
                    }
                    return <li key={i}> {a.nazwa} : {a.wartosc} </li>
                })}
            </ul>
        </div>
    );
}

function ItemDescription({ item }){
    if(!item){
        return (
            <Typography variant='h6' align='center'> Kliknij na tytuł zdarzenia żeby wyświetlić więcej informacji </Typography>
        );
    }
    return (
        <div>
            <Typography variant='h6' align='center'> Dane o zdarzeniu </Typography>
            <ol>
                {item.zdarzenia.map((z, i) => {
                    return (
                        <li key={i}>
                            <EventDescription event={z}/>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}

function AppHistory({ appid, showAddButton }){
    const [timelineEvents, setTimelineEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(undefined);

    const { user } = useContext(UserContext);
    const { setLoading } = useContext(LoadingContext);
    const { setSnackbar } = useContext(SnackbarContext);

    const classes = useStyles();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const eventsData = await axios.get(apiURL + "AppHistory/" + appid, authHeader(user));
                setTimelineEvents(eventsData.data);
            } catch (error) {
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
    }, [appid, user, setLoading, setSnackbar]);

    return(
        <Paper className={classes.paper} elevation={9}>
            <Grid container spacing={3}>
                <Grid item xs={12} align='center'>
                    <Typography variant='h4'> Historia zgłoszenia </Typography>
                </Grid>
                <Grid item xs={12} lg={7} align="center">
                    <AppTimeline timelineEvents={timelineEvents} onItemClick={(item) => setSelectedEvent(item)}/>
                    {showAddButton ? 
                        <Button
                            variant="outlined"
                            color="primary"
                            component={Link}
                            to={'/addnop/' + appid}>
                                Dodaj nowy odczyn
                        </Button>: null}
                </Grid>
                <Grid item xs={12} lg={5}>
                    <Paper className={classes.paper} elevation={9}>
                        <ItemDescription item={selectedEvent}/>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={12} align="center">
                            <Typography variant="h5"> Legenda </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <LegendDot type={0}/> - wykonanie szczepienia.
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <LegendDot type={1}/> - utworzenie zgłoszenia.
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <LegendDot type={2}/> - dodanie lekkiego nipożądanego odczynu.
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <LegendDot type={3}/> - dodanie poważnego nipożądanego odczynu.
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <LegendDot type={4}/> - dodanie ciężkiego nipożądanego odczynu.
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <LegendDot type={5}/> - decyzja lekazra "Brak zgodzności z dokumentem".
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <LegendDot type={6}/> - nie stwierdzono występowania niepożdanego odczynu poszczepiennego.
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <LegendDot type={7}/> - potwierdzenie lekkiego nipożądanego odczynu.
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <LegendDot type={8}/> - potwierdzenie poważnego nipożądanego odczynu.
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <LegendDot type={9}/> - potwierdzenie ciężkiego nipożądanego odczynu.
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default AppHistory;