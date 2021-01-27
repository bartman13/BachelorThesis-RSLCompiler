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

export default function ResetPassword(props) {
  const { setLoading } = useContext(LoadingContext);
  const classes = useStyles();
  const { setSnackbar } = useContext(SnackbarContext);
  const history = useHistory();
  const [userInput, setUserInput] = useState({});
  const { resetToken } = props;
 
  const handleChange = (event) => {
    if(event.target.name === 'acceptterms'){
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

  


  
  const handleSubmit = async () => {
    setLoading(true);
    try{
        await axios.post(apiURL + 'reset-password',
        {
            Token: resetToken,
            Password : userInput.password,
            ConfirmPassword : userInput.repeatPassword
        }); 
        history.push('/signin')
    } catch (error){
        console.error(error);
        setSnackbar({
            open: true,
            message: "Nie udało się zresetować hasła",
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
          Zmiana hasła
        </Typography>
        <form className={classes.form} noValidate onSubmit={
          (event) => {
            event.preventDefault(); 
            handleSubmit();
          }}>
                  <TextField
                      variant="outlined"
                      required
                      fullWidth
                      name="password"
                      label="Hasło"
                      type="password"
                      id="password"
                      onChange={handleChange}
                  />
                  <TextField
                      variant="outlined"
                      required
                      fullWidth
                      name="repeatPassword"
                      label="Powtórz hasło"
                      type="password"
                      id="repeat-password"
                      onChange={handleChange}
                  />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Zatwierdź
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}