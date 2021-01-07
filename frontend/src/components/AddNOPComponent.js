import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../contexts/UserContext';
import SnackbarContext from '../contexts/SnackbarContext';
import LoadingContext from '../contexts/LoadingContext';
import { Button, Container, Grid, Typography, Collapse } from '@material-ui/core';
import NOPCreator from './NOPCreatorComponent';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import authHeader from '../shared/authheader';
import apiURL from '../shared/apiURL';
import Alert from '@material-ui/lab/Alert';

function AddNOP(props){
    const { appid } = props;
    
    const [nops, setNops] = useState([]);
    const [selectedNOPs, setSelectedNOPs] = useState([]);
    const [showNOPsEmpty, setShowNOPsEmpty] = useState(false);

    const { user } = useContext(UserContext);
    const { setLoading } = useContext(LoadingContext);
    const { setSnackbar } = useContext(SnackbarContext);

    const history = useHistory();

    const submit = async () => {
        if(selectedNOPs.length === 0){
            setShowNOPsEmpty(true);
            return;
        }

        setLoading(true);
        try{
            await axios.post(apiURL + 'UpdateApp/' + appid, 
                selectedNOPs.map(n => {
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
                }),
                authHeader(user)
            );
            setSnackbar({
                open: true,
                type: 'success',
                message: 'Zgłoszenie pomyślnie zaktualizowano'
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

    useEffect(() => {
        async function fetchData(){
            setLoading(true);
            try{
                const vaccinesData = await axios.get(apiURL + 'AppVaccines/' + appid, authHeader(user));
                const nopsData = await axios.get(apiURL + 'Nop/' + vaccinesData.data[0], authHeader(user));
                setNops(nopsData.data);
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
    }, [setNops, setLoading, setSnackbar, user, appid]);

    return (
        <Container maxWidth='md'>
            <Grid container 
                spacing={3}
                direction="row">
                <Grid item xs={12} align="center">
                    <Typography variant="h4" gutterBottom>
                        Dodaj nowy obecnie występujący odczyn do istniejącego zgłoszenia 
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <NOPCreator 
                        show={nops.length > 0}
                        nops={nops}
                        selectedNOPs={selectedNOPs}
                        setSelectedNOPs={setSelectedNOPs}
                    />
                    <Collapse in={showNOPsEmpty && selectedNOPs.length === 0}>
                        <Alert severity="error"> Wymagane jest dodanie co najmniej jednego odczynu </Alert>
                    </Collapse>
                </Grid>
                <Grid item xs={12} align="right">
                    <Button 
                        variant="contained"
                        color="primary"
                        onClick={submit}> Dodaj </Button>
                </Grid>
            </Grid>
        </Container>
    );
}

export default AddNOP