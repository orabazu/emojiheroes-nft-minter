import React from "react";
import { useAccountContext, connectWallet } from "../contexts/accountContext";

import ethLogo from '../assets/eth.png'

export const Header = () => {
  const [accountState, accountDispatch] = useAccountContext();
  console.log(accountState)
  return  (
    <div className={'header'} >
      <span className={'its-unicorn-baby'}>
        🦄
      </span>
      <button onClick={() => connectWallet(accountDispatch)} className={'cta-button connect-wallet-button'}>
      {accountState.account ? `${accountState?.account.address} | ${accountState?.account.balance}` : "Connect to a wallet"} <img className={'its-eth-babe'}src={ethLogo}/>
      </button>
    </div>
  )
};
