import React from "react";
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';

function ParentVaccinationsList(){
    const history = useHistory();
    const createNewApplicationClick = () => {history.push("/parentnewapp")};
    return(
        <div className="container">
            <Button color="success" style={{margin: '10px'}} onClick={createNewApplicationClick}> Utwórz nowe </Button>
            <div> Lista zgłoszeń </div>
        </div>
    );
}

export default ParentVaccinationsList;