import { useState, useEffect, useRef } from "react";
import {
  Box,
  VStack,
  Text,
  HStack,
  Link,
  Image,
  useColorMode,
} from "@chakra-ui/react";

import { ExternalLinkIcon, CopyIcon } from "@chakra-ui/icons";
import InfiniteScroll from "react-infinite-scroll-component";
// import Identicon from "./Identicon";

const TOKENLIST = require("../assets/TokenList.json");

function ListItem({ children, ...props }: any) {
  const item = props.item;
  const { colorMode } = useColorMode();
  const [copied, setCopied] = useState<any>(false);

  return (
    <Box
      bg={colorMode === "dark" ? "gray.700" : "gray.100"}
      w="100%"
      p={"5px"}
      mt={"3px"}
      border="3px"
      borderStyle="solid"
      borderRadius="5px"
      borderColor={colorMode === "dark" ? "gray.700" : "gray.100"}
    >
      <HStack justifyContent="space-between">
        <Box w={"50px"}>
          <Image src={item.logoURI} alt="" />
        </Box>
        <Box w={"180px"}>
          <Text fontSize="sm">{item.name}</Text>
          <Text fontSize="sm">{item.symbol}</Text>
        </Box>
        <Link
          fontSize="sm"
          display="flex"
          alignItems="center"
          href={`https://etherscan.io/address/${item.address}`}
          isExternal
          color="gray.400"
          _hover={{
            color: "whiteAlpha.800",
            textDecoration: "underline",
          }}
        >
          <ExternalLinkIcon m={"8px"} w={5} h={5} color={"blue.400"} />
        </Link>
        <HStack
          w="170px"
          minW="170px"
          border="1px"
          justifyContent="space-between"
          bg={colorMode === "dark" ? "#3D4756" : "gray.300"}
          borderColor={colorMode === "dark" ? "gray.700" : "gray.300"}
          _hover={{
            border: "1px",
            borderStyle: "solid",
            borderColor: "blue.400",
            backgroundColor: colorMode === "dark" ? "gray.600" : "blue.200",
          }}
          borderRadius="md"
          m="1px"
          px={3}
          height="38px"
          onClick={() => {
            setCopied(!copied);
            navigator.clipboard.writeText(item.address);
          }}
        >
          <Box ml={0}>
            <Text fontSize="md" fontWeight="medium" p="3px">
              {item.address &&
                `${item.address.slice(0, 6)}...${item.address.slice(
                  item.address.length - 4,
                  item.address.length
                )}`}
            </Text>
          </Box>

          {item.address && (
            <Box ml={"4px"}>
              <CopyIcon color={copied ? "blue.500" : "gray.400"} />
            </Box>
          )}
          {/* {item.address && (
                    <Box ml={2}>
                      <Identicon account={item.address} />
                    </Box>
                  )} */}
        </HStack>
      </HStack>
    </Box>
  );
}

export default function TokenList(props: any) {
  const [tokens, setTokens] = useState<any>([]);

  const fetchMoreData = () => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    setTimeout(() => {
      if (tokens.length < TOKENLIST?.tokens?.length) {
        const moreTokens = TOKENLIST.tokens.slice(0, tokens.length + 10);
        // const myArray = [...tokens, ...aray2]
        setTokens(moreTokens);
      }
    }, 1000);
  };

  var isMounted = useRef(false);

  useEffect(() => {
    // console.log("Number of tokens: ", TOKENLIST?.tokens?.length);
    isMounted.current = true;
    if (isMounted.current && TOKENLIST?.tokens?.length) {
      setTokens(TOKENLIST?.tokens?.slice(0, 7));
      //   console.log(tokens.length);
    }
    return () => {
      // executed when unmount
      isMounted.current = false;
    };
  }, []);

  return (
    <VStack
      w="100%"
      // h="100%"
      flexDirection="column"
      alignItems="space-between"
      justifyContent="center"
    >
      <InfiniteScroll
        dataLength={tokens.length}
        next={fetchMoreData}
        hasMore={tokens.length < TOKENLIST?.tokens?.length}
        loader={<h4>Loading...</h4>}
      >
        {tokens?.length &&
          tokens.map((item: any, index: number) => (
            <ListItem key={index} item={item} />
          ))}
      </InfiniteScroll>
    </VStack>
  );
}
