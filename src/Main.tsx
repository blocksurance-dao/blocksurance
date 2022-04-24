import React, { useContext, useState, useRef, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Layout } from "./components/Layout";

import ConnectButton from "./components/ConnectButton";
import AccountModal from "./components/AccountModal";
import Web3 from "web3";
import { web3Context } from "./context/web3Context";
import { getChainData } from "./helpers/utilities";
import { useDisclosure } from "@chakra-ui/react";
import InterfaceMain from "./components/InterfaceMain";
import FAQ from "./components/FAQ";
import About from "./components/About";
import Contact from "./components/Contact";
import Minter from "./components/Minter";
import { Landing } from "./components/Landing";
import useWindowDimensions from "./hooks/useWindowDimensions";
import Login from "./components/Login";
import InvalidChain from "./components/InvalidChain";

const useScrollToTop = () => {
  const location = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location]);
};

function initWeb3(provider: any) {
  const web3: any = new Web3(provider);

  web3.eth.extend({
    methods: [
      {
        name: "chainId",
        call: "eth_chainId",
        outputFormatter: web3.utils.hexToNumber,
      },
    ],
  });

  return web3;
}

const Main: React.FC = () => {
  const web3modal = useContext(web3Context);
  const [web3instance, setWeb3instance] = useState<any>();
  const [account, setAccount] = useState<any>("");
  const [chainId, setChainId] = useState<number>(1);
  const [network, setNetwork] = useState<string>("");
  const [cachedProvider, setCachedProvider] = useState<any>("");

  const [etherBalance, setEtherBalance] = useState<any>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [validpin, setValidpin] = useState<boolean>(false);
  const { height, width } = useWindowDimensions();

  var isMounted = useRef(false);

  function regComplete() {
    setValidpin(true);
  }

  const resetApp = async () => {
    // console.log(web3instance);
    if (web3instance && web3instance?.eth?.currentProvider) {
      await web3instance.eth.currentProvider.disconnect;
      await web3modal?.clearCachedProvider();
      setAccount("");
    }
  };

  const subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return;
    }
    provider.on("disconnect", () => resetApp());
    provider.on("accountsChanged", async (accounts: string[]) =>
      setAccount(accounts[0])
    );
    provider.on("chainChanged", async (chainId: string) => {
      // console.log(chainId, parseInt(chainId, 16));
      setChainId(parseInt(chainId, 16));
      let network = getChainData(parseInt(chainId, 16)).network;
      setNetwork(network);
      console.log(network);
    });
  };

  const onConnect = async () => {
    try {
      await web3modal?.clearCachedProvider();
      const provider = await web3modal?.connect();
      // console.log(provider);

      await subscribeProvider(provider);

      const web3: any = initWeb3(provider);
      setWeb3instance(web3);

      const cachedProviderName = web3.currentProvider.isMetaMask;
      setCachedProvider(cachedProviderName);

      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      setAccount(address);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    isMounted.current = true;

    async function updateBalance() {
      if (web3instance && account && isMounted.current) {
        setValidpin(false);
        const chain = await web3instance?.eth.chainId();
        setChainId(chain);
        // console.log(chain);
        // const chain = await web3instance?.eth.net.getId();
        // setChainId(chain);
        let network = getChainData(chain).network;
        setNetwork(network);

        let balance: any = await web3instance?.eth.getBalance(account);
        setEtherBalance(balance);
      }
    }

    updateBalance();
    return () => {
      // executed when unmount
      isMounted.current = false;
    };
  }, [account, chainId, web3instance]);

  function Home() {
    useScrollToTop();
    async function _updateBalance() {
      let balance: any = await web3instance?.eth.getBalance(account);
      setEtherBalance(balance);
    }
    if (account?.length) {
      if (chainId !== 1 && chainId !== 31337) {
        return <InvalidChain />;
      }
      if (!validpin) {
        return (
          <Flex align="center" justify="center" padding="10px" minH="90vh">
            <Box
              mt={"80px"}
              minW={width > 600 ? "80%" : "95%"}
              minH="70vh"
              alignSelf="center"
              border={width > 450 ? "1px" : "0px"}
              borderStyle="solid"
              borderColor="gray.600"
              borderRadius="3xl"
              padding={width > 600 ? "50px" : "20px"}
            >
              <Box
                minH={height / 2}
                minW={width > 600 ? "80%" : "98%"}
                border="1px"
                borderStyle="solid"
                borderColor="gray.600"
                borderRadius="3xl"
              >
                <Login
                  web3={web3instance}
                  account={account}
                  network={network}
                  regComplete={regComplete}
                  // registered={registered}
                  // validpin={validpin}
                />
              </Box>
            </Box>
          </Flex>
        );
      }

      return (
        <InterfaceMain
          web3={web3instance}
          account={account}
          network={network}
          updateBalance={_updateBalance}
        />
      );
    } else {
      return <NoMeta />;
    }
  }

  function Connect() {
    return (
      <>
        <ConnectButton
          handleOpenModal={onOpen}
          onConnect={onConnect}
          account={account}
          balance={etherBalance}
        />

        <AccountModal
          isOpen={isOpen}
          onClose={onClose}
          disconnect={resetApp}
          account={account}
          network={network}
          provider={cachedProvider}
        />
      </>
    );
  }

  function Airdrop() {
    useScrollToTop();
    async function _updateBalance() {
      let balance: any = await web3instance?.eth.getBalance(account);
      setEtherBalance(balance);
    }
    if (account?.length) {
      if (chainId !== 1 && chainId !== 31337) {
        return <InvalidChain />;
      }
      if (!validpin) {
        return (
          <Flex align="center" justify="center" padding="10px" minH="90vh">
            <Box
              mt={"80px"}
              minW={width > 600 ? "80%" : "95%"}
              minH="70vh"
              alignSelf="center"
              border={width > 450 ? "1px" : "0px"}
              borderStyle="solid"
              borderColor="gray.600"
              borderRadius="3xl"
              padding={width > 600 ? "50px" : "20px"}
            >
              <Box
                minH={height / 2}
                minW={width > 600 ? "80%" : "98%"}
                border="1px"
                borderStyle="solid"
                borderColor="gray.600"
                borderRadius="3xl"
              >
                <Login
                  web3={web3instance}
                  account={account}
                  network={network}
                  regComplete={regComplete}
                  // registered={registered}
                  // validpin={validpin}
                />
              </Box>
            </Box>
          </Flex>
        );
      }

      return (
        <Minter
          web3={web3instance}
          account={account}
          network={network}
          updateBalance={_updateBalance}
        />
      );
    } else {
      return <NoMeta />;
    }
  }

  return (
    <Layout>
      <Navbar ConnectComponent={Connect} />
      {/* <Container as="main" mt="80"> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />}>
          {/* <Route path=":id" element={<Contact />} /> */}
        </Route>
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/airdrop" element={<Airdrop />} />
      </Routes>
      {/* </Container> */}
      <Footer />
    </Layout>
  );
};

export default Main;

const NoMeta = () => {
  useScrollToTop();
  const { height, width } = useWindowDimensions();
  return (
    <Flex align="center" justify="center" padding="5px" minH="90vh">
      <Box
        mt={"80px"}
        minW={width > 600 ? "80%" : "95%"}
        minH="70vh"
        alignSelf="center"
        //border="1px"
        borderStyle="solid"
        borderColor="gray.600"
        borderRadius="3xl"
        padding={width > 600 ? "50px" : "20px"}
        //bgGradient="linear(to-t, purple.800, gray.700)"
      >
        <Box
          minH={height / 2}
          minW={width > 600 ? "80%" : "95%"}
          border={width > 450 ? "1px" : 0}
          borderStyle="solid"
          borderColor="gray.600"
          borderRadius="3xl"
          padding="50px"
        >
          <Landing />
        </Box>
      </Box>
    </Flex>
  );
};
