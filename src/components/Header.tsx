import React from "react";
import {
  useAccountContext,
  connectWallet,
  changeNetwork,
} from "../contexts/accountContext";

import ethLogo from "../assets/eth.png";

export const Header = () => {
  const [accountState, accountDispatch] = useAccountContext();
  console.log(accountState);
  const buttonText = accountState.isAppDisabled
    ? "Switch to rinkeby network"
    : "Connect to a wallet";
  return (
    <div className={"header"}>
      <span className={"its-unicorn-baby"}>🦄</span>
      <button
        onClick={() =>
          accountState.isAppDisabled
            ? changeNetwork()
            : connectWallet(accountDispatch)
        }
        className={"cta-button connect-wallet-button"}
        disabled={!!accountState?.account}
      >
        {accountState.account
          ? `${accountState?.account.address} | ${accountState?.account.balance}`
          : buttonText}
        <img className={"its-eth-babe"} src={ethLogo} alt="button" />
      </button>
    </div>
  );
};
