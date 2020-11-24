import React, { Component } from 'react';

class Main extends Component{
    constructor(props){
        super(props);

        this.state = {
            isInfoLoading: true
        }
    }

    async componentDidMount(){
        const bearer = 'Bearer ' + this.props.token;
        fetch('https://localhost:44319/weatherforecast', {
            headers : {'Authorization': bearer,'Content-Type': 'application/json',
            'Accept': 'application/json'}
            
        })
        .then(response => response.json())
        .then(data => {this.setState({isInfoLoading: false, userInfo: data});})
        .catch(error => {console.log(error)});
    }

    render(){
        console.log(this.props.user);
        if(this.state.isInfoLoading){
            return(
                <div>
                    Loading...
                </div>
            )
        }
        return(
            <div>
                <div>
                    {this.state.userInfo}
                </div>
                <button onClick={this.props.logout}>Logout</button>
            </div>
        );
    }
}

export default Main;