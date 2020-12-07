import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: '10',
    backgroundColor: '#FFFFFF'
  },
  spinner : {
    marginLeft: '50%',
    left: '20px',
    marginTop: '50vh',
    top: '20px'
  }
}));

export default function Loading() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress className={classes.spinner}/>
    </div>
  );
}