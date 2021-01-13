import React,{ useState, useEffect, useContext } from "react";
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Chart from './Chart';
import CustomizedGrid from './Grid';
import LoadingContext from "../../contexts/LoadingContext";
import SnackbarContext from "../../contexts/SnackbarContext";
import axios from 'axios';
import apiURL from '../../shared/apiURL';
import Stats from './Stats';

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
const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  search: {
    margin:'auto',
    display: 'flex',
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [apps, setApps] = useState([]);
  const [gridData, setgridData] = useState(undefined);
  const [displayData,setDisplay] = useState([]);
  const { setSnackbar } = useContext(SnackbarContext);
  const { setLoading } = useContext(LoadingContext);
  const [searchString,setSearch] =  useState('');

 
  const handleSearch = (event) =>
  {
    setSearch(event.target.value);
    setDisplay(apps.filter(x => x.nazwa.includes(searchString)));
  }
  
  const loadData =  (param) => async (e) =>
  {
    setLoading(true);
    try{
        const response = await axios.get(apiURL + 'ZgloszeniaPzh/' + param);
        setgridData(response.data);
    } catch (error){
        console.error(error);
        setSnackbar({
            open: true,
            message: "Błąd ładowania danych ",
            type: "error",
        });
    }
    setLoading(false);
  } 

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  useEffect(() => {
    async function fetchData() {
        setLoading(true);
        try{
            const response = await axios.get(apiURL + 'ListaSzczepionek');
            setApps(response.data);
            setDisplay(response.data);

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
},[setApps, setLoading, setSnackbar, setDisplay]);
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
        <Box>
                    <Paper component="form" className={classes.search}>
                        <InputBase
                            className={classes.input}
                            placeholder="Znajdź szczepionkę"
                            inputProps={{ 'aria-label': 'search google maps' }}
                        />
                        <IconButton  className={classes.iconButton} aria-label="search" onClick={handleSearch}>
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                </Box>
        </div>
        <Divider />
        <List>
          {displayData.map(item =>
            <div><ListItem button onClick={loadData(item.id)}>
              <ListItemIcon>
              </ListItemIcon>
              <ListItemText primary={item.nazwa} />
            </ListItem><Divider /></div>
                    )}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                <Chart appsPerDay={gridData?.appsPerDay}/>
              </Paper>
            </Grid>
            {/* Recent Deposits */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Stats lastMonth={gridData?.lastMonth} lekkie={gridData?.lekkie} poważne={gridData?.poważne} ciężkie={gridData?.ciężkie}/>
              </Paper>
            </Grid>
            {/* Recent Orders */}
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <CustomizedGrid rows={gridData?.rows} />
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}
