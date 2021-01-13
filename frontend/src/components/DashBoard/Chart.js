import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

const data = [
  createData('1', 5),
  createData('2', 6),
  createData('3', 5),
  createData('4', 5),
  createData('5', 5),
  createData('6', 5),
  createData('7', 5),
  createData('8', 5),
  createData('9', 5),
  createData('10', 8),
  createData('11', 0),
  createData('12', 2),
  createData('13', 1),
  createData('14', 0),
  createData('15', 5),
  createData('16', 2),
  createData('17', 9),
  createData('18', 6),
  createData('19', 7),
  createData('20', 3),
  createData('21', 2),
  createData('22', 3),
  createData('23', 4),
  createData('24', 5),
  createData('25', 2),
  createData('26', 2),
  createData('27', 1),
  createData('28', 0),
  createData('29', 0),
  createData('30', 1),
  createData('31', undefined)
];

export default function Chart(props) {
  const theme = useTheme();
 const data = props.appsPerDay != undefined ?  props.appsPerDay.map((item,index) => createData(index + '',item)) : [];

  return (
    <React.Fragment>
      <Title>Grudzień</Title>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="day" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              Liczba zgłoszeń
            </Label>
          </YAxis>
          <Line type="monotone" dataKey="amount" stroke={theme.palette.primary.main} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
