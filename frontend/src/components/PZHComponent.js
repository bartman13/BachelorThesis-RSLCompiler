import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom';
import { BrowserRouter} from 'react-router-dom';
import PzhNavBar from './PzhNavBarComponent';
import PzhVaccinesList from './PzhVaccinesList';
import PzhHelp from './PzhHelpComponent';
import PzhVaccine from './PzhVaccine';
import Wiki from './WikiComponent';
import DoctorApp from './DoctorAppsComponent'



const PzhVaccinesWithId = ({match}) => {
    return(
        <DoctorApp appId={match.params.id}/>
    );
}

function Doctor(props){
    const { logout } = props;
    return(
        <BrowserRouter>
            <PzhNavBar logout={logout}/>
            <Switch>
                <Route path='/pzhhome' component={PzhVaccinesList}/>
                <Route path='/vaccines/:id' component={PzhVaccinesWithId}/>
                <Route path='/wiki' component={Wiki}/>
                <Route path='/pzhhelp' component={PzhHelp}/>
                <Redirect to='/pzhhome' />
            </Switch>
        </BrowserRouter>
    );
}

export default Doctor;