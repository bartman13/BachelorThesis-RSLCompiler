import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import { buttonSuccess } from "../styles/buttons";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { useHistory } from 'react-router-dom';
import authHeader from '../shared/authheader';
import apiURL from '../shared/apiURL';
import LoadingContext from "../contexts/LoadingContext";
import axios from 'axios';
import UserContext from '../contexts/UserContext';
import SnackbarContext from "../contexts/SnackbarContext";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(3),
  },
  button: buttonSuccess
}));

export default function DoctorDecisions(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState('brakDecyzji');
  const [ComentState,setComentState] = React.useState('');
  const [error, setError] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [helperText, setHelperText] = React.useState('Proszę podjąć decyzję');
  const { user } = useContext(UserContext);
  const { setLoading } = useContext(LoadingContext);
  const { setSnackbar } = useContext(SnackbarContext);
  const history = useHistory();
  
  const handleRadioChange = (event) => {
    setValue(event.target.value);
    setError(false);
  };
  const handleommentChange = (event) =>{
    setComentState(event.target.value);
  }
  const handleClose = () => {
    setOpen(false);
  };
  const RadioValue = () => {
    if (value === 'lekki') {
      return 2;
    } else if (value === 'powazny') {
      return 3;
    }else if (value === 'ciezki') {
      return 4;
    }else if (value === 'brakNop') {
      return 1;
    }else if (value === 'nieZgodnosc') {
      return 0;
    }else
     return -1;
  };
  

  const handleSaveDecision = async () =>{
    setLoading(true);
    try{
        await axios.post(apiURL + 'Lekarz/Decyzja', 
          {
            Decyzja: RadioValue(),
            Komentarz: ComentState,
            ZgloszenieId: props.AppId
          },
            authHeader(user)
        );
        setSnackbar({
            open: true,
            type: 'success',
            message: 'Dodano decyzje do zgłoszenia'
        });
        history.push('/doctorhome');
    } catch (error) {
        console.error(error);
        setSnackbar({
            open: true,
            type: 'error',
            message: 'Nie udało się dodać złoszenia'
        });
    }
    setLoading(false);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if(value === 'brakDecyzji'){
      setHelperText('Nazlezy wybrać decyzję');
      setError(true);
    }
    else{
      setOpen(true);
    }
  };

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <FormControl component="fieldset" error={error} className={classes.formControl}>
        <FormLabel component="legend">Decyzja Lekarska</FormLabel>
        <RadioGroup aria-label="quiz" name="quiz" value={value} onChange={handleRadioChange}>
          <FormControlLabel value={"lekki"} control={<Radio />} label="Lekki" />
          <FormControlLabel value={"powazny"} control={<Radio />} label="Poważny" />
          <FormControlLabel value={"ciezki"} control={<Radio />} label="Ciężki" />
          <FormControlLabel value={"brakNop"} control={<Radio />} label="Nie stwierdzam wystąpienia Nop" />
          <FormControlLabel value={"nieZgodnosc"} control={<Radio />} label="Brak zgodności danych." />
        </RadioGroup>
        <FormHelperText>{helperText}</FormHelperText>
        <Button type="submit" variant="outlined" color="primary" className={classes.button}>
          Zatwierdź
        </Button>
      </FormControl>
    </form>
     <Dialog open={open} onClose={handleClose} fullWidth  aria-labelledby="form-dialog-title">
     <DialogTitle id="form-dialog-title">Komentaż</DialogTitle>
     <DialogContent>
       <DialogContentText>
        Komentarz min 10 słów widoczny widoczny dla pacjenta
       </DialogContentText>
       <TextField 
        // ref='comment'
         autoFocus
         margin="dense"
         id="name"
         variant="outlined"
         label="Komentarz do 500 słów"
         rows={6}
         onChange={handleommentChange}
         multiline
         fullWidth
       />
     </DialogContent>
     <DialogActions>
       <Button onClick={handleClose} color="primary">
         Zamknij
       </Button>
       <Button onClick={handleSaveDecision} color="primary">
         Zatwierdź
       </Button>
     </DialogActions>
   </Dialog>
   </div>

  );
}