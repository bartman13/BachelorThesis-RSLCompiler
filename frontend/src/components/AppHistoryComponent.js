import React from "react";
import { Badge } from 'reactstrap';
import OppositeContentTimeline from "./TimeLine";




function AppHistory({appid}){
    

    
    return(
        <div className="container">
            <div className="text-center"><h1>Historia zgłoszenia o nr:<Badge color="info">{appid}</Badge></h1></div>
            <OppositeContentTimeline/>
        </div>
    );
}

export default AppHistory;