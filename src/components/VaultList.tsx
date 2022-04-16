import { useState, useEffect, useRef } from "react";
import { Box, VStack, HStack, Button, Text } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import { ArrowForwardIcon, CopyIcon } from "@chakra-ui/icons";
import Identicon from "./Identicon";
import VaultInterface from "./VaultInterface";

const FACTORY_ADDRESS = process.env.REACT_APP_FACTORY_ADDRESS;
const FACTORY_ABI = require("../assets/vf-abi.json");
const API_KEY = process.env.REACT_APP_API_KEY;

export default function VaultFactory(props: any) {
  const web3 = props.web3;
  const account = props.account;
  const { colorMode } = useColorMode();

  const [vaults, setVaults] = useState<any>([]);
  const [active, setActive] = useState<any>();
  const [copied, setCopied] = useState<any>(false);

  function NavLink({ children, ...props }: any) {
    return (
      <Box
        bg={colorMode === "dark" ? "gray.700" : "gray.100"}
        w="100%"
        p={"8px"}
        mt={"3px"}
        // border="3px"
        borderStyle="solid"
        borderRadius="5px"
        borderColor={colorMode === "dark" ? "gray.700" : "gray.100"}
        onClick={() => setActive(props.item)}
      >
        {children}
      </Box>
    );
  }

  var isMounted = useRef(false);
  useEffect(() => {
    var factoryContract = new web3.eth.Contract(FACTORY_ABI, FACTORY_ADDRESS);
    isMounted.current = true;
    factoryContract.methods
      .getUserVaults(account, API_KEY)
      .call()
      .then((res: any) => {
        if (isMounted.current) {
          setVaults(res);
        }
      })
      .catch((e: any) => {
        console.log(e);
      });

    return () => {
      // executed when unmount
      isMounted.current = false;
    };
  }, [account, web3]);

  function CloseItem() {
    setActive("");
  }

  if (active) {
    return (
      <VaultInterface
        web3={web3}
        item={active}
        account={account}
        Close={CloseItem}
      />
    );
  }

  return (
    <VStack w="100%" alignItems={"center"} align="stretch">
      {vaults?.length ? (
        vaults.map((item: any, index: number) => (
          <NavLink key={index} item={item}>
            <HStack justifyContent="space-between" spacing="20px">
              <Box w={"222px"}>
                <Text fontSize="lg">{item.vaultName}</Text>
              </Box>

              <Button
                minW="160px"
                border="1px"
                borderColor={colorMode === "dark" ? "gray.700" : "gray.300"}
                _hover={{
                  border: "1px",
                  borderStyle: "solid",
                  borderColor: "blue.400",
                  backgroundColor:
                    colorMode === "dark" ? "gray.700" : "blue.200",
                }}
                borderRadius="md"
                m="1px"
                px={3}
                height="38px"
                onClick={() => {
                  setCopied(!copied);
                  navigator.clipboard.writeText(item.vaultAddress);
                }}
              >
                <Text fontSize="md" fontWeight="medium" p="2">
                  {item.vaultAddress &&
                    `${item.vaultAddress.slice(
                      0,
                      6
                    )}...${item.tokenAddress.slice(
                      item.vaultAddress.length - 4,
                      item.vaultAddress.length
                    )}`}
                </Text>

                {item.vaultAddress && (
                  <CopyIcon m={2} color={copied ? "blue.800" : "gray.400"} />
                )}
                {item.vaultAddress && <Identicon account={item.vaultAddress} />}
              </Button>
              <ArrowForwardIcon onClick={() => setActive(item)} />
            </HStack>
          </NavLink>
        ))
      ) : (
        <Box
          bg={colorMode === "dark" ? "gray.700" : "gray.100"}
          w="100%"
          p={4}
          mt={"3px"}
          border="3px"
          borderStyle="solid"
          borderRadius="5px"
          borderColor={colorMode === "dark" ? "gray.700" : "gray.100"}
        >
          <Text fontSize="lg">You haven't created a vault yet.</Text>
        </Box>
      )}
    </VStack>
  );
}
