import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Title from './Title';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function Stats(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Title>Ostatni miesiąc</Title>
      <Typography component="p" variant="h5">
        {props.lastMonth || 'Brak Danych'}
      </Typography>
      <Box m={1}>
      <Typography color="textSecondary" className={classes.depositContext}>
        Lekkie: {props.lekkie || 0 }
      </Typography>
      </Box>
      <Box m={1}>
      <Typography color="textSecondary" className={classes.depositContext}>
        Poważne: {props.poważne || 0 }
      </Typography>
      </Box>
      <Box m={1}>
      <Typography color="textSecondary" className={classes.depositContext}>
        Ciężkie: {props.ciężkie || 0}
      </Typography>
      </Box>
    </React.Fragment>
  );
}
