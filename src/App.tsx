import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";

import { Main } from "./components/Main";
import { AccountContextProvider } from "./contexts/accountContext";


const App = () => {
  return (
    <div className="App">
      <div className="container">
        <AccountContextProvider>
          <Main />
        </AccountContextProvider>
      </div>
    </div>
  );
};

export default App;
