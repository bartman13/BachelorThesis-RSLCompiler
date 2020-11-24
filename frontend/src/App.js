import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
import './App.css';
import React, {useState} from "react";
import UserContext from './contexts/UserContext'
import Main from "./components/MainComponent"

function App() {
  const [user, setUser] = useState(undefined);
  const value = {user, setUser};
  return (
    <div className="App">
      <UserContext.Provider value={value}>
        <Main/>
      </UserContext.Provider>
    </div>
  );
}

export default App;
