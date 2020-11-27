import React from 'react';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import Typography from '@material-ui/core/Typography';

export default function OppositeContentTimeline() {
    return (
        <Timeline align="left">
          <TimelineItem>
          <TimelineOppositeContent>
            <Typography color="textSecondary">20-04-2020</Typography>
          </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>Wykonanie szczepienia</TimelineContent>
          </TimelineItem>
          <TimelineItem>

          <TimelineOppositeContent>
            <Typography color="textSecondary">22-04-2020</Typography>
          </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>Utworzenie zgłosznia</TimelineContent>
          </TimelineItem>
          <TimelineItem>
          <TimelineOppositeContent>
            <Typography color="textSecondary">22-04-2020</Typography>
          </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="secondary" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>Zgłoszenie NOP</TimelineContent>
          </TimelineItem>
          <TimelineItem>
          <TimelineOppositeContent>
            <Typography color="textSecondary">22-04-2020</Typography>
          </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="#007E33" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>Odpowiedz Lekarska</TimelineContent>
          </TimelineItem>
          <TimelineItem>
          <TimelineOppositeContent>
            <Typography color="textSecondary">24-04-2020</Typography>
          </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
            </TimelineSeparator>
            <TimelineContent>Zakończenie zgłoszenia</TimelineContent>
          </TimelineItem>
          
          
        </Timeline>
      );
}