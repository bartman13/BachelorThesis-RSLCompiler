import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import ErrorRadios from './RadiButtons';
import MuiAlert from '@material-ui/lab/Alert';
import AppHistory from './AppHistoryComponent';
import authHeader from '../shared/authheader';
import apiURL from '../shared/apiURL';
import LoadingContext from "../contexts/LoadingContext";
import axios from 'axios';
import UserContext from '../contexts/UserContext';
import SnackbarContext from "../contexts/SnackbarContext";



const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    zIndex: 3
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  disabled: {
    position: 'fixed'
  },
  personaldata: {
    '& > *': {
      margin: theme.spacing(1),
      width: '50ch',
      padding:5 
    },
  },
  documentphoto:
  {
    border: "solid",
    borderradius: "16px"
  }, 


  
  
}));

function Alert(props) {
  if(props.prosbaOKontakt){
  return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  else return <div/>;
  
}

export default function DoctorApp(props) {
  const classes = useStyles();
  const { childId } = props;
  const [apps, setApps] = useState([]);
  const { user } = useContext(UserContext);
  const { setLoading } = useContext(LoadingContext);
  const { setSnackbar } = useContext(SnackbarContext);
  const mystyle = {
    border: "solid",
    borderRadius: "10px",
    cursor: 'pointer',
    mx: "auto"    
  }
  useEffect(() => {
    async function fetchData() {
        setLoading(true);
        try{
            const response = await axios.get(apiURL + 'Lekarz/Zgloszenie/' + childId, authHeader(user));
            setApps(response.data);
        } catch (error){
            console.error(error);
            setSnackbar({
                open: true,
                message: "Błąd ładowania danych",
                type: "error",
            });
        }
        setLoading(false);
    }

    fetchData();
}, [setApps, user, setLoading, setSnackbar]);
  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar className={classes.pos}/>
        <div className={classes.drawerContainer}>
          <ErrorRadios></ErrorRadios>
          <Divider />
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        <Typography variant="h3" gutterBottom>
        {apps.pacjent_Imie} {apps.pacjent_Nazwisko}
      </Typography>
      <Alert severity="error" prosbaOKontakt={apps.prosbaOKontakt}>Prośba o kontakt</Alert>
      
      <Divider />
      <form className={classes.personaldata} noValidate autoComplete="off">
      <TextField id="0" label="Imie" defaultValue={props.Imie} variant="filled" disabled/>
      <TextField id="00" label="Nazwisko" defaultValue={props.nazwisko} variant="filled" disabled/>
      <TextField id="1" label="Imie Dziecka" defaultValue={props.pacjent_Imie}variant="filled" disabled/>
      <TextField id="2" label="Nazwisko dziecka" defaultValue={props.pacjent_Nazwisko} variant="filled" disabled/>
      <TextField id="4" label="Telefon" defaultValue={props.telefon} variant="filled" disabled/>
      <TextField id="5" label="Email" defaultValue={props.email} variant="filled" disabled/>
      
      <img style={mystyle}  alt="kszdj"src="https://www.gamat.pl/media/products/a22ee97017613b218adc43e4457e398b/images/pra-ksi.gif?lm=1541706989" />
      
    </form>
    <Divider />
      
      <AppHistory appid={1}/>       
        <Divider />
      </main>
    </div>
  );
}

