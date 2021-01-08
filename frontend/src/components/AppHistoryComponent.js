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

const useStyles = makeStyles((theme) => ({
    paper : {
        padding: 20,
        margin: 20
    }
}));

function FileListAttribute( { attr }){
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
                {file.name}
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
            <Typography variant='h6' align='center'> Nie wybrano żadnego zdarzenia </Typography>
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
        <Grid container>
            <Grid item md>
                <Paper className={classes.paper}>
                    <Grid container>
                        <Grid item xs={12} align='center'>
                            <Typography variant='h4'> Historia zgłoszenia </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <AppTimeline timelineEvents={timelineEvents} onItemClick={(item) => setSelectedEvent(item)}/>
                        </Grid>
                        {showAddButton ? 
                        <Grid item xs={12} align='center'>
                            <Button
                                variant="outlined"
                                color="primary"
                                component={Link}
                                to={'/addnop/' + appid}>
                                    Dodaj nowy odczyn
                            </Button>
                        </Grid> : null}
                    </Grid>
                </Paper>
            </Grid>
            <Grid item md>
                <Paper className={classes.paper}>
                    <ItemDescription item={selectedEvent}/>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default AppHistory;