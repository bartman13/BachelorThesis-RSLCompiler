import React, { useState, useEffect, useContext } from "react";
import UserContext from '../contexts/UserContext';
import axios from 'axios';
import apiURL from '../shared/apiURL';
import authHeader from '../shared/authheader';
import { Container, Grid, Typography, TextField, Button } from '@material-ui/core';
import Form from "@material-ui/core/FormControl";
import LoadingContext from "../contexts/LoadingContext";
import SnackbarContext from "../contexts/SnackbarContext";

function ParentProfile(){
    const [userData, setUserData] = useState({});

    const { user, setUser } = useContext(UserContext);
    const { setLoading } = useContext(LoadingContext);
    const { setSnackbar } = useContext(SnackbarContext);

    const handleChange = (event) => {
        setUserData({
            ...userData,
            [event.target.name] : event.target.value
        });
    };

    const submit = async () => {
        setLoading(true);
        try{
            await axios.post(apiURL + 'UpdateUser', userData, authHeader(user));
            setUser({...user, ...userData});
            setSnackbar({
                open: true,
                message: "Dane pomyślnie zapisano",
                type: "success"
            });
        } catch (error) {
            console.error(error);
            setSnackbar({
                open: true,
                message: "Wystąpił błąd",
                type: "error"
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        setUserData({
            imie: user.imie,
            nazwisko: user.nazwisko,
            email: user.email
        });
    }, [user, setUserData]);

    return(
        <Container maxWidth="md">
            <Form onSubmit={() => console.log("submit")}>
                <Grid container direction="row">
                    <Grid item align="center" xs={12}>
                        <Typography variant="h4" gutterBottom>
                            Edycja danych użytkownika
                        </Typography>
                    </Grid>
                    <Grid item align="center" xs={12}>
                        <TextField 
                            label="Imię"
                            value={userData.imie || ''}
                            name="imie"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item align="center" xs={12}>
                        <TextField 
                            label="Nazwisko"
                            value={userData.nazwisko || ''}
                            name="nazwisko"
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item align="center" xs={12}>
                        <TextField
                            label="Email"
                            value={userData.email || ''}
                            name="imie"
                            onChange={handleChange}
                            autoComplete="email"
                        />
                    </Grid>
                    <Grid item align="right" xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={submit}
                        >
                            Zapisz
                        </Button>
                    </Grid>
                </Grid>
            </Form>
        </Container>
    );
}

export default ParentProfile;