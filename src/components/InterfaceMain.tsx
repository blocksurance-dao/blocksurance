import { useEffect } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { Box, Flex } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import StakeInterface from "./StakeInterface";
import TokenList from "./TokenList";
import useWindowDimensions from "../hooks/useWindowDimensions";
import VaultFactory from "./VaultFactory";
import VaultList from "./VaultList";

const useScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location]);
};

export default function InterfaceMain(props: any) {
  useScrollToTop();
  const web3 = props.web3;
  const account = props.account;
  const network = props.network;
  const { width } = useWindowDimensions();
  // const { height, width } = useWindowDimensions();

  return (
    <Flex align="center" justify="center" padding="25px" minH="90vh">
      <Box
        mt={"80px"}
        // h="85%"
        // w="85%"
        minW={width > 600 ? "80%" : "95%"}
        minH="70vh"
        alignSelf="center"
        border={width > 450 ? "1px" : "0px"}
        borderStyle="solid"
        borderColor="gray.600"
        borderRadius="3xl"
        padding={width > 600 ? "50px" : "20px"}
        //bgGradient="linear(to-t, purple.800, gray.700)"
      >
        <Box
          // minH={height / 2}
          minH={"554px"}
          minW={width > 600 ? "80%" : "98%"}
          border="1px"
          borderStyle="solid"
          borderColor="gray.600"
          borderRadius="3xl"
        >
          <Tabs variant="enclosed">
            <TabList ml={2} mr={4}>
              <Tab>Listed Tokens</Tab>
              <Tab>Stake 4SURE</Tab>
              <Tab>Create Vault</Tab>
              <Tab>My Vaults</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <TokenList web3={web3} account={account} network={network} />
              </TabPanel>
              <TabPanel>
                <StakeInterface
                  web3={web3}
                  account={account}
                  network={network}
                  updateNavBalance={props.updateBalance}
                />
              </TabPanel>
              <TabPanel>
                <VaultFactory
                  web3={web3}
                  account={account}
                  network={network}
                  updateBalance={props.updateBalance}
                />
              </TabPanel>
              <TabPanel>
                <VaultList web3={web3} account={account} network={network} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </Flex>
  );
}
