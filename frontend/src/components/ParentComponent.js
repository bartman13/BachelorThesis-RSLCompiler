import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom';
import { BrowserRouter} from 'react-router-dom';
import ParentNavBar from './ParentNavBarComponent';
import ParentVaccinationsList from './ParentVaccinaionsList';
import ParentChildrenList from './ParentChildrenComponent';
import ParentProfile from './ParentProfileComponent';
import ParentNewApp from './ParentNewAppComponent';

function Parent(){
    return (
        <BrowserRouter>
            <ParentNavBar/>
            <Switch>
                <Route path='/parenthome' component={ParentVaccinationsList}/>
                <Route path='/parentchildren' component={ParentChildrenList}/>
                <Route path='/parentprofile' component={ParentProfile}/>
                <Route path='/parentnewapp' component={ParentNewApp}/>
                <Redirect to='/parenthome' />
            </Switch>
        </BrowserRouter>
    );
}

export default Parent;