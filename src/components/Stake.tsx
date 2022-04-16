import { VStack, Text } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { formatEther } from "@ethersproject/units";
import Countdown from "react-countdown";

const STAKER_ABI = require("../assets/staker-abi.json");
const STAKER_ADDRESS = process.env.REACT_APP_STAKER_ADDRESS;
const API_KEY = process.env.REACT_APP_API_KEY;

export const Stake = (props: any) => {
  const web3 = props.web3;
  const account = props.account;

  const [stake, setStake] = useState<any>([]);

  var isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    var stakerContract = new web3.eth.Contract(STAKER_ABI, STAKER_ADDRESS);

    stakerContract.methods
      .getUserStake(account, API_KEY)
      .call()
      .then((res: any) => {
        if (isMounted.current) {
          // console.log(res);
          setStake(res);
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

  var expirationDate = new Date(stake?.expiration * 1000).toDateString();

  var amount = stake?.expiration * 1000 - new Date().getTime() || 0;

  return (
    <VStack w="100%" h="234px" spacing={"20px"} mt={"3px"}>
      <Text fontSize="lg" ml={4}>
        {stake?.amount &&
          "Stake: " + parseFloat(formatEther(stake?.amount)).toFixed(2)}
      </Text>
      <Text fontSize="lg" ml={4}>
        Duration: {stake?.duration} Days
      </Text>

      <Text fontSize="lg" ml={4}>
        Maturity: {expirationDate}
      </Text>

      <Text fontSize="lg" ml={4}>
        Remaining:{" "}
        <Countdown
          date={Date.now() + amount}
          //   date={Date.now() + (stake?.expiration * 1000 - new Date().getTime())}
        />
      </Text>
      <Text fontSize="lg" ml={4}>
        APR: {stake?.rate}%
      </Text>
    </VStack>
  );
};
