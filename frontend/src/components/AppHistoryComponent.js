import React from "react";
import AppTimeline from "./TimeLine";
import { Button, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';

function AppHistory({appid}){
    return(
        <div className="container">
            <div className="text-center"><h1>Historia zgłoszenia </h1></div>
            <AppTimeline appid={appid}/>
            <Grid container>
                <Grid item xs={12} align='center'>
                    <Button
                        variant="outlined"
                        color="primary"
                        component={Link}
                        to={'/addnop/' + appid}>
                            Dodaj nowy odczyn
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}

export default AppHistory;