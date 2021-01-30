import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { TextField } from '@material-ui/core';
import DoctorDecisions from './DoctorDecisions';
import MuiAlert from '@material-ui/lab/Alert';
import AppHistory from './AppHistoryComponent';
import authHeader from '../shared/authheader';
import apiURL from '../shared/apiURL';
import LoadingContext from "../contexts/LoadingContext";
import axios from 'axios';
import UserContext from '../contexts/UserContext';
import SnackbarContext from "../contexts/SnackbarContext";
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
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
  header:
  {
    padding: 6,
    color: "#0000A0"
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
  const { appId, pzh } = props;
  const [apps, setApps] = useState([]);
  const [photo, setPhoto] = useState(undefined);
  const [open, setOpen] = useState(false);
  const [ loaded, setLoaded ] = useState(false);
  const { user } = useContext(UserContext);
  const { setLoading } = useContext(LoadingContext);
  const { setSnackbar } = useContext(SnackbarContext);

  const mystyle = {
    border: "solid",
    borderRadius: "10px",
    cursor: 'pointer',
    mx: "auto",
    maxWidth: 300,  
  }
  const handleClose = () =>{
    setOpen(false);
  }
  useEffect(() => {
    async function fetchData() {
        setLoading(true);
        try{
            let url = apiURL + 'Lekarz/Zgloszenie/' + appId;
            if(pzh){
              url = apiURL + 'ZgloszeniePZH/' + appId;
            }
            const response = await axios.get(url, authHeader(user));
            setApps(response.data);
            const blob = await axios.get(apiURL + 'file/' + response.data.zdjecieKsZd.nazwaPliku, {
              responseType: 'blob',
              ...authHeader(user)
          });
          setPhoto(URL.createObjectURL(blob.data));
          setLoaded(true);
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
}, [setApps, user, setLoading, setSnackbar,appId]);
  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div>
          <DoctorDecisions AppId={appId}/>
          <Divider />
        </div>
      </Drawer>
      <main >
        <Toolbar />
        <Typography variant="h3" className={classes.header}  gutterBottom>
        Zgłoszenie użytkownika : {apps.imie} {apps.nazwisko}
      </Typography>
      <Alert severity="error" prosbaOKontakt={apps.prosbaOKontakt}>Prośba o kontakt</Alert>
      
        <Divider />
        <Box m={2}>
        <Grid container spacing={3} >
            <Grid item xs={12} md={6} lg={4}><TextField variant="filled" fullWidth id="imie" label="Imie" value={apps.pacjent_Imie} InputProps={{readOnly: true}} InputLabelProps={{shrink: true}}/></Grid>
            <Grid item xs={12} md={6} lg={4}><TextField  id="nazwisko"  label="Nazwisko"  fullWidth value={apps.pacjent_Nazwisko} InputLabelProps={{shrink: true}} variant="filled" InputProps={{readOnly: true,}} /></Grid>
            <Grid item xs={12} md={6} lg={4}> <TextField id="1" label="Telefon" value={apps.telefon} fullWidth variant="filled" InputProps={{readOnly: true}} InputLabelProps={{shrink: true}} /></Grid>
            <Grid item xs={12} md={6} lg={4}> <TextField id="2" label="Email" value={apps.email} fullWidth variant="filled"  InputProps={{readOnly: true}} InputLabelProps={{shrink: true}}/></Grid>
            <Grid item xs={12} md={6} lg={4}> <TextField id="3" label="Pesel" value="1234567891" fullWidth variant="filled"  InputProps={{readOnly: true}} InputLabelProps={{shrink: true}}/></Grid>
            <Grid item xs={12} md={6} lg={4}> <TextField id="4" label="DataUrodzenia" value="10-10.2020" fullWidth variant="filled"  InputProps={{readOnly: true}} InputLabelProps={{shrink: true}}/></Grid>
            <Grid item md={12} lg={12}  alignContent="flex-end"> 
            <Box display="flex" flexDirection="row-reverse" width="100%">
            <img style={mystyle} alt="kszdj" onClick={() => setOpen(true)}  src={photo} />
          </Box>
          </Grid>
          </Grid>
        </Box >
        <Divider />
  
      {loaded ? <AppHistory appid={appId}/> : null}       
        <Divider />
      </main>
      <Dialog open={open} onClose={handleClose} fullWidth  aria-labelledby="zdjęcie książeczki">
     <DialogTitle id="form-dialog-title">Komentarz</DialogTitle>
     <DialogContent>
     <img alt="kszdj" src={photo} />
     </DialogContent>
      <DialogActions>
       <Button onClick={handleClose} color="primary">
         Zamknij
       </Button>
     </DialogActions>
   </Dialog>
    </div>
  );
}

