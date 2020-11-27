import React, { useContext, useState} from "react";
import UserContext from '../contexts/UserContext'
import { Nav, Navbar, NavItem, Button, NavbarToggler, Collapse, NavbarBrand} from 'reactstrap';
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
                    <NavbarBrand className="mr-auto"><img src='logo.png' height="40" width="40" alt='MiniNOP' /></NavbarBrand>
                    <Collapse isOpen={isNavOpen} navbar>
                        <Nav navbar>
                            <NavItem>
                                <NavLink className="nav-link" to="/parenthome"><b> Zgłoszenia </b></NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className="nav-link" to="/parentchildren"><b> Dzieci </b></NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className="nav-link" to="/parentwiki"><b> O szczepieniach</b> </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className="nav-link" to="/parentabout"><b> Jak korzystać?</b> </NavLink>
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