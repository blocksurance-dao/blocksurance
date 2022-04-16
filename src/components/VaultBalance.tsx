import { useState, useEffect, useRef } from "react";
import { formatEther } from "@ethersproject/units";
import { Text } from "@chakra-ui/react";
const ERC20_ABI = require("../assets/erc20-abi.json");

export default function VaultBalance(props: any) {
  const web3 = props.web3;
  const [balance, setBalance] = useState<any>();
  var coinContract = new web3.eth.Contract(ERC20_ABI, props.item?.tokenAddress);

  var isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    coinContract.methods
      .balanceOf(props.item?.vaultAddress)
      .call()
      .then((res: any) => {
        if (isMounted.current) {
          setBalance(parseFloat(formatEther(res)).toFixed(3));
        }
      })
      .catch((e: any) => {
        console.log(e);
      });
    return () => {
      // executed when unmount
      isMounted.current = false;
    };
  }, [props.item]);

  return (
    <Text fontSize="lg" ml={4}>
      {balance}
    </Text>
  );
}
