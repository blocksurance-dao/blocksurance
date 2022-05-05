import {
  Box,
  Button,
  Flex,
  Link,
  Text,
  StackDivider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { ExternalLinkIcon, CopyIcon } from "@chakra-ui/icons";
import { useState } from "react";
import Identicon from "./Identicon";
// import { apiGetAccountTransactions } from "../helpers/api";

type AccountModalProps = {
  isOpen: any;
  onClose: any;
  disconnect: Function;
  account: any;
  network: string;
  provider: any;
};

const AccountModal = ({
  isOpen,
  onClose,
  disconnect,
  account,
  network,
  provider,
}: AccountModalProps) => {
  // console.log(provider);
  const [copied, setCopied] = useState<any>(false);
  function handleDeactivateAccount() {
    disconnect();
    onClose();
  }

  // const getAccounTransactions = async (address: string, chainId: any) => {
  //   try {
  //     const transactions = await apiGetAccountTransactions(address, chainId);
  //     return transactions;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent
        //background="gray.900"
        border="1px"
        borderStyle="solid"
        borderColor="gray.700"
        borderRadius="3xl"
      >
        <ModalHeader px={4} fontSize="lg" fontWeight="medium">
          Account
        </ModalHeader>
        <ModalCloseButton
          //color="white"
          fontSize="sm"
          _hover={{
            color: "whiteAlpha.700",
          }}
        />
        <ModalBody pt={0} px={4}>
          <StackDivider h={"50px"} />
          <Box
            borderRadius="3xl"
            border="1px"
            borderStyle="solid"
            borderColor="gray.600"
            px={5}
            pt={4}
            pb={2}
            mb={3}
          >
            <Flex justifyContent="space-between" alignItems="center" mb={6}>
              <Text color="gray.400" fontSize="sm">
                {provider ? "Connected with MetaMask" : "Connected to wallet"}
              </Text>
              <Button
                variant="outline"
                size="sm"
                borderColor="blue.800"
                borderRadius="3xl"
                color="blue.500"
                fontSize="13px"
                fontWeight="normal"
                px={2}
                height="26px"
                _hover={{
                  background: "none",
                  borderColor: "blue.300",
                  textDecoration: "underline",
                }}
                // Add our deactivate account handler onClick
                onClick={handleDeactivateAccount}
              >
                Logout
              </Button>
            </Flex>
            <Flex alignItems="center" mt={2} mb={6} lineHeight={1}>
              <Identicon account={account} />
              <Text
                //color="white"
                fontSize="xl"
                fontWeight="semibold"
                ml="2"
                lineHeight="1.1"
              >
                {account &&
                  `${account.slice(0, 6)}...${account.slice(
                    account.length - 4,
                    account.length
                  )}`}
              </Text>
            </Flex>
            <Flex alignContent="center" mb={6}>
              <Button
                variant="link"
                color="gray.400"
                fontWeight="normal"
                fontSize="sm"
                _hover={{
                  textDecoration: "none",
                  color: "blue.300",
                }}
                onClick={() => {
                  setCopied(!copied);
                  navigator.clipboard.writeText(account);
                }}
              >
                <CopyIcon mr={1} color={copied ? "blue.300" : "white"} />
                {copied ? "Copied Address" : "Copy Address"}
              </Button>
              <Link
                fontSize="sm"
                display="flex"
                alignItems="center"
                href={`https://etherscan.io/address/${account}`}
                isExternal
                color="gray.400"
                ml={6}
                _hover={{
                  color: "whiteAlpha.800",
                  textDecoration: "underline",
                }}
              >
                <ExternalLinkIcon mr={1} />
                View on Explorer
              </Link>
            </Flex>
          </Box>
          <StackDivider h={"50px"} />
        </ModalBody>

        <ModalFooter
          justifyContent="end"
          //background="gray.700"
          borderBottomLeftRadius="3xl"
          borderBottomRightRadius="3xl"
          p={6}
        >
          {/* <Text
            //color="white"
            textAlign="left"
            fontWeight="medium"
            fontSize="md"
          >
            Your transactions willl appear here...
          </Text> */}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AccountModal;
