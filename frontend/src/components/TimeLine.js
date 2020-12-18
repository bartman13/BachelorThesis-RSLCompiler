import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../contexts/UserContext';
import SnackbarContext from '../contexts/SnackbarContext';
import LoadingContext from '../contexts/LoadingContext';
import Timeline from '@material-ui/lab/Timeline';
import axios from 'axios';
import authHeader from '../shared/authheader';
import apiURL from '../shared/apiURL';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

function AppTimelineDot({ type }){
  switch (type){
    case 0: return <TimelineDot variant="outlined" style={{borderColor: 'blue'}}/>;
    case 1: return <TimelineDot variant="outlined" style={{borderColor: 'cyan'}}/>;
    case 2: return <TimelineDot variant="outlined" style={{borderColor: 'green'}}/>;
    case 3: return <TimelineDot variant="outlined" style={{borderColor: 'orange'}}/>;
    case 4: return <TimelineDot variant="outlined" style={{borderColor: 'red'}}/>;
    case 5: return <TimelineDot/>;
    case 6: return <TimelineDot style={{borderColor: 'blue', backgroundColor: 'blue'}}/>;
    case 7: return <TimelineDot style={{borderColor: 'green', backgroundColor: 'green'}}/>;
    case 8: return <TimelineDot style={{borderColor: 'orange', backgroundColor: 'orange'}}/>;
    default: return <TimelineDot style={{borderColor: 'red', backgroundColor: 'red'}}/>;
  }
}

function AppTimelineItem({ item }){
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const FormatDate = (withTime, date) => {
    if(withTime){
      return new Date(date).toLocaleDateString("pl", { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long',
        day: 'numeric'
      });
    }
    return new Date(date).toLocaleDateString("pl", { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour : "2-digit", 
      minute : "2-digit" 
    });
  }

  const open = Boolean(anchorEl);

  return (
    <TimelineItem>
      <TimelineOppositeContent>
        <Typography color="textSecondary">
          {FormatDate(item.typ === 0, item.data)} 
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <AppTimelineDot type={item.typ} />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <Typography
          aria-owns={open ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        > 
          {item.tytul}
        </Typography>
        <Popover
          id="mouse-over-popover"
          className={classes.popover}
          classes={{
            paper: classes.paper,
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
        <Typography> {item.zdarzenia.map((z, i) => <div key={i}> {(i + 1) + ". " + z.tytul + " - " + z.tresc } </div>)}</Typography>
      </Popover>
      </TimelineContent>
    </TimelineItem>
  );
}

export default function AppTimeline({ appid }) {
  const [timelineEvents, setTimelineEvents] = useState([]);

  const { user } = useContext(UserContext);
  const { setLoading } = useContext(LoadingContext);
  const { setSnackbar } = useContext(SnackbarContext);

  useEffect(() => {
    async function fetchData(){
      setLoading(true);
      try{
        const eventsData = await axios.get(apiURL + "AppHistory/" + appid, authHeader(user));
        setTimelineEvents(eventsData.data);
      } catch(error) {
        console.error(error);
        setSnackbar({
            open: true,
            message: "Błąd ładowania danych",
            type: "error"
        });
      }
      setLoading(false);
    }
    fetchData();
  }, [appid, user, setLoading, setSnackbar]);

  return (
    <Timeline align="right">
      {timelineEvents.map((item, index) => {
        return <AppTimelineItem item={item} key={index}/>;
      })}
    </Timeline>
  );
}