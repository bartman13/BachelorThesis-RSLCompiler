import React, { useContext } from "react";
import UserContext from '../contexts/UserContext'
import { Nav, Navbar, NavItem, Button} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { Switch, Route, Redirect } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

function ParentNavBar(){
    const {setUser} = useContext(UserContext);
    return(
        <div className="container">
            <Navbar dark expand="md">
                <div className="container">
                    <Nav navbar>
                        <NavItem>
                            <NavLink className="nav-link" to="/home"> Zgłoszenia </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className="nav-link" to="/home"> Dzieci </NavLink>
                        </NavItem>
                    </Nav>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <Button outline onClick={() => {setUser(undefined)}}><span className="fa fa-sign-out fa-lg"></span> Wyloguj </Button>
                        </NavItem>
                    </Nav>
                </div>
            </Navbar>
        </div>
    );
}

function Parent(){
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/home' component={ParentNavBar}/>
                <Redirect to="/home" />
            </Switch>
        </BrowserRouter>
    );
}

export default Parent;