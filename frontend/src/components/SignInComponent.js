import React, { useContext, useState } from "react";
import axios from "axios";
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
import apiURL from '../shared/apiURL';
import LoadingContext from '../contexts/LoadingContext';
import { useHistory } from 'react-router-dom';

const authorize = async (values) => {
        try{
            const response = await axios.post(
                apiURL + 'signin', 
                { email : values.email, haslo: values.password },
                { withCredentials: true });
            return response.data;
        }catch(error){
            console.error(error);
        }
}
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
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignIn(props) {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [remember, setRemember] = useState(false);
    const [emailValid, setEmailValid] = useState(true);

    const { setLoading } = useContext(LoadingContext);

    const { startRefreshToken } = props;

    const classes = useStyles();

    const history = useHistory();

    const handleSubmit = async (values) => {
        setLoading(true);
        const userData = await authorize(values);
        if(userData && (userData.rola !== undefined)){
            await startRefreshToken();
        }
        setLoading(false);
    }

    const emailChanged = (event) => {
        setEmail(event.target.value);
        if(/.+@.+\.[A-Za-z]+$/.test(event.target.value)){
            setEmailValid(true);
        }else{
            setEmailValid(false);
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Zaloguj się
                </Typography>
                <form className={classes.form} noValidate onSubmit={
                    (event) => {
                        event.preventDefault(); 
                        handleSubmit({email, password, remember});
                    }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Adres Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={(event)=>{emailChanged(event)}}
                        error={!emailValid}
                        helperText={!emailValid && "Niepoprawny adres email"}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Hasło"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={(event)=>{setPassword(event.target.value)}}
                    />
                    <FormControlLabel
                        control={<Checkbox 
                                    value="remember"
                                    color="primary" 
                                    checked={remember}
                                    onChange={(event)=>{setRemember(event.target.checked)}}/>}
                        label="Zapamiętaj mnie"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Zaloguj
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="" variant="body2">
                                Zapomniałeś hasła?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="" variant="body2" onClick={() => history.push('/signup')}>
                                {"Nie masz konta? Utwórz je"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}