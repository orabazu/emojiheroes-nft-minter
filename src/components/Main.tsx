import React, { useEffect } from "react";
import { ethers } from "ethers";
import myEpicNft from "../abi/MyEpicNFT.json";


import { useAccountContext, checkIfWalletIsConnected } from "../contexts/accountContext";
import { AccountActionTypes } from "../reducers/accountReducer";
import { CONTRACT_ADDRESS } from "../const";
import { Header } from "./Header";

import nft1 from '../assets/nft1.svg'
import nft2 from '../assets/nft2.svg'
import nft3 from '../assets/nft3.svg'
import nft4 from '../assets/nft4.svg'

export const Main = () => {

  const [accountState, accountDispatch] = useAccountContext()




 

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log("Mining...please wait.")
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  const renderNotConnectedContainer = () => (
    <button
    disabled
      className="cta-button mint-button"
    >
      Please connect wallet to start minting
    </button>
  );


  useEffect(() => {
    checkIfWalletIsConnected(accountDispatch);
  }, []);

  console.log('accountState.account}', accountState.account)

  const renderNFTs = () => {
    const nfts = [nft1, nft2,nft3,nft4]
    return nfts.map(nft => <img className={'its-nft-babe'} src={nft}/>)
  }

  return (
    <div className="header-container">
      <Header/>
      {/* <img className={'its-doge-babe'} src={doge} alt={'doge'}/> */}
      <p className="heading gradient-text">Emoji Heroes NFT collection</p>
      <p className="sub-text">
        Emoji Heroes, each NFT has a hero avatar, weapon, and a pet
      </p>
      <p className="sub-text">
        Start minting get yours 🥷🏻🎸🦥
      </p>
      {accountState.account === null ? (
        renderNotConnectedContainer()
      ) : (
        <button
          onClick={askContractToMintNft}
          className="cta-button mint-button"
        >
          Start Minting
        </button>
      )}
      <div className={'nft-wrapper'}>
        {renderNFTs()}
      </div>
    </div>
  );
};
