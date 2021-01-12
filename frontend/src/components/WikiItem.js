import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import LoadingContext from "../contexts/LoadingContext";
import SnackbarContext from "../contexts/SnackbarContext";
import axios from 'axios';
import apiURL from '../shared/apiURL';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '60%',
    margin: 'auto',
    padding: '20px',
 
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const useCardStyles = makeStyles({
  root: {
    maxWidth: '20%',
    padding: 'auto',
    margin: 'auto',

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
  avatar:{
    margin:'auto',
    
  }
});

export default function WikiItem(props) {
  const classes = useStyles();
  const cardclasses = useCardStyles();
  const [apps, setApps] = useState([]);
  const { setSnackbar } = useContext(SnackbarContext);
  const { setLoading } = useContext(LoadingContext);
  const {wikiid} = props;
  const style = {background: '#FFFAF0', maxWidth: '70%',
  padding: 15,
  margin: 'auto',
  height: '100%'}
  const section = (item) =>
  {
    if(item === null)
    {
      return 'brak danych';
    }
    else return item;
  }
  useEffect(() => {
    async function fetchData() {
        setLoading(true);
        try{
            const response = await axios.get(apiURL + 'Szczepionka/' + wikiid);
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
}, [setApps, setLoading, setSnackbar]);
  return (
    <div style={style}>
    <Avatar className={cardclasses.avatar} alt="Remy Sharp" src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Pfizer_logo.svg" />
       <Card className={cardclasses.root} variant="outlined">
        <Typography variant="h5" component="h2" align="center">
        {section(apps.nazwa)}
        </Typography>
    </Card>
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}><strong>Producent</strong></Typography>   
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          {section(apps.producentInfo)}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}><strong>O chorobach</strong></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          {section(apps.chorobyInfo)}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography className={classes.heading}><strong>Obecne statystyki</strong></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          {section(apps.obecnaWiedzaInfo)}
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography className={classes.heading}><strong>Przeciwwskazania</strong></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          {section(apps.przeiwWskazaniaInfo)}

          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
    </div>

  );
}