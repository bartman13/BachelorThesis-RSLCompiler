import React from 'react';
import { Button } from 'reactstrap';

function ParentNewApp(){
    return (
        <div className="container">
            <div> Nowe zgłoszenie </div>
            <Button color="success" className="float-right"> Utwórz </Button>
        </div>
    );
}

export default ParentNewApp;