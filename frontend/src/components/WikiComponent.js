import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Box from '@material-ui/core/Box';
import LoadingContext from "../contexts/LoadingContext";
import SnackbarContext from "../contexts/SnackbarContext";
import axios from 'axios';
import apiURL from '../shared/apiURL';
import { Link } from 'react-router-dom';






const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '70%',
    padding: 15,
    margin: 'auto',
    maxHeight: '100%'

  },
  content: {
    border: "double",
    padding: 8
  },
  title: {
    margin: theme.spacing(4, 0, 2),
    color: '#000080'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  search: {
    maxWidth: 400,
    margin:'auto',
    display: 'flex',
  },
}));

const WhiteTextTypography = withStyles({
  root: {
    color: "#000000",
    fontSize: 17
  }
})(Typography);





export default function Wiki() {
  const classes = useStyles();
  const [apps, setApps] = useState([]);
  const { setSnackbar } = useContext(SnackbarContext);
  const { setLoading } = useContext(LoadingContext);


  useEffect(() => {
    async function fetchData() {
        setLoading(true);
        try{
            const response = await axios.get(apiURL + 'ListaSzczepionek');
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
    <div className={classes.root} style={{ background: '#FFFAF0' }}>
        <Grid container spacing={2} >
            <Grid item lg={12}  >
                <Box>
                    <Paper component="form" className={classes.search}>
                        <InputBase
                            className={classes.input}
                            placeholder="Baza Szczepionek"
                            inputProps={{ 'aria-label': 'search google maps' }}
                        />
                        <IconButton type="submit" className={classes.iconButton} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                </Box>
            </Grid>
            {apps.map((item) => <Grid item md={12} lg={6}>
                <Card className={classes.root}>
                <CardActionArea  >
                    <Link to={'/wiki/' + item.id}>
                    <CardMedia
                        component="img"
                        alt="Contemplative Reptile"
                        height="140"
                        image="https://upload.wikimedia.org/wikipedia/commons/0/0b/Pfizer_logo.svg"
                        title="Contemplative Reptile"
                    />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                {item.nazwa}
                            </Typography>
                            <WhiteTextTypography variant="body2"  component="p">
                                {item.opis}
                            </WhiteTextTypography>
                        </CardContent>
                        </Link>
                    </CardActionArea>
                </Card>
            </Grid>

            )}
        </Grid>
    </div>
  );
}