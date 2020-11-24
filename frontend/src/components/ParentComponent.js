import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom';
import { BrowserRouter} from 'react-router-dom';
import ParentNavBar from './ParentNavBarComponent';
import ParentVaccinationsList from './ParentVaccinationsList';
import ParentChildrenList from './ParentChildrenComponent';
import ParentProfile from './ParentProfileComponent';
import ParentNewApp from './ParentNewAppComponent';
import AppHistory from './AppHistoryComponent';

const AppHistoryWithId = ({match}) => {
    return(
        <AppHistory appid={match.params.id}/>
    );
}

function Parent(){
    return (
        <BrowserRouter>
            <ParentNavBar/>
            <Switch>
                <Route path='/parenthome' component={ParentVaccinationsList}/>
                <Route path='/parentchildren' component={ParentChildrenList}/>
                <Route path='/parentprofile' component={ParentProfile}/>
                <Route path='/parentnewapp' component={ParentNewApp}/>
                <Route path='/apphistory/:id' component={AppHistoryWithId}/>
                <Redirect to='/parenthome' />
            </Switch>
        </BrowserRouter>
    );
}

export default Parent;