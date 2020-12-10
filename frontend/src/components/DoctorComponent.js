import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom';
import { BrowserRouter} from 'react-router-dom';
import DoctorNavBar from './DoctorNavBarComponent';
import DoctorHelp from './DoctorHelpComponent';
import DoctorApp from './DoctorAppsComponent';
import DoctorAppList from './DoctorAppList';

const doctorAppWithId = ({match}) => {
    return(
        <DoctorApp childId={match.params.id}/>
    );
}
function Doctor(props){
    const { logout } = props;
    return(
        <BrowserRouter>
            <DoctorNavBar logout={logout}/>
            <Switch>
                <Route path='/doctorhome' component={DoctorAppList}/>
                <Route path='/doctorapp/:id' component={doctorAppWithId}/>
                <Route path='/doctorhelp' component={DoctorHelp}/>
                <Redirect to='/doctorhome' />
            </Switch>
        </BrowserRouter>
    );
}

export default Doctor;