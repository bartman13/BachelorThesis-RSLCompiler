import React from "react";
import { Switch, Route, Redirect } from 'react-router-dom';
import { BrowserRouter} from 'react-router-dom';
import SignInSide from './SignInSide'
import SignUp from './SignUpComponent';
import WikiItem from './WikiItem';
import Wiki from './WikiComponent';
import Blog from './About/Blog';
import Verification from './VerificationComponent';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

const WikiWithId = ({match}) => {
    return(
        <WikiItem wikiid={match.params.id}/>
    );
}
const VerificationWithToken = ({match}) => {
    return(
        <Verification verifyToken={match.params.token}/>
    );
}
const ResetPasswordWithToken = ({match}) => {
    return(
        <ResetPassword resetToken={match.params.token}/>
    );
}
function LoggedOut(props){
    const { startRefreshToken } = props;

    return (
        <BrowserRouter>
            <Switch>
                <Route path='/signin' render={(props) => <SignInSide startRefreshToken={startRefreshToken}/>}/>
                <Route path='/signup' component={SignUp}/>
                <Route path='/wiki/:id' component={WikiWithId}/>
                <Route path='/wiki' component={Wiki}/>
                <Route path='/about' component={Blog}/>
                <Route path='/verify-email/:token' component={VerificationWithToken}/>
                <Route path ='/forgot-password' component={ForgotPassword}/>
                <Route path ='/reset-password/:token' component={ResetPasswordWithToken}/>
                <Redirect to='/signin' />
            </Switch>
        </BrowserRouter>
    );
}

export default LoggedOut;