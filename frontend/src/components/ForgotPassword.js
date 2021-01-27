import React, { useContext, useState } from "react";
import axios from "axios";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import apiURL from '../shared/apiURL';
import LoadingContext from '../contexts/LoadingContext';
import SnackbarContext from '../contexts/SnackbarContext';
import { useHistory } from "react-router-dom";



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

export default function ForgotPassword(props) {
  const [email, setEmail] = useState('');
  const { setLoading } = useContext(LoadingContext);
  const classes = useStyles();
  const [emailValid, setEmailValid] = useState(true);
  const { setSnackbar } = useContext(SnackbarContext);
  const history = useHistory();


  const emailChanged = (event) => {
    setEmail(event.target.value);
    if(/.+@.+\.[A-Za-z]+$/.test(event.target.value)){
        setEmailValid(true);
    }else{
        setEmailValid(false);
    }
  }
  const handleSubmit = async () => {
    setLoading(true);
    try{
        await axios.post(apiURL + 'forgot-password',
        {
            Email: email
        }); 
        history.push('/signin')
    } catch (error){
        console.error(error);
        setSnackbar({
            open: true,
            message: "Nie znaleziono maila",
            type: "error",
        });
    }
    setLoading(false);
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
        Wprowadź Email
        </Typography>
        <form className={classes.form} noValidate onSubmit={
          (event) => {
            event.preventDefault(); 
            handleSubmit();
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Wyślij Prośbę
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}