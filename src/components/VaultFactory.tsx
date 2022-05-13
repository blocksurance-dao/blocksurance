import { useState, useEffect, useRef } from "react";
import { VStack, StackDivider, Button, Text, Input } from "@chakra-ui/react";

const STAKER_ABI = require("../assets/staker-abi.json");
const VFACTORY_ABI = require("../assets/vf-abi.json");
const API_KEY = process.env.REACT_APP_API_KEY;
const STAKER_ADDRESS = process.env.REACT_APP_STAKER_ADDRESS;
const FACTORY_ADDRESS = process.env.REACT_APP_FACTORY_ADDRESS;

export default function VaultFactory(props: any) {
  const web3 = props.web3;
  const account = props.account;

  var factoryContract = new web3.eth.Contract(VFACTORY_ABI, FACTORY_ADDRESS);
  var stakerContract = new web3.eth.Contract(STAKER_ABI, STAKER_ADDRESS);
  // const [result, setResult] = useState<any>();
  const [name, setName] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [valid, setValid] = useState<any>(false);
  const [loading, setLoading] = useState<any>(false);

  var isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    async function isValidAddress() {
      return (await web3.utils.isAddress(token)) === true;
    }
    isValidAddress()
      .then((res: any) => {
        if (isMounted.current) {
          setValid(res);
          // console.log(res);
        }
      })
      .catch((e: any) => {
        console.log(e);
      });

    return () => {
      // executed when unmount
      isMounted.current = false;
    };
  }, [token, web3]);

  async function checkStake() {
    const stake = await stakerContract.methods
      .getUserStake(account, API_KEY)
      .call()
      .then((res: any) => {
        // console.log(res);
        return res;
      })
      .catch((e: any) => {
        console.log(e);
      });

    return stake;
  }

  async function createVault() {
    setLoading(true);
    const staked = await checkStake();
    // console.log(staked?.amount);
    if (staked?.amount > 0) {
      const weiValue = web3.utils.toWei("0.005", "ether");
      // console.log(weiValue);
      let tx = await factoryContract.methods
        .createVault(token, API_KEY, name)
        .send({
          from: account,
          value: weiValue,
          // gas: "15000000",
          // gasLimit: "8000000000",
        });

      /**
       * tx.hash is transaction id that we can use to create etherscan link
       */
      if (tx?.transactionHash) {
        // console.log(tx.transactionHash);
        // console.log(tx);
        console.log(
          "Vault address",
          tx.events.VaultDeployed.returnValues.vaultAddress
        );
        // setResult(
        //   tx.transactionHash
        // );
        // console.log(result);
        props.updateBalance();
      }
    } else {
      alert("You have to have a Stake to create vault!");
    }

    setLoading(false);
  }

  return (
    <VStack w="100%" alignItems={"center"} align="stretch" spacing={"25px"}>
      <StackDivider h={"50px"} />

      <Text fontSize="md" ml={4}>
        Choose a name for your vault for reference
      </Text>

      <Input
        w={"80%"}
        border="1px"
        borderStyle="solid"
        borderColor="blue.300"
        style={{ textAlign: "center" }}
        placeholder={"Vault Name"}
        value={name}
        maxW={"3xl"}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <Input
        w={"80%"}
        border="1px"
        borderStyle="solid"
        borderColor="blue.300"
        style={{ textAlign: "center" }}
        placeholder={"ERC20 Token Address"}
        value={token}
        maxW={"3xl"}
        onChange={(e) => {
          setToken(e.target.value);
        }}
      />

      <StackDivider h={"136px"} />
      <Button
        h={"40px"}
        minW={"100%"}
        border="1px"
        borderStyle="solid"
        borderColor="gray.400"
        isLoading={loading}
        loadingText="Loading..."
        onClick={createVault}
        disabled={!valid || name.length === 0}
      >
        Create Vault
      </Button>
    </VStack>
  );
}
