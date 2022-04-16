import { useState, useEffect, useRef } from "react";
import { formatEther } from "@ethersproject/units";
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Link,
} from "@chakra-ui/react";
import { useColorMode, useDisclosure } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import Identicon from "./Identicon";
import { Stake } from "./Stake";
import VendorModal from "./VendorModal";
import useWindowDimensions from "../hooks/useWindowDimensions";
const ERC20_ABI = require("../assets/erc20-abi.json");
const STAKER_ABI = require("../assets/staker-abi.json");
const VENDOR_ABI = require("../assets/vendor-abi.json");
const COIN_ADDRESS = process.env.REACT_APP_COIN_ADDRESS || "";
const STAKER_ADDRESS = process.env.REACT_APP_STAKER_ADDRESS || "";
const VENDOR_ADDRESS = process.env.REACT_APP_VENDOR_ADDRESS || "";
const API_KEY = process.env.REACT_APP_API_KEY;

export default function StakeInterface(props: any) {
  const web3 = props.web3;
  const account = props.account;
  const minStake = 300;
  const { colorMode } = useColorMode();
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState<any>(false);

  const [amount, setAmount] = useState<any>("");
  const [days, setDays] = useState<any>(180);
  const [apr, setAPR] = useState<any>(21);
  const [rates, setRates] = useState<any>([21, 33, 45]);
  const [symbol, setSymbol] = useState<any>("");
  const [stake, setStake] = useState<number>(0);
  const [approve, setApprove] = useState<any>(false);
  const [copied, setCopied] = useState<any>(false);
  const [balance, setBalance] = useState<any>();
  const [allowance, setAllowance] = useState<any>(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // var stakerContract = new web3.eth.Contract(STAKER_ABI, STAKER_ADDRESS);
  var vendorContract = new web3.eth.Contract(VENDOR_ABI, VENDOR_ADDRESS);
  var isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    var coinContract = new web3.eth.Contract(ERC20_ABI, COIN_ADDRESS);
    var stakerContract = new web3.eth.Contract(STAKER_ABI, STAKER_ADDRESS);

    coinContract?.methods
      .allowance(account, STAKER_ADDRESS)
      .call()
      .then((res: any) => {
        if (isMounted.current) {
          setAllowance(parseFloat(formatEther(res)).toFixed(3));
        }
      })
      .catch((e: any) => {
        console.log(e);
      });

    coinContract?.methods
      .balanceOf(account)
      .call()
      .then((res: any) => {
        if (isMounted.current) {
          setBalance(parseFloat(formatEther(res)).toFixed(2));
        }
      })
      .catch((e: any) => {
        console.log(e);
      });

    coinContract?.methods
      .symbol()
      .call()
      .then((res: any) => {
        if (isMounted.current) {
          setSymbol(res);
        }
      })
      .catch((e: any) => {
        console.log(e);
      });

    stakerContract?.methods
      .getUserStake(account, API_KEY)
      .call()
      .then((res: any) => {
        if (isMounted.current) {
          // console.log(res);
          setStake(parseInt(formatEther(res.amount)));
        }
      })
      .catch((e: any) => {
        console.log(e);
      });

    stakerContract?.methods
      .getRates()
      .call()
      .then((res: any) => {
        if (isMounted.current) {
          // console.log(res);
          setRates(res);
        }
      })
      .catch((e: any) => {
        console.log(e);
      });

    return () => {
      // executed when unmount
      isMounted.current = false;
    };
  }, [loading, account, web3]);

  function updateBalance() {
    var coinContract = new web3.eth.Contract(ERC20_ABI, COIN_ADDRESS);
    coinContract.methods
      .balanceOf(account)
      .call()
      .then((res: any) => {
        if (isMounted.current) {
          setBalance(parseFloat(formatEther(res)).toFixed(2));
        }
      })
      .catch((e: any) => {
        console.log(e);
      });
  }

  function updateAPR(newdays: number) {
    if (newdays > 360) {
      setAPR(rates[2]);
    } else if (newdays > 180) {
      setAPR(rates[1]);
    } else {
      setAPR(rates[0]);
    }
  }

  const CountButton = (props: any) => {
    const decrementdays = () => {
      let newdays = days - 90;
      if (newdays < 1) {
        newdays = 1;
      }
      setDays(newdays);
      updateAPR(newdays);
    };

    const incrementdays = () => {
      let newdays = days + 90;
      if (newdays === 91) {
        newdays = 90;
      }
      setDays(newdays);
      updateAPR(newdays);
    };

    return (
      <HStack
        //divider={<StackDivider borderColor='gray.200' />}
        spacing={4}
        align="stretch"
        alignItems="center"
      >
        <Button
          style={{ lineHeight: 0.4 }}
          //disabled={isLoading ? 1 : 0}
          onClick={(e) => {
            e.preventDefault();
            decrementdays();
          }}
        >
          -
        </Button>

        <Text
          style={{
            textAlign: "center",
            color: "var(--accent-text)",
          }}
        >
          {days}
        </Text>

        <Button
          //disabled={isLoading ? 1 : 0}
          onClick={(e) => {
            e.preventDefault();
            incrementdays();
          }}
        >
          +
        </Button>
      </HStack>
    );
  };

  async function approveStake() {
    setLoading(true);
    var coinContract = new web3.eth.Contract(ERC20_ABI, COIN_ADDRESS);
    try {
      var approved = await coinContract.methods
        .approve(STAKER_ADDRESS, web3.utils.toWei(amount, "ether"))
        .send({
          from: account,
        });
      // console.log(approved);
      if (approved.transactionHash) {
        setApprove(true);
      }
    } catch (error: any) {
      //console.log(error);
      let message = error?.message;
      console.log(message);
    } finally {
      setLoading(false);
    }
  }

  async function stakeTokens() {
    setLoading(true);
    // var coinContract = new web3.eth.Contract(ERC20_ABI, COIN_ADDRESS);
    var stakerContract = new web3.eth.Contract(STAKER_ABI, STAKER_ADDRESS);
    try {
      // var balance = await coinContract.methods.balanceOf(STAKER_ADDRESS).call();
      // console.log(balance);

      var stake = await stakerContract.methods
        .stakeTokens(API_KEY, web3.utils.toWei(amount, "ether"), parseInt(days))
        .send({
          from: account,
        });

      // console.log(stake);
      if (stake.transactionHash) {
        setApprove(true);
      }

      // balance = await coinContract.methods.balanceOf(STAKER_ADDRESS).call();
      // console.log(balance);
    } catch (error: any) {
      //console.log(error);
      let message = error?.message;
      console.log(message);
    } finally {
      setLoading(false);
      setAmount("");
    }
  }

  async function burnStake() {
    setLoading(true);
    // var coinContract = new web3.eth.Contract(ERC20_ABI, COIN_ADDRESS);
    var stakerContract = new web3.eth.Contract(STAKER_ABI, STAKER_ADDRESS);

    try {
      // var balance = await coinContract.methods.balanceOf(account).call();
      // console.log(balance);

      await stakerContract.methods.burnStake(account).send({
        from: account,
      });
      // console.log(burn);

      // balance = await coinContract.methods.balanceOf(account).call();
      // console.log(balance);
    } catch (error: any) {
      //console.log(error);
      let message = error?.message;
      console.log(message);
    } finally {
      setLoading(false);
    }
  }

  // console.log(parseInt(amount) >= 300);
  if (stake < 1 && balance < 1) {
    return (
      // <VStack w="100%" h="100%" spacing={"20px"} mt={"3px"}>
      <VStack
        w="100%"
        alignItems={"center"}
        verticalAlign={"center"}
        // spacing={"25px"}
        //divider={<StackDivider h={"50px"} />}
      >
        <Box
          bg={colorMode === "dark" ? "gray.700" : "gray.100"}
          w="100%"
          border="3px"
          borderStyle="solid"
          borderRadius="5px"
          borderColor={colorMode === "dark" ? "gray.700" : "gray.100"}
          padding={"10px"}
        >
          <HStack justifyContent="space-between" pb={4}>
            <Text fontSize="lg" ml={1}>
              {"BLOCKSURANCE"} ({symbol})
            </Text>
            <Text fontSize="lg" ml={4}>
              APR: {apr}%
            </Text>
          </HStack>
          <HStack justifyContent="space-between">
            <Button
              minW="130px"
              border="1px"
              borderColor={colorMode === "dark" ? "transparent" : "gray.300"}
              _hover={{
                border: "1px",
                borderStyle: "solid",
                borderColor: "blue.400",
                backgroundColor: colorMode === "dark" ? "gray.700" : "blue.200",
              }}
              borderRadius="5px"
              m="1px"
              // px={3}
              height="42px"
              onClick={() => {
                setCopied(!copied);
                navigator.clipboard.writeText(COIN_ADDRESS);
              }}
            >
              <Text fontSize="md" fontWeight="medium">
                {COIN_ADDRESS &&
                  `${COIN_ADDRESS.slice(0, 6)}...${COIN_ADDRESS.slice(
                    COIN_ADDRESS.length - 4,
                    COIN_ADDRESS.length
                  )}`}
              </Text>
              <Link
                fontSize="sm"
                display="flex"
                alignItems="center"
                href={`https://etherscan.io/address/${COIN_ADDRESS}`}
                isExternal
                color="gray.400"
                //m={2}
                _hover={{
                  color: "whiteAlpha.800",
                  textDecoration: "underline",
                }}
              >
                <ExternalLinkIcon m={"8px"} w={5} h={5} color={"blue.400"} />
              </Link>

              {width > 450 && <Identicon account={COIN_ADDRESS} />}

              <VendorModal
                isOpen={isOpen}
                onClose={onClose}
                web3={web3}
                account={account}
                network={props.network}
                vendorContract={vendorContract}
                updateBalance={updateBalance}
              />
            </Button>
            <Button
              display="flex"
              alignItems="center"
              borderRadius="5px"
              onClick={onOpen}
              p={0}
              border="1px"
              borderColor={colorMode === "dark" ? "transparent" : "gray.300"}
              h={"42px"}
              _hover={{
                border: "1px",
                borderStyle: "solid",
                borderColor: "blue.400",
                backgroundColor: colorMode === "dark" ? "gray.700" : "blue.200",
              }}
            >
              <Box p="8px">
                <Text fontSize="md" fontWeight="medium">
                  {balance}
                </Text>
              </Box>
              <Box
                bg={colorMode === "dark" ? "cyan.600" : "cyan.300"}
                _hover={{
                  border: "1px",
                  borderStyle: "solid",
                  borderColor: "blue.400",
                  backgroundColor:
                    colorMode === "dark" ? "cyan.800" : "gray.400",
                }}
                borderRadius="md"
                m="3px"
                w="72px"
              >
                <Box h="34px" p="8px">
                  <Text fontSize="md" fontWeight="medium">
                    BUY
                  </Text>
                </Box>
              </Box>
            </Button>
          </HStack>
        </Box>
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
          <Text fontSize="lg">
            Your token balance is zero. Purchase some tokens.
          </Text>
        </Box>
      </VStack>
    );
  }

  return (
    <VStack w="100%" h="100%" spacing={"20px"} mt={"3px"}>
      <Box
        bg={colorMode === "dark" ? "gray.700" : "gray.100"}
        w="100%"
        border="3px"
        borderStyle="solid"
        borderRadius="5px"
        borderColor={colorMode === "dark" ? "gray.700" : "gray.100"}
        p={"8px"}
      >
        <HStack justifyContent="space-between" pb={4}>
          <Text fontSize="lg" ml={1}>
            {"BLOCKSURANCE"} ({symbol})
          </Text>
          <Text fontSize="lg" ml={4}>
            APR: {apr}%
          </Text>
        </HStack>
        <HStack justifyContent="space-between">
          <Button
            minW="130px"
            border="1px"
            borderColor={colorMode === "dark" ? "transparent" : "gray.300"}
            _hover={{
              border: "1px",
              borderStyle: "solid",
              borderColor: "blue.400",
              backgroundColor: colorMode === "dark" ? "gray.700" : "blue.200",
            }}
            borderRadius="5px"
            m="1px"
            // px={3}
            height="42px"
            onClick={() => {
              setCopied(!copied);
              navigator.clipboard.writeText(COIN_ADDRESS);
            }}
          >
            <Text fontSize="md" fontWeight="medium" p="2px">
              {COIN_ADDRESS &&
                `${COIN_ADDRESS.slice(0, 6)}...${COIN_ADDRESS.slice(
                  COIN_ADDRESS.length - 4,
                  COIN_ADDRESS.length
                )}`}
            </Text>
            <Link
              fontSize="sm"
              display="flex"
              alignItems="center"
              href={`https://etherscan.io/address/${COIN_ADDRESS}`}
              isExternal
              color="gray.400"
              // m={1}
              _hover={{
                color: "whiteAlpha.800",
                textDecoration: "underline",
              }}
            >
              <ExternalLinkIcon m={"8px"} w={5} h={5} color={"blue.400"} />
            </Link>

            {width > 450 && <Identicon account={COIN_ADDRESS} />}

            <VendorModal
              isOpen={isOpen}
              onClose={onClose}
              web3={web3}
              account={account}
              network={props.network}
              vendorContract={vendorContract}
              updateBalance={updateBalance}
            />
          </Button>
          <Button
            display="flex"
            alignItems="center"
            border="1px"
            borderColor={colorMode === "dark" ? "transparent" : "gray.300"}
            borderRadius="5px"
            bg={colorMode === "dark" ? "gray.800" : "transparent"}
            onClick={onOpen}
            p={0}
            h={"42px"}
            _hover={{
              border: "1px",
              borderStyle: "solid",
              borderColor: "blue.400",
              backgroundColor: colorMode === "dark" ? "gray.700" : "blue.200",
            }}
          >
            <Box p="8px">
              <Text fontSize="md" fontWeight="medium">
                {balance}
              </Text>
            </Box>

            <Box
              // onClick={onOpen}
              bg={colorMode === "dark" ? "cyan.600" : "cyan.300"}
              _hover={{
                border: "1px",
                borderStyle: "solid",
                borderColor: "blue.400",
                backgroundColor: colorMode === "dark" ? "cyan.800" : "gray.400",
              }}
              borderRadius="md"
              m="3px"
              w="72px"
            >
              <Box h="34px" p="8px">
                <Text fontSize="md" fontWeight="medium">
                  BUY
                </Text>
              </Box>
            </Box>
          </Button>
        </HStack>
      </Box>

      {stake > 0 ? (
        <>
          <Box
            bg={colorMode === "dark" ? "gray.700" : "gray.100"}
            w="100%"
            border="3px"
            borderStyle="solid"
            borderRadius="5px"
            borderColor={colorMode === "dark" ? "gray.700" : "gray.100"}
            padding={"10px"}
          >
            <Stake web3={web3} account={account} />
          </Box>

          <Button
            h={"40px"}
            minW={"100%"}
            border="1px"
            borderStyle="solid"
            borderColor="gray.400"
            isLoading={loading}
            loadingText="Loading..."
            disabled={stake < minStake}
            onClick={burnStake}
          >
            Burn Stake
          </Button>
        </>
      ) : (
        <>
          <Text fontSize="sm" ml={4}>
            You must approve transfer of tokens to our vault, current allowance:{" "}
            {allowance}
          </Text>
          <Input
            w={"80%"}
            border="1px"
            borderStyle="solid"
            borderColor="blue.300"
            style={{ textAlign: "center" }}
            placeholder={"Amount of tokens"}
            value={amount}
            maxW={"3xl"}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />

          <Button
            h={"40px"}
            minW={"100%"}
            border="1px"
            borderStyle="solid"
            borderColor="gray.400"
            isLoading={loading}
            loadingText="Loading..."
            //disabled={approve}
            onClick={approveStake}
          >
            {approve ? "Approved " + allowance : "Approve transfer"}
          </Button>
          <Text fontSize="sm" ml={4}>
            Lockup period in days
          </Text>
          <CountButton />
          <Button
            h={"40px"}
            minW={"100%"}
            border="1px"
            borderStyle="solid"
            borderColor="gray.400"
            isLoading={loading}
            loadingText="Loading..."
            disabled={
              parseInt(amount) < 300 ||
              parseInt(allowance) < parseInt(amount) ||
              stake > 0
            }
            onClick={stakeTokens}
          >
            {stake > 0
              ? "Staked " + parseFloat(formatEther(stake)).toFixed(1)
              : "Stake"}
          </Button>
        </>
      )}
    </VStack>
  );
}
