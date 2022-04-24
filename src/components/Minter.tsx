import {
  Stack,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Image,
  Icon,
  IconProps,
  useColorModeValue,
  StackDivider,
  VStack,
  Link,
} from "@chakra-ui/react";
import logo from "../assets/images/airdrop.png";
import { useState, useCallback, useEffect, useRef } from "react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const CONTRACT_ADDRESS = process.env.REACT_APP_NFT_ADDRESS;
const CONTRACT_ABI = require("../assets/nft-abi.json");

export default function Minter(props: any) {
  const mintCount = 1;
  const web3 = props.web3;
  const account = props.account;

  const [rarible, setRarible] = useState<string>("");
  const [opensea, setOpensea] = useState<string>("");
  const [etherscan, setEtherscan] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<string[]>([]);
  const handleAddComment = useCallback((comment: string, ...args: any[]) => {
    // console.log(comment, args);
    setComments((prevState) => [...prevState, comment]);
  }, []);

  const isMounted = useRef(false);

  useEffect(() => {
    async function getContractInfo() {
      setComments(["Initialized"]);
      setComments((prevState) => [...prevState, "Connecting to collection..."]);

      try {
        const nftContract = new web3.eth.Contract(
          CONTRACT_ABI,
          CONTRACT_ADDRESS
        );

        let name = await nftContract.methods.name().call();
        setComments((prevState) => [...prevState, `Collection name: ${name}`]);

        let config = await nftContract.methods.config().call();

        setComments((prevState) => [
          ...prevState,
          `Total Supply: ${config.supply}`,
        ]);
        let nextTokenId = await nftContract.methods.nextId().call();
        // console.log("Next token ID", nextTokenId);
        setComments((prevState) => [
          ...prevState,
          (nextTokenId - 1).toString() + " NFTs minted in this collection.",
        ]);

        return nextTokenId - 1;
      } catch (error) {
        setComments((prevState) => [
          ...prevState,
          `Failed to connect to contract: ${error}`,
        ]);
        return 0;
      }
    }

    isMounted.current = true;

    if (isMounted.current && account?.length) {
      getContractInfo();
    }

    return () => {
      isMounted.current = false;
    };
  }, [account, web3]);

  /**
   * mintBasicNFT function will make a request to our smart contract to mint an NFT
   *
   * @returns {Promise<void>}
   */
  const mintBasicNFT = async () => {
    setIsLoading(true);

    try {
      const nftContract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      let publicInviteKey =
        "0x0000000000000000000000000000000000000000000000000000000000000000";

      let nextTokenId = await nftContract.methods.nextId().call();

      let invite = await nftContract.methods.invite(publicInviteKey).call();
      // console.log("invite", invite);
      if (invite) {
        handleAddComment("Going to pop wallet now to pay gas...");
      }

      handleAddComment("Minting...please wait.");
      let auth = { key: publicInviteKey, proof: [] };
      let cost = parseInt(invite.price) * mintCount;
      // console.log("cost", cost);
      let nftTxn = await nftContract.methods.mint(auth, mintCount).send({
        from: account,
        value: "" + cost,
      });

      /**
       * nftTxn.hash is transaction id that we can use to create etherscan link
       */
      if (nftTxn?.transactionHash) {
        setEtherscan(`https://etherscan.io/tx/${nftTxn.transactionHash}`);

        setOpensea(
          `https://opensea.io/assets/${CONTRACT_ADDRESS}/${nextTokenId}`
        );

        setRarible(
          `https://rarible.com/token/${CONTRACT_ADDRESS}:${nextTokenId}?tab=details`
        );
        handleAddComment("Minting complete!");
        //break;
        return true;
      }
    } catch (error: any) {
      //console.log(error);
      let message = error?.message;
      console.log(message);
      handleAddComment(`Failed to mint: ${message?.split(":")[0]}`);
    } finally {
      setIsLoading(false);
      return true;
    }
  };

  return (
    <Flex align="center" justify="center" padding="10px" minH="90vh">
      <Box width="100%" pl="80px" pr="80px" minH="80vh">
        <Stack
          align={"center"}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
          direction={{ base: "column", md: "row" }}
        >
          <Stack flex={1} spacing={{ base: 5, md: 10 }}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: "3xl", sm: "4xl", lg: "5xl" }}
            >
              <Text
                as={"span"}
                position={"relative"}
                _after={{
                  content: "''",
                  width: "full",
                  height: "30%",
                  position: "absolute",
                  bottom: 1,
                  left: 0,
                  bg: "red.400",
                  zIndex: -1,
                }}
              >
                4SURE Airdrop,
              </Text>

              <Flex
                justifyContent="left"
                alignItems="left"
                bgGradient="linear(to-l,  #781BF3, #0998EA)"
                bgClip="text"
              >
                <Text as={"span"}>mint your NFT!</Text>
              </Flex>
            </Heading>

            <VStack
              divider={<StackDivider borderColor="gray.200" />}
              spacing={3}
              align="stretch"
              maxW="500px"
              mx="auto"
            >
              {comments.map((comment, index) => (
                <li key={index}>{comment}</li>
              ))}
            </VStack>
            <VStack
              spacing={{ base: 4, sm: 6 }}
              direction={{ base: "column", sm: "row" }}
            >
              <Button
                rounded={"full"}
                size={"lg"}
                fontWeight={"normal"}
                px={6}
                colorScheme={"red"}
                bgGradient="linear(to-l,  #781BF3, #0998EA)"
                _hover={{ bg: "teal.500" }}
                width="256px"
                // border='2px'
                // borderColor='#7928CA'
                isLoading={isLoading}
                loadingText="Minting"
                //_hover={{ bg: "teal.700", borderColor: "teal.700" }}
                //disabled={isDisabled}
                onClick={account && !isLoading ? mintBasicNFT : undefined}
              >
                Mint
              </Button>

              <VStack spacing={3} align="stretch" maxWidth="1xl">
                {etherscan?.length && (
                  <Link href={etherscan} isExternal>
                    View on Etherscan <ExternalLinkIcon mx="2px" />
                  </Link>
                )}
                {rarible?.length && (
                  <Link href={rarible} isExternal>
                    View on Rarible <ExternalLinkIcon mx="2px" />
                  </Link>
                )}
                {opensea?.length && (
                  <Link href={opensea} isExternal>
                    View on OpenSea <ExternalLinkIcon mx="2px" />
                  </Link>
                )}
              </VStack>
            </VStack>
          </Stack>
          <Stack
            flex={1}
            spacing={{ base: 5, md: 10 }}
            align="stretch"
            maxWidth="1xl"
          >
            <Text color={"gray.500"}>
              BLOCKSURANCE Airdrop mints your NFTs directly on the Ethereum
              blockchain. Mint now and recieve 1000 4SURE on the last day of the
              month.
            </Text>
            <Flex
              flex={1}
              justify={"center"}
              align={"center"}
              position={"relative"}
              w={"full"}
            >
              <Blob
                w={"150%"}
                h={"150%"}
                position={"absolute"}
                top={"-20%"}
                left={0}
                zIndex={-1}
                color={useColorModeValue("#7928CA", "#7928CA")}
              />
              <Box
                position={"relative"}
                height={"300px"}
                rounded={"2xl"}
                //boxShadow={'2xl'}
                width={"full"}
                overflow={"hidden"}
              >
                <Image
                  src={logo}
                  boxSize="256px"
                  borderRadius="10px"
                  position={"absolute"}
                  left={"50%"}
                  top={"50%"}
                  transform={"translateX(-50%) translateY(-50%)"}
                />
              </Box>
            </Flex>
          </Stack>
        </Stack>
      </Box>
    </Flex>
  );
}

export const Blob = (props: IconProps) => {
  return (
    <Icon
      width={"85%"}
      viewBox="0 0 578 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M239.184 439.443c-55.13-5.419-110.241-21.365-151.074-58.767C42.307 338.722-7.478 282.729.938 221.217c8.433-61.644 78.896-91.048 126.871-130.712 34.337-28.388 70.198-51.348 112.004-66.78C282.34 8.024 325.382-3.369 370.518.904c54.019 5.115 112.774 10.886 150.881 49.482 39.916 40.427 49.421 100.753 53.385 157.402 4.13 59.015 11.255 128.44-30.444 170.44-41.383 41.683-111.6 19.106-169.213 30.663-46.68 9.364-88.56 35.21-135.943 30.551z"
        fill="currentColor"
      />
    </Icon>
  );
};
