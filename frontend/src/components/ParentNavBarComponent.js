import React, { useContext, useState} from "react";
import UserContext from '../contexts/UserContext'
import { Nav, Navbar, NavItem, Button, NavbarToggler, Collapse} from 'reactstrap';
import { NavLink } from 'react-router-dom';

function ParentNavBar(){
    const {user, setUser} = useContext(UserContext);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    }; 
    return(
        <div>
            <Navbar dark expand="md">
                <div className="container">
                    <NavbarToggler onClick={toggleNav} />
                    <Collapse isOpen={isNavOpen} navbar>
                        <Nav navbar>
                            <NavItem>
                                <NavLink className="nav-link" to="/parenthome"> Zgłoszenia </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className="nav-link" to="/parentchildren"> Dzieci </NavLink>
                            </NavItem>
                        </Nav>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink className="nav-link" to="/parentprofile"> {user.imie + " " + user.nazwisko} </NavLink>
                            </NavItem>
                            <NavItem>
                                <Button outline color="primary" onClick={() => {setUser(undefined)}}><span className="fa fa-sign-out fa-lg"></span> Wyloguj </Button>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </div>
            </Navbar>
        </div>
    );
}

export default ParentNavBar;