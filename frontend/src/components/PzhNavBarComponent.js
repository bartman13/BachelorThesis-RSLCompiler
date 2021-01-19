import React, { useContext, useState} from "react";
import UserContext from '../contexts/UserContext'
import { Nav, Navbar, NavItem, Button, NavbarToggler, Collapse, NavbarBrand} from 'reactstrap';
import { NavLink } from 'react-router-dom';

function PzhNavBar(props){
    const {user, setUser} = useContext(UserContext);
    const [isNavOpen, setIsNavOpen] = useState(false);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    const { logout } = props;

    return(
        <div>
            <Navbar dark expand="md">
                <div className="container">
                    <NavbarToggler onClick={toggleNav} />
                    <NavbarBrand className="mr-auto"><img src='logo.png' height="40" width="40" alt='MiniNOP' /></NavbarBrand>
                    <Collapse isOpen={isNavOpen} navbar>
                        <Nav navbar>
                            <NavItem>
                                <NavLink className="nav-link" to="/pzhhome"><b> Szczepionki </b></NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className="nav-link" to="/about"><b> Pomoc</b> </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className="nav-link" to="/wiki"><b> Szczepionki </b> </NavLink>
                            </NavItem>
                        </Nav>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink className="nav-link" to="/parentprofile"> <b> {user.imie + " " + user.nazwisko} </b> </NavLink>
                            </NavItem>
                            <NavItem>
                                <Button outline color="primary" onClick={logout}><span className="fa fa-sign-out fa-lg"></span> Wyloguj </Button>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </div>
            </Navbar>
        </div>
    );
}

export default PzhNavBar;