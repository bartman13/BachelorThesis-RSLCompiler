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
import { makeStyles, withStyles } from '@material-ui/core/styles';
import apiURL from '../shared/apiURL';
import LoadingContext from '../contexts/LoadingContext';
import { Link as RouterLink } from 'react-router-dom';
import { purple } from '@material-ui/core/colors';
import Paper from '@material-ui/core/Paper';

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
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: "url(/bg4.jpg)",
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    '&:hover': {
      backgroundColor: purple[700],
    },
  },
}))(Button);

export default function SignInSide(props) {
  const classes = useStyles();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [remember, setRemember] = useState(false);
  const [emailValid, setEmailValid] = useState(true);

  const { setLoading } = useContext(LoadingContext);

  const { startRefreshToken } = props;

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
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Wprowadź email
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
                            <RouterLink to="/forgot-password" variant="body2">
                                Zapomniałeś hasła?
                            </RouterLink>
                        </Grid>
                        <Grid item>
                            <Link component={RouterLink} to="/signup" variant="body2">
                                {"Nie masz konta? Utwórz je"}
                            </Link>
                        </Grid>
                    </Grid>
                    <Box  mt={0}>
                    <ColorButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        component={RouterLink} to="/wiki"
                    >
                        Encyklopedia Szczepionek 
                    </ColorButton>
                    </Box>
                    <Box mt={0}>
                    <ColorButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        component={RouterLink} to="/about"
                    >
                        O Aplikacji  
                    </ColorButton>
                    </Box>
                </form>
        </div>
        <Box mt={8}>
                <Copyright />
            </Box>
      </Grid>
    </Grid>
  );
}
