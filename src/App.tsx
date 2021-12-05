import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
// import React, { useEffect, useState } from "react";


import { Main } from "./components/Main";
import { AccountContextProvider } from "./contexts/accountContext";
import { TWITTER_HANDLE, TWITTER_LINK } from "./const";

// Constants


const App = () => {
  return (
    <div className="App">
      <div className="container">
        <AccountContextProvider>
          <Main />
          <div className="footer-container">
            <img
              alt="Twitter Logo"
              className="twitter-logo"
              src={twitterLogo}
            />
            <a
              className="footer-text"
              href={TWITTER_LINK}
              target="_blank"
              rel="noreferrer"
            >{`built on @${TWITTER_HANDLE}`}</a>
          </div>
        </AccountContextProvider>
      </div>
    </div>
  );
};

export default App;
