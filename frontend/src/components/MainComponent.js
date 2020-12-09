import React, { useContext, useEffect } from "react";
import UserContext from '../contexts/UserContext'
import SignIn from "./SignInComponent";
import Parent from "./ParentComponent";
import Doctor from "./DoctorComponent";
import PZH from "./PZHComponent";
import apiURL from '../shared/apiURL';
import axios from "axios";
import LoadingContext from "../contexts/LoadingContext";
import authHeader from '../shared/authheader';

function Main(){
    const { user, setUser } = useContext(UserContext);
    const { setLoading } = useContext(LoadingContext);

    const refreshToken = async () => {
        const response = await axios.post(
            apiURL + 'refresh-token',
            {},
            { withCredentials: true }
        );
        return response.data;
    };

    const refreshTokenTimer = async () => {
        try{
            const userData = await refreshToken();
            console.log(userData);
            const refreshTokenTimeout = setTimeout(refreshTokenTimer, 14000 * 60);
            setUser({...userData, refreshTokenTimeout});
        }catch(error){
            setUser(undefined);
        }
    };

    const logout = async () => {
        setLoading(true);
        clearTimeout(user.refreshTokenTimeout);
        try{
            await axios.get(apiURL + 'Logout', 
                { 
                    withCredentials : true,
                    ...authHeader(user)
                }
            );
        } catch(error) {

        }
        setUser(undefined);
        setLoading(false);
    };

    useEffect(() =>{
        async function trySignIn(){
            setLoading(true);
            await refreshTokenTimer();
            setLoading(false);
        }
        trySignIn();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if(user === undefined){
        return <SignIn startRefreshToken={refreshTokenTimer}/>;
    }
    if(user.rola === 0){
        return <Parent logout={logout}/>;
    }
    if(user.rola === 1){
        return <Doctor/>;
    }
    if(user.rola === 2){
        return <PZH/>;
    }
}

export default Main;