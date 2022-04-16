import {
  Button,
  Link,
  VStack,
  StackDivider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Input,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { useColorMode } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { formatEther } from "@ethersproject/units";
const API_KEY = process.env.REACT_APP_API_KEY;

type VendorModalProps = {
  isOpen: any;
  onClose: any;
  web3: any;
  account: any;
  network: any;
  vendorContract: any;
  updateBalance: any;
};

const VendorModal = ({
  isOpen,
  onClose,
  web3,
  account,
  network,
  vendorContract,
  updateBalance,
}: VendorModalProps) => {
  const { colorMode } = useColorMode();

  const [tlink, setTLink] = useState<any>("");
  const [amount, setAmount] = useState<any>("");
  const [loading, setLoading] = useState<any>(false);

  const [price, setPrice] = useState<any>(70000);
  const [minimum, setMinimum] = useState<any>(20000);
  var isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    vendorContract.methods
      .tokensPerEth()
      .call()
      .then((res: any) => {
        if (isMounted.current) {
          // console.log(res);
          setPrice(res);
        }
      })
      .catch((e: any) => {
        console.log(e);
      });

    vendorContract.methods
      .getMinBuy()
      .call()
      .then((res: any) => {
        if (isMounted.current) {
          // console.log(res);
          setMinimum(res);
        }
      })
      .catch((e: any) => {
        console.log(e);
      });

    return () => {
      // executed when unmount
      isMounted.current = false;
    };
  }, [vendorContract]);

  async function buyTokens() {
    setLoading(true);
    if (amount) {
      const value = ((1 / price) * amount).toFixed(10);
      const weiValue = web3.utils.toWei(value.toString(), "ether");
      // console.log(weiValue);
      let tx = await vendorContract.methods.buyTokens(API_KEY).send({
        from: account,
        value: weiValue,
      });

      /**
       * tx.hash is transaction id that we can use to create etherscan link
       */
      if (tx?.transactionHash) {
        console.log("Transaction:", tx.transactionHash);
        // console.log(network);

        setTLink(tx.transactionHash);
        updateBalance();
      }
    }
    setLoading(false);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent
        border="1px"
        borderStyle="solid"
        borderColor="gray.700"
        borderRadius="3xl"
      >
        <ModalHeader px={4} fontSize="lg" fontWeight="medium">
          Buy tokens
        </ModalHeader>
        <ModalCloseButton
          fontSize="sm"
          _hover={{
            color: "whiteAlpha.700",
          }}
        />
        <ModalBody pt={0} px={4}>
          <StackDivider h={"50px"} />
          <VStack
            w="100%"
            h="100%"
            minW="300px"
            spacing={"20px"}
            borderRadius="3xl"
            border="1px"
            borderStyle="solid"
            borderColor="gray.600"
            p={5}
          >
            <Text fontSize="md" fontWeight="medium">
              Minimum buy: {formatEther(minimum)} tokens
            </Text>
            <Input
              w={"100%"}
              border="1px"
              borderStyle="solid"
              borderColor="blue.300"
              borderRadius="xl"
              style={{ textAlign: "center" }}
              placeholder={"Amount in tokens"}
              value={amount}
              maxW={"3xl"}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            />
            {amount ? (
              <Text fontSize="md" fontWeight="medium">
                Price: {((1 / price) * amount).toFixed(7)} ETH
              </Text>
            ) : (
              <Text fontSize="md" fontWeight="medium">
                Price: {((1 / price) * 1).toFixed(7)} ETH
              </Text>
            )}
            {/* {parseFloat(formatEther((1 / price) * 1)).toFixed(7)} */}
            <Button
              onClick={buyTokens}
              bg={colorMode === "dark" ? "gray.800" : "gray.400"}
              w="100%"
              _hover={{
                border: "1px",
                borderStyle: "solid",
                borderColor: "blue.400",
                backgroundColor: colorMode === "dark" ? "cyan.800" : "gray.400",
              }}
              borderRadius="xl"
              m="2px"
              height="38px"
              disabled={
                amount.length < 1 ||
                parseInt(amount) < parseInt(formatEther(minimum))
              }
              isLoading={loading}
            >
              <Text fontSize="md" fontWeight="medium">
                BUY
              </Text>
            </Button>
          </VStack>
          <StackDivider h={"50px"} />
        </ModalBody>

        <ModalFooter
          justifyContent="center"
          //background="gray.700"
          borderBottomLeftRadius="3xl"
          borderBottomRightRadius="3xl"
          p={6}
          minW="200px"
        >
          {tlink && (
            <Link
              fontSize="sm"
              display="flex"
              alignItems="center"
              href={`https://${network}.etherscan.io/address/${tlink}`}
              isExternal
              color="gray.400"
              ml={6}
              _hover={{
                color: "whiteAlpha.800",
                textDecoration: "underline",
              }}
            >
              Confirmed: <ExternalLinkIcon m={2} w={5} h={5} color="blue.400" />
            </Link>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default VendorModal;
