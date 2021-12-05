/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useReducer } from "react";
import { ethers } from "ethers";
import myEpicNft from "../abi/MyEpicNFT.json";

import {
  AccountAction,
  AccountActionTypes,
  AccountState,
  initialState,
  reducer,
} from "../reducers/accountReducer";
import { CONTRACT_ADDRESS, OPENSEA_LINK } from "../const";
type AccountContextType = [AccountState, React.Dispatch<AccountAction>];

export type Props = {
  children: React.ReactNode;
};

//@ts-ignore
const AccountContext = createContext<AccountContextType>(null);
const AccountContextProvider = (props: Props): JSX.Element => {
  const [accountState, accountDispatch] = useReducer(reducer, initialState);

  return (
    <AccountContext.Provider value={[accountState, accountDispatch]}>
      {props.children}
    </AccountContext.Provider>
  );
};

async function connectWallet(dispatch:React.Dispatch<AccountAction>) {
  dispatch({type: AccountActionTypes.SET_ISLOADING, payload:true})
  try {
    const { ethereum  } = window;

    if (!ethereum) {
      alert("Get MetaMask!");
      return;
    }
    const provider  = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner();
    const accounts = await ethereum.request({ method: "eth_requestAccounts" },signer);
    const balance = await provider.getBalance(accounts[0])

    const payload = {
      address: accounts[0],
      balance: Number(ethers.utils.formatEther(balance)).toFixed(3)
    }
    console.log("Connected", accounts);
    dispatch({type: AccountActionTypes.SET_ACCOUNT, payload})
    dispatch({type: AccountActionTypes.SET_ISLOADING, payload:false})
    setupEventListener()
  } catch (error) {
    console.log(error)
    dispatch({type: AccountActionTypes.SET_ACCOUNT_FAILURE})
  }
}

 const setupEventListener = async () => {
  // Most of this looks the same as our function askContractToMintNft
  try {
    const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicNft.abi,
        signer
      );

      connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
        console.log(from, tokenId.toNumber());
        alert(`Hey there! We've minted your NFT and sent it to your wallet. 
          It may be blank right now. It can take a max of 10 min to show up on OpenSea. 
          Here's the link: ${OPENSEA_LINK}${CONTRACT_ADDRESS}/${tokenId.toNumber()}`);
      });

      console.log("Setup event listener!");
    }
   catch (error) {
    console.log(error);
  }
};

const checkIfWalletIsConnected = async (dispatch:React.Dispatch<AccountAction>) => {
  /*
   * First make sure we have access to window.ethereum
   */
  const { ethereum } = window;

  if (!ethereum) {
    console.log("Make sure you have metamask!");
    return;
  } else {
    console.log("We have the ethereum object", ethereum);
  }
  checkChain();

  const accounts = await ethereum.request({ method: "eth_accounts" });
  const provider  = new ethers.providers.Web3Provider(ethereum)

  if (accounts.length !== 0) {
    const account = accounts[0];
    const balance = await provider.getBalance(accounts[0])

    const payload = {
      address: accounts[0],
      balance: Number(ethers.utils.formatEther(balance)).toFixed(3)
    }
    dispatch({type: AccountActionTypes.SET_ACCOUNT, payload})
    // setupEventListener();
  } else {
    console.log("No authorized account found");
  }
};

const checkChain = async () => {
  const { ethereum } = window;
    let chainId = await ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain " + chainId);

    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = "0x4";
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the Rinkeby Test Network!");
      return;
    }
  
};

const useAccountContext = () => useContext(AccountContext);

export { AccountContextProvider, useAccountContext, connectWallet, checkIfWalletIsConnected };
