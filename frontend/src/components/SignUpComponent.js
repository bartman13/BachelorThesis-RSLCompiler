import React, { useState, useContext, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link as RouterLink } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import MuiPhoneNumber from 'material-ui-phone-number';
import axios from 'axios';
import apiURL from '../shared/apiURL';
import SnackbarContext from '../contexts/SnackbarContext';
import LoadingContext from '../contexts/LoadingContext';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Bartosz Lusztak &amp; Vladyslav Yatsenko Inc.
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignUp() {
    let history = useHistory();
    const [userInput, setUserInput] = useState({
        firstName: '',
        lastName: '',
        tel: '',
        email: '',
        password: '',
        repeatPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [acceptterms, setAcceptterms] = useState(true);

    const classes = useStyles();

    const { setLoading } = useContext(LoadingContext);
    const { setSnackbar } = useContext(SnackbarContext);

    const handleChange = (event) => {
        if(event.target.name === 'acceptterms'){
            if(event.target.checked){
                setAcceptterms(true);
            }
            setUserInput(userInput => {
                return {
                    ...userInput,
                    [event.target.name] : event.target.checked
                }
            });
            return;
        }
        setUserInput(userInput => {
            return {
                ...userInput,
                [event.target.name] : event.target.value
            }
        });
    }

    const handleBlur = (event) => {
        if(errors[event.target.name] === undefined){
            setErrors(errors => {
                return {
                    ...errors,
                    [event.target.name] : ''
                }
            });
        }
        setUserInput(userInput => { return {...userInput}});
    }

    const handleSubmit = async () => {
        let validate = true;
        for(const field in userInput){
            if(errors[field] !== ''){
                errors[field] = '';
                validate = false;
            }
        }
        if(userInput.acceptterms !== true){
            setAcceptterms(false);
            validate = false;
        }
        if(!validate){
            setUserInput({...userInput});
            return;
        }
        setLoading(true);

        let signupsuccess = false;

        try {
            await axios.post(
                apiURL + 'ParentSignUp', 
                { 
                    imie : userInput.firstName,
                    nazwisko : userInput.lastName,
                    telefon : userInput.tel,
                    email : userInput.email,
                    haslo : userInput.password,
                    potwierdzHaslo : userInput.repeatPassword
                }
            );
            signupsuccess = true;
        } catch(error) {
            setSnackbar({
                open: true,
                type: 'error',
                message: 'Nie udało się utworzyć konta'
            });
        }
        if(signupsuccess){
            setSnackbar({
                open: true,
                type: 'success',
                message: 'Udało się utworzyć. Sprawdź skrzynke mailową.'
            });
            history.push('/parenthome')
        }

        setLoading(false);
    }

    useEffect(() => {
        for(const field in errors){
            if(field === 'firstName'){
                if(userInput[field].length === 0){
                    errors[field] = 'Pole jest wymagane';
                    continue;
                }
            }
            if(field === 'lastName'){
                if(userInput[field].length === 0){
                    errors[field] = 'Pole jest wymagane';
                    continue;
                }
            }
            if(field === 'tel'){
                if(userInput[field].length === 0){
                    errors[field] = 'Pole jest wymagane';
                    continue;
                }
            }
            if(field === 'email'){
                if(userInput[field].length === 0){
                    errors[field] = 'Pole jest wymagane';
                    continue;
                }
                else{
                    if(!(/.+@.+\.[A-Za-z]+$/.test(userInput[field]))){
                        errors[field] = 'Niepoprawny adres email';
                        continue;
                    }
                }
            }
            if(field === 'password'){
                if(userInput[field].length < 6){
                    errors[field] = 'Hasło musi być dłuższe niż 5 znaków';
                    continue;
                }
            }
            if(field === 'repeatPassword'){
                if(userInput[field] === '' || userInput[field] !== userInput['password']){
                    errors[field] = 'Hasła powinny się zgadzać';
                    continue;
                }
            }
            errors[field] = '';
        }
        setErrors({...errors});
    }, [userInput]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Utwórz konto
                </Typography>
                <form className={classes.form} noValidate onSubmit={
                    (event) => {
                        event.preventDefault(); 
                        handleSubmit();
                    }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="fname"
                                name="firstName"
                                variant="outlined"
                                required
                                fullWidth
                                id="firstName"
                                label="Imię"
                                autoFocus
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors["firstName"] === undefined ? false : errors["firstName"].length > 0}
                                helperText={errors["firstName"] || ''}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="lastName"
                                label="Nazwisko"
                                name="lastName"
                                autoComplete="lname"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors["lastName"] === undefined ? false : errors["lastName"].length > 0}
                                helperText={errors["lastName"] || ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Adres Email"
                                name="email"
                                autoComplete="email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors["email"] === undefined ? false : errors["email"].length > 0}
                                helperText={errors["email"] || ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <MuiPhoneNumber 
                                defaultCountry={'pl'}
                                id="tel"
                                label="Telefon"
                                name="tel"
                                variant="outlined"
                                fullWidth
                                required
                                onChange={(value) => setUserInput(userInput => {
                                    return {
                                        ...userInput,
                                        tel : value
                                    }
                                })}
                                onBlur={handleBlur}
                                error={errors["tel"] === undefined ? false : errors["tel"].length > 0}
                                helperText={errors["tel"] || ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Hasło"
                                type="password"
                                id="password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors["password"] === undefined ? false : errors["password"].length > 0}
                                helperText={errors["password"] || ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="repeatPassword"
                                label="Powtórz hasło"
                                type="password"
                                id="repeat-password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors["repeatPassword"] === undefined ? false : errors["repeatPassword"].length > 0}
                                helperText={errors["repeatPassword"] || ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox checked={userInput.acceptterms || false} color="primary" name="acceptterms" onChange={handleChange}/>}
                                label="Akceptuję warunki regulaminu"
                            />
                            <Collapse in={!acceptterms}>
                                <Alert severity="error"> Akceptacja warunków jest wymagana </Alert>
                            </Collapse>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Utwórz
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link component={RouterLink} to="/signin" variant="body2">
                                Już masz konto? Zaloguj się
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
    );
}