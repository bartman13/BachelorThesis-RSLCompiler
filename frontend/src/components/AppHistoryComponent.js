import React from "react";
import AppTimeline from "./TimeLine";

function AppHistory({appid}){
    return(
        <div className="container">
            <div className="text-center"><h1>Historia zgłoszenia </h1></div>
            <AppTimeline appid={appid}/>
        </div>
    );
}

export default AppHistory;