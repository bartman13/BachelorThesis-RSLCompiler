import React, { useState } from "react";
import { List, ListItem, Container, Typography, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';

function ParentChildrenList(){
    const [children, setChildren] = useState([
        {id: 0, imie: "Janek", nazwisko: "Kowalski"},
        {id: 1, imie: "Piotrek", nazwisko: "Kowalski"}
    ]);
    return(
        <Container maxWidth='md'>
            <Grid container spacing={3}
                direction="row">
                <Grid item align="center" xs={12}>
                    <Typography variant="h4" gutterBottom>
                        Moje dzieci
                    </Typography>
                </Grid>
                <Grid item align="center" xs={12}>
                    <List>
                        {children.map(c => {
                            return (
                                <ListItem key={c.id}
                                    component={Link}
                                    to={'/parentchildren/' + c.id}>
                                    {c.imie + " " + c.nazwisko} 
                                </ListItem>
                            );
                        })}
                    </List>
                </Grid>
            </Grid>
        </Container> 
    );
}

export default ParentChildrenList;