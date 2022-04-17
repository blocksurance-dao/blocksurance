import React, { useState, useEffect } from "react";
import { useColorMode } from "@chakra-ui/react";

import Web3Modal from "web3modal";
import WalletLink from "walletlink";
import WalletConnect from "@walletconnect/web3-provider";
import Fortmatic from "fortmatic";

import { web3Context } from "./context/web3Context";
import Main from "./Main";

const App: React.FC = () => {
  const INFURA_ID = process.env.REACT_APP_INFURA_ID;
  const FORTMATIC = process.env.REACT_APP_FORTMATIC_KEY;
  const [web3modal, setModal] = useState<any>();
  const { colorMode } = useColorMode();

  useEffect(() => {
    async function getModal() {
      await web3modal?.clearCachedProvider();
      let web3Modal = new Web3Modal({
        network: "mainnet", //getNetwork(),
        cacheProvider: true,
        theme: colorMode,
        providerOptions: {
          walletconnect: {
            package: WalletConnect,
            options: {
              bridge: "https://polygon.bridge.walletconnect.org",
              infuraId: INFURA_ID,
            },
          },
          fortmatic: {
            package: Fortmatic, // required
            options: {
              key: FORTMATIC, // required
            },
          },
          walletlink: {
            package: WalletLink,
            options: {
              appName: "BLOCKSURANCE",
              infuraId: INFURA_ID,
            },
          },
        },
      });

      setModal(web3Modal);
    }

    getModal();
  }, [colorMode]);

  return (
    <web3Context.Provider value={web3modal}>
      <Main />
    </web3Context.Provider>
  );
};

export default App;
