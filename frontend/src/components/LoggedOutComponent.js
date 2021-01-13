import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom';
import { BrowserRouter} from 'react-router-dom';
import SignIn from './SignInComponent';
import SignInSide from './SignInSide'
import SignUp from './SignUpComponent';

function LoggedOut(props){
    const { startRefreshToken } = props;

    return (
        <BrowserRouter>
            <Switch>
                <Route path='/signin' render={(props) => <SignInSide startRefreshToken={startRefreshToken}/>}/>
                <Route path='/signup' render={(props) => <SignUp startRefreshToken={startRefreshToken}/>}/>
                <Redirect to='/signin' />
            </Switch>
        </BrowserRouter>
    );
}

export default LoggedOut;