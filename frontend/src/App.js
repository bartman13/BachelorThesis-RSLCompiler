import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
<<<<<<< Updated upstream
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
=======
      <AzureAD provider={authProvider} forceLogin={true}>
        {
          ({login, logout, authenticationState, error, accountInfo}) => {
            switch (authenticationState) {
              case AuthenticationState.Authenticated:
                return (
                  <Main user={accountInfo} logout={logout} token={authProvider.getAccessToken()}/>
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
>>>>>>> Stashed changes
    </div>
  );
}

export default App;
