import React,{ useState, useEffect, useContext } from "react";
import {DataGrid,}  from '@material-ui/data-grid';
import clsx from 'clsx';
import { makeStyles,styled  } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import LoadingContext from '../contexts/LoadingContext';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import UserContext from '../contexts/UserContext';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import apiURL from '../shared/apiURL';
import authHeader from '../shared/authheader';
import SnackbarContext from "../contexts/SnackbarContext";
import CustomNoRowsOverlay from './DataGridNoRows';
import CustomPagination from './DataGridPagination';
 
  const useStyles = makeStyles({
    root: {
      '& .super-app-theme--cell': {
        backgroundColor: '#00acc1',
        color: '#1a3e72',
      },
      '& .super-app.negative': {
        backgroundColor: 'rgba(157, 255, 118, 0.49)',
        color: '#1a3e72',
        fontWeight: '600',
      },
      '& .super-app.positive': {
        backgroundColor: '#d47483',
        color: '#1a3e72',
        fontWeight: '600',
      },
    '& .super-app-theme--link': {
      margin: 'auto'
    },
    },
    page: {
      display: 'flex',
    }
  });
  const MyButton = styled(IconButton)({
   margin: 'auto',
   variant: 'text',
  });
const columns = [
  {
    field: 'imie',
    headerAlign: 'center',
    flex: 1, 
    headerClassName: 'super-app-theme--cell', 
    align: 'center',
    renderHeader: () => (
      <strong>
        Imie
      </strong>
    ),
  },
  { 
    field: 'nazwisko', 
    headerAlign: 'center', 
    flex: 1,
    headerClassName:'super-app-theme--cell',
    align:'center',
    renderHeader: () => (
      <strong>
        Nazwisko
      </strong>
    ), 
  },
  { 
    field: 'nazwa_Szczepionki',
    headerAlign: 'center', 
    flex: 0.7,
    align:'center',
    headerClassName:'super-app-theme--cell',
    renderHeader: () => (
      <strong>
        Nazwa szczepionki
      </strong>
    ), 
    renderCell: (params) => (
          <Typography class='super-app-theme--link' >
          <Link href="#" >
          {params.value}
          </Link>
        </Typography>
      )},
  { 
    field: 'data', 
    flex: 1,
    headerAlign: 'center',
    align:'center',
    headerClassName:'super-app-theme--cell',
    renderHeader: () => (
      <strong>
        Data utworzenia
      </strong>
    ), 
  },
 
  { 
    field: 'status', 
    flex: 0.5,
    headerAlign: 'center',
    align:'center',
    headerClassName:'super-app-theme--cell',
    cellClassName: (params) =>
      clsx('super-app', {
          positive: params.value == false,
          negative: params.value == true,
          
      }),
    valueGetter: (params) => params.value ? 'Zatwierdzone':'Oczekujace' ,
    renderHeader: () => (
      <strong>
        Obecny Stan
      </strong>
    ), 
    },
    { 
      field: 'link',
      headerName: 'Edytuj',
      flex: 0.4,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'super-app-theme--cell',
      renderCell: (params) => (
        <MyButton >
        <Link  to={"doctorapp/" + params.getValue('id') }>
          <EditIcon fontSize='large' />
        </Link>
        </MyButton>
      ),
      renderHeader: () => (
        <strong>
          Zarządzaj
        </strong>
      ), 
  }
];
const riceFilterModel = {
  items: [{ columnField: columns, operatorValue: 'contains', value: 'rice' }],
};
function DoctorAppList(){
  const classes = useStyles();
  const [apps, setApps] = useState([]);
  const { user } = useContext(UserContext);
  const { setSnackbar } = useContext(SnackbarContext);
  const { setLoading } = useContext(LoadingContext);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await axios.get(apiURL + 'Lekarz/Zgloszenia', authHeader(user));
        setApps(response.data);
      } catch (error) {
        console.error(error);
        setSnackbar({
          open: true,
          message: "Błąd ładowania danych z serwera",
          type: "error",
        });
      }
      setLoading(false);
    }

    fetchData();
  }, [setApps, user]);

    return(
        <div style={{ height: 600, width: '100%' }} className={classes.root}>
            <DataGrid rows={apps} columns={columns} pagination showToolbar disableSelectionOnClick pageSize={10} filterModel={riceFilterModel} components={{
          noRowsOverlay: CustomNoRowsOverlay,
          pagination: CustomPagination

        }} />
        </div>
    );
}

export default DoctorAppList;