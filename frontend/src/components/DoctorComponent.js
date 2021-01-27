import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom';
import { BrowserRouter} from 'react-router-dom';
import DoctorNavBar from './DoctorNavBarComponent';
import DoctorApp from './DoctorAppsComponent';
import DoctorAppList from './DoctorAppList';
import Wiki from './WikiComponent';
import WikiItem from './WikiItem';
import Blog from './About/Blog';

const doctorAppWithId = ({match}) => {
    return(
        <DoctorApp appId={match.params.id}/>
    );
}
const WikiWithId = ({match}) => {
    return(
        <WikiItem wikiid={match.params.id}/>
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
                <Route path='/about' component={Blog}/>
                <Route path='/wiki/:id' component={WikiWithId}/>
                <Route path='/wiki' component={Wiki}/>

                <Redirect to='/doctorhome' />
            </Switch>
        </BrowserRouter>
    );
}

export default Doctor;