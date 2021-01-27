import React,{ useState, useEffect, useContext } from "react";
import apiURL from '../shared/apiURL';
import LoadingContext from "../contexts/LoadingContext";
import axios from 'axios';
import SnackbarContext from "../contexts/SnackbarContext";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import  {Link}  from 'react-router-dom';


const useStyles = makeStyles({
    root: {
      minWidth: 275,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  });

export default function Verification(props) {
    const { verifyToken } = props;
    const { setSnackbar } = useContext(SnackbarContext);
    const { setLoading } = useContext(LoadingContext);
    const [verificationResult,setResult] = useState(false);
    const classes = useStyles();
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try{
                await axios.post(apiURL + 'verify-email',
                {
                    Token: verifyToken
                }); 
                setResult(true);
            } catch (error){
                console.error(error);
                setSnackbar({
                    open: true,
                    message: "Nie poprawna weryfikacja",
                    type: "error",
                });
            }
            setLoading(false);
        }

        fetchData();
    }, [setResult, setLoading, setSnackbar,verifyToken]);
    
   
  

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={classes.pos} color="textSecondary">
        {verificationResult ? 'Weryfikacja poprawna wróc do strony aby się zalogować.' : 'Link Wygasł'}
        </Typography>
      </CardContent>
      <CardActions>
      {verificationResult ?  <Button variant="contained" size="medium" component={Link} to="/signin">Zaloguj</Button> : <div></div>}
      </CardActions>
      
    </Card>
  );
    
}




