import React from 'react';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import FormatDate from '../shared/formatDate';

function AppTimelineDot({ type }) {
    switch (type) {
        case 0: return <TimelineDot variant="outlined" style={{ borderColor: 'blue' }} />;
        case 1: return <TimelineDot variant="outlined" style={{ borderColor: 'cyan' }} />;
        case 2: return <TimelineDot variant="outlined" style={{ borderColor: 'green' }} />;
        case 3: return <TimelineDot variant="outlined" style={{ borderColor: 'orange' }} />;
        case 4: return <TimelineDot variant="outlined" style={{ borderColor: 'red' }} />;
        case 5: return <TimelineDot />;
        case 6: return <TimelineDot style={{ borderColor: 'blue', backgroundColor: 'blue' }} />;
        case 7: return <TimelineDot style={{ borderColor: 'green', backgroundColor: 'green' }} />;
        case 8: return <TimelineDot style={{ borderColor: 'orange', backgroundColor: 'orange' }} />;
        default: return <TimelineDot style={{ borderColor: 'red', backgroundColor: 'red' }} />;
    }
}

function AppTimelineItem({ item, onItemClick }) {
    const mystyle = {
        cursor: 'pointer',
    }
    
    return (
        <TimelineItem>
            <TimelineOppositeContent>
                <Typography color="textSecondary">
                    {FormatDate(false, item.data)}
                </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
                <AppTimelineDot type={item.typ} />
                <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
                <Tooltip title="Kliknij żeby wybrać" placement="bottom-end" style={mystyle}>
                    <Typography onClick={() => onItemClick(item)}>
                        {item.tytul}
                    </Typography>
                </Tooltip>
            </TimelineContent>
        </TimelineItem>
    );
}

export default function AppTimeline({ timelineEvents, onItemClick }) {

    return (
        <Timeline align="right">
            {timelineEvents.map((item, index) => {
                return <AppTimelineItem item={item} key={index} onItemClick={onItemClick}/>;
            })}
        </Timeline>
    );
}