import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom';
import { BrowserRouter} from 'react-router-dom';
import SignInSide from './SignInSide'
import SignUp from './SignUpComponent';
import WikiItem from './WikiItem';
import Wiki from './WikiComponent';

const WikiWithId = ({match}) => {
    return(
        <WikiItem wikiid={match.params.id}/>
    );
}

function LoggedOut(props){
    const { startRefreshToken } = props;

    return (
        <BrowserRouter>
            <Switch>
                <Route path='/signin' render={(props) => <SignInSide startRefreshToken={startRefreshToken}/>}/>
                <Route path='/signup' render={(props) => <SignUp startRefreshToken={startRefreshToken}/>}/>
                <Route path='/wiki/:id' component={WikiWithId}/>
                <Route path='/wiki' component={Wiki}/>
                <Redirect to='/signin' />
            </Switch>
        </BrowserRouter>
    );
}

export default LoggedOut;