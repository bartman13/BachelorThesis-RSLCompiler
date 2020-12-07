import './App.css';
import React, {useState} from "react";
import UserContext from './contexts/UserContext';
import LoadingContext from './contexts/LoadingContext';
import SnackbarContext from './contexts/SnackbarContext';
import Main from "./components/MainComponent";
import Loading from "./components/LoadingComponent";
import { Snackbar } from "@material-ui/core";
import Alert from "./components/AlertComponent";

function App() {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    type: 'success'
  });

  const valueUser = { user, setUser };
  const valueLoading = { loading, setLoading };
  const valueSnackbar = { snackbar, setSnackbar };

  const snackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <div className="App">
      <UserContext.Provider value={valueUser}>
        <LoadingContext.Provider value={valueLoading}>
          <SnackbarContext.Provider value={valueSnackbar}>
            <Main />
            <LoadingContext.Consumer>
              {({loading}) => {
                if(loading){
                  return <Loading />;
                } else {
                  return <div> </div>;
                }
              }}
            </LoadingContext.Consumer>
            <SnackbarContext.Consumer>
              {({snackbar}) => {
                return (
                  <Snackbar open={snackbar.open} onClose={snackbarClose} autoHideDuration={5000}>
                    <Alert severity={snackbar.type === 'success' ? 'success': 'error'} 
                      onClose={snackbarClose}>
                      {snackbar.message}
                    </Alert>
                  </Snackbar>
                );
              }}
            </SnackbarContext.Consumer>
          </SnackbarContext.Provider>
        </LoadingContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
