import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CustomNoRowsOverlay from '..//DataGridNoRows';
import CustomPagination from '..//DataGridPagination';
import {DataGrid,}  from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';


import Title from './Title';

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));



const columns = [
  { field: 'data_Wystąpienia', flex: 0.25, renderHeader: () => (
    <strong>
      Data Wystąpienia
    </strong>
  ),},
  { field: 'imie', flex: 0.15, renderHeader: () => (
    <strong>
      Imie
    </strong>
  ),},
  { field: 'nazwisko', flex: 0.15, renderHeader: () => (
    <strong>
      Nazwisko
    </strong>
  ),},
  { field: 'data_Utworzenia', flex:0.25, renderHeader: () => (
    <strong>
      Data utworzenia
    </strong>
  ), },
  { field: 'stopień', flex:0.25, renderHeader: () => (
    <strong>
      Stopień
    </strong>
  ), },
  { field: 'Link', flex: 0.2 , renderHeader: () => (
    <strong>
      Link do Zgłoszenia 
    </strong>
  ),  renderCell: (params) => (
    <Button>
    <Link to={'/vaccines/1'} >
      Link
    </Link>
    </Button>
)} 
];


export default function CustomizedGrid(props) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Menuvo</Title>
      <div style={{ height: 400, width: '100%' }} className={classes.root}>
            <DataGrid rowHeight={25} rows={props.rows || []} columns={columns} pagination showToolbar disableSelectionOnClick  pageSize={9}  components={{
          noRowsOverlay: CustomNoRowsOverlay,
          pagination: CustomPagination

        }} />
        </div>
    </React.Fragment>
  );
}
