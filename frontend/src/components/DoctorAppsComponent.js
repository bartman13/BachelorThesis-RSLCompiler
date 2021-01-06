import React, { useState, useEffect, useContext } from 'react';
import {makeStyles} from  '@material-ui/core';
import Drawer from './Drawer'
import UserContext from '../contexts/UserContext';
import axios from 'axios';
import apiURL from '../shared/apiURL';
import authHeader from '../shared/authheader';
const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));
function DoctorApp(props) {
    const { childId } = props;

    
    return (
        <div><Drawer></Drawer></div>
    );
}

export default DoctorApp;

