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

function AppTimelineItem({ item }){
  return (
    <TimelineItem>
      <TimelineOppositeContent>
        <Typography color="textSecondary">
          {new Date(item.data).toLocaleDateString("pl", { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour : "2-digit", 
            minute : "2-digit" 
          })} 
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <Typography> {item.tytul + " - " + item.tresc} </Typography>
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
    <Timeline align="alternate">
      {timelineEvents.map((item, index) => {
        return <AppTimelineItem item={item} key={index}/>;
      })}
    </Timeline>
  );
}