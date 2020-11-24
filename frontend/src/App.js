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
