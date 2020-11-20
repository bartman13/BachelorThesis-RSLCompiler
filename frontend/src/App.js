import './App.css';
import Main from './components/MainComponent'
import { AzureAD, AuthenticationState } from 'react-aad-msal';
import { authProvider } from './auth/authProvider';

function App() {
  return (
    <div className="App">
      <AzureAD provider={authProvider} forceLogin={true}>
        {
          ({login, logout, authenticationState, error, accountInfo}) => {
            switch (authenticationState) {
              case AuthenticationState.Authenticated:
                return (
                  <Main user={accountInfo} logout={logout}/>
                );
              case AuthenticationState.Unauthenticated:
                return (
                  <div>
                    {error && <p><span>An error occured during authentication, please try again!</span></p>}
                    <p>
                      <span>Hey stranger, you look new!</span>
                      <button onClick={login}>Login</button>
                    </p>
                  </div>
                );
              default:
                return (<p>Authenticating...</p>);
            }
          }
        }
      </AzureAD>
    </div>
  );
}

export default App;
