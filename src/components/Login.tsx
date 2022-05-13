import { useState, useEffect, useRef } from "react";
import {
  VStack,
  StackDivider,
  Button,
  Text,
  Input,
  Image,
} from "@chakra-ui/react";
import BeatLoader from "react-spinners/BeatLoader";

import logo from "../assets/images/BlocksuranceWeb1.png";
const REGISTAR_ABI = require("../assets/registar-abi.json");
const REGISTAR_ADDRESS = process.env.REACT_APP_REGISTAR_ADDRESS;
const API_KEY = process.env.REACT_APP_API_KEY;

export default function Registar(props: any) {
  const web3 = props.web3;
  const account = props.account;

  const [refcode, setRefcode] = useState<string>("");
  const [pincode, setPincode] = useState<string>("");
  const [valid, setValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [validPin, setValidPin] = useState<boolean>(false);
  const [registered, setRegistered] = useState<boolean>(true);

  var registarContract = new web3.eth.Contract(REGISTAR_ABI, REGISTAR_ADDRESS);

  var isMounted = useRef(false);

  useEffect(() => {
    async function isValidAddress() {
      return (await web3.utils.isAddress(refcode)) === true;
    }
    setLoading(false);
    isMounted.current = true;
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
  }, [refcode, web3]);

  useEffect(() => {
    isMounted.current = true;
    var rContract = new web3.eth.Contract(REGISTAR_ABI, REGISTAR_ADDRESS);
    rContract.methods
      .get(account, API_KEY)
      .call({ from: account })
      .then(function (result: boolean) {
        // console.log(result);
        if (isMounted.current) {
          setRegistered(result);
        }
      });

    return () => {
      isMounted.current = false;
    };
  }, [account, web3]);

  function register() {
    setLoading(true);

    registarContract.methods
      .register(refcode, process.env.REACT_APP_API_KEY, parseInt(pincode))
      .send({
        from: account,
      })
      .then((res: any) => {
        console.log("Registered successfully!");
        props.regComplete();
      })
      .catch((e: any) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    isMounted.current = true;

    if (isMounted.current && pincode.length === 5) {
      setValidPin(true);
    } else if (isMounted.current && pincode.length !== 5) {
      setValidPin(false);
    }

    return () => {
      isMounted.current = false;
    };
  }, [pincode]);

  function validatePin() {
    setLoading(true);

    registarContract.methods
      .validatePin(parseInt(pincode), process.env.REACT_APP_API_KEY)
      .call({ from: account })
      .then((res: any) => {
        // console.log(res);
        if (res === true) {
          setTimeout(() => {
            props.regComplete();
          }, 1000);
        } else {
          alert("Invalid pin!");
        }
      })
      .catch((e: any) => {
        console.log(e);
      });

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  return (
    <VStack
      w="100%"
      alignItems={"center"}
      verticalAlign={"center"}
      spacing={"20px"}
      //divider={<StackDivider h={"50px"} />}
    >
      <Image src={logo} alt="" w={"300px"} />
      {!registered ? (
        <>
          <Text fontSize="xl">Welcome!</Text>
          <Text fontSize="md">Enter your invite code!</Text>
          <Input
            w={"80%"}
            border="1px"
            borderStyle="solid"
            borderColor="blue.300"
            style={{ textAlign: "center" }}
            placeholder={"Refferal code"}
            value={refcode}
            maxW={"3xl"}
            onChange={(e) => {
              setRefcode(e.target.value);
            }}
          />
        </>
      ) : (
        <Text fontSize="xl">Welcome back!</Text>
      )}
      <Input
        w={"80%"}
        border="1px"
        borderStyle="solid"
        borderColor="blue.300"
        style={{ textAlign: "center" }}
        placeholder={"Numeric pin code"}
        value={pincode}
        maxW={"3xl"}
        onChange={(e) => {
          setPincode(e.target.value);
        }}
      />
      {!registered ? (
        <>
          <Text fontSize="md">Choose a 5 digit pin code!</Text>
          <Text fontSize="lg" color={"blue.300"}>
            Write it down, it can not be reset!
          </Text>
        </>
      ) : (
        <>
          <Text fontSize="md">Enter your 5 digit pin code to login!</Text>
          <StackDivider h={"20px"} />
        </>
      )}

      <StackDivider h={"20px"} />
      {registered ? (
        <Button
          h={"40px"}
          minW={"80%"}
          border="1px"
          borderStyle="solid"
          borderColor="gray.400"
          isLoading={loading}
          spinner={<BeatLoader size={8} color="white" />}
          onClick={validatePin}
          disabled={!validPin}
        >
          Login
        </Button>
      ) : (
        <Button
          h={"40px"}
          minW={"80%"}
          border="1px"
          borderStyle="solid"
          borderColor="gray.400"
          isLoading={loading}
          spinner={<BeatLoader size={8} color="white" />}
          onClick={register}
          disabled={!valid || !validPin}
        >
          Register
        </Button>
      )}

      <StackDivider h={"20px"} />
    </VStack>
  );
}
