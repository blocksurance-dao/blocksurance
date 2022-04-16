import { Button, Box, Text } from "@chakra-ui/react";
import { formatEther } from "@ethersproject/units";
import { useColorMode } from "@chakra-ui/react";
import Identicon from "./Identicon";

type ConnectButtonProps = {
  handleOpenModal: any;
  onConnect: Function;
  account: any;
  balance: any;
};

const ConnectButton = ({
  handleOpenModal,
  onConnect,
  account,
  balance,
}: ConnectButtonProps) => {
  const { colorMode } = useColorMode();
  const handleConnectWallet = async () => {
    onConnect();
  };

  if (!account?.length) {
    return (
      <Button
        h={"40px"}
        border={colorMode === "dark" ? "0px" : "1px"}
        borderRadius="xl"
        borderStyle="solid"
        borderColor="gray.400"
        onClick={handleConnectWallet}
      >
        Connect wallet
      </Button>
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      // background="gray.700"
      // border="1px solid transparent"
      borderRadius="xl"
      h={"42px"}
      // borderColor={colorMode === "dark" ? "gray.800" : "gray.300"}
      bg={colorMode === "dark" ? "gray.700" : "gray.300"}
    >
      <Box px="3">
        <Text fontSize="md">
          {balance && parseFloat(formatEther(balance)).toFixed(3)} ETH
        </Text>
      </Box>
      <Button
        onClick={handleOpenModal}
        bg={colorMode === "dark" ? "gray.800" : "white"}
        // borderColor="gray.300"
        // border="1px"
        _hover={{
          border: "1px",
          borderStyle: "solid",
          borderColor: "blue.400",
          backgroundColor: colorMode === "dark" ? "gray.700" : "gray.400",
        }}
        borderRadius="xl"
        m="2px"
        px={3}
        height="38px"
      >
        <Text fontSize="md" fontWeight="medium" mr="2">
          {account &&
            `${account.slice(0, 6)}...${account.slice(
              account.length - 4,
              account.length
            )}`}
        </Text>
        {account && <Identicon account={account} />}
      </Button>
    </Box>
  );
};

export default ConnectButton;
