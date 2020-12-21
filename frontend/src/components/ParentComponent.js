import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom';
import { BrowserRouter} from 'react-router-dom';
import ParentNavBar from './ParentNavBarComponent';
import ParentVaccinationsList from './ParentVaccinationsList';
import ParentChildrenList from './ParentChildrenComponent';
import ParentProfile from './ParentProfileComponent';
import ParentNewApp from './ParentNewAppComponent';
import ParentChild from './ParentChildComponent';
import AppHistory from './AppHistoryComponent';
import ParentWiki from './ParentWikiComponent';
import About from './AboutComponent';
import AddNOP from './AddNOPComponent';

const AppHistoryWithId = ({match}) => {
    return(
        <AppHistory appid={match.params.id}/>
    );
}

const ChildWithId = ({match}) => {
    return(
        <ParentChild childId={match.params.id}/>
    );
}

const UpdateAppWithId = ({match}) => {
    return(
        <AddNOP appid={match.params.id}/>
    );
}

function Parent(props){
    const { logout } = props;

    return (
        <BrowserRouter>
            <ParentNavBar logout={logout}/>
            <Switch>
                <Route path='/parenthome' component={ParentVaccinationsList}/>
                <Route exact path='/parentchildren' component={ParentChildrenList}/>
                <Route path='/parentchildren/:id' component={ChildWithId}/>
                <Route exact path='/addchild' component={ParentChild}/>
                <Route path='/parentprofile' component={ParentProfile}/>
                <Route path='/parentnewapp' component={ParentNewApp}/>
                <Route path='/apphistory/:id' component={AppHistoryWithId}/>
                <Route path='/parentwiki' component={ParentWiki}/>
                <Route path='/parentabout' component={About}/>
                <Route path='/addnop/:id' component={UpdateAppWithId}/>
                <Redirect to='/parenthome' />
            </Switch>
        </BrowserRouter>
    );
}

export default Parent;