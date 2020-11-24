import React, { useContext } from "react";
import UserContext from '../contexts/UserContext'
import SignIn from "./SignInComponent";
import Parent from "./ParentComponent";
import Doctor from "./DoctorComponent";
import PZH from "./PZHComponent";

function Main(){
    const {user, setUser} = useContext(UserContext);
    if(user === undefined){
        return <SignIn/>
    }
    if(user.rola === 0){
        return <Parent/>;
    }
    if(user.rola === 1){
        return <Doctor/>;
    }
    if(user.rola === 2){
        return <PZH/>;
    }
}

export default Main;