import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import myEpicNft from "../abi/MyEpicNFT.json";

import {
  useAccountContext,
  checkIfWalletIsConnected,
} from "../contexts/accountContext";
import { CONTRACT_ADDRESS } from "../const";
import { Header } from "./Header";

import nft1 from "../assets/nft1.svg";
import nft2 from "../assets/nft2.svg";
import nft3 from "../assets/nft3.svg";
import nft4 from "../assets/nft4.svg";

export const Main = () => {
  const [accountState, accountDispatch] = useAccountContext();
  const [isMinting, setIsMinting] = useState(false);
  const [transactionList, setTransactionList] = useState<string[]>([]);

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );
        let nftTxn = await connectedContract.makeAnEpicNFT();

        setIsMinting(true);
        await nftTxn.wait();
        setIsMinting(false);
        setTransactionList([
          ...transactionList,
          `https://rinkeby.etherscan.io/tx/${nftTxn.hash}`,
        ]);
        console.log(`Mined, see transaction: }`);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const renderNotConnectedContainer = () => (
    <button disabled className="cta-button mint-button">
      Please connect wallet to start minting
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected(accountDispatch);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderNFTs = () => {
    const nfts = [nft1, nft2, nft3, nft4];
    return nfts.map((nft, id) => <img className={"its-nft-babe"} src={nft} alt="nfts" key={id}/>);
  };

  return (
    <div className="header-container">
      <Header />
      <div className={"nft-wrapper"}>{renderNFTs()}</div>
      {/* <img className={'its-doge-babe'} src={doge} alt={'doge'}/> */}
      <p className="heading gradient-text">Emoji Heroes NFT collection</p>
      <p className="sub-text">
        Emoji Heroes, each NFT has a hero avatar, weapon, and a pet
      </p>
      <p className="sub-text">Start minting get yours 🥷🏻🎸🦥</p>
      {accountState.account === null ? (
        renderNotConnectedContainer()
      ) : (
        <button
          onClick={askContractToMintNft}
          className="cta-button mint-button"
          disabled={isMinting}
        >
          {!isMinting ? `Start Minting` : `Mining ...`}
        </button>
      )}
      {transactionList.length && <div>
         <p className="sub-text transactions">Transactions</p>
        <ul>
          {transactionList.map((t, i) => (
            <li key={i}>
              <a href={t} target="_blank" rel="noreferrer" className={"link"}>
                Etherscan
              </a>
              -
              <a
                href={accountState?.openSeaLinks[i]}
                target="_blank"
                rel="noreferrer"
                className={"link"}
              >
                OpenSea
              </a>
            </li>
          ))}
        </ul>
      </div>
}
    </div>
  );
};
