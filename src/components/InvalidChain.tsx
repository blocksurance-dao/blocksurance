import { VStack, StackDivider, Flex, Text, Box, Image } from "@chakra-ui/react";
import logo from "../assets/images/BlocksuranceWeb1.png";
import useWindowDimensions from "../hooks/useWindowDimensions";

export default function Registar(props: any) {
  const { height, width } = useWindowDimensions();
  return (
    <Flex align="center" justify="center" padding="10px" minH="90vh">
      <Box
        mt={"80px"}
        minW={width > 600 ? "80%" : "95%"}
        minH="70vh"
        alignSelf="center"
        border={width > 450 ? "1px" : "0px"}
        borderStyle="solid"
        borderColor="gray.600"
        borderRadius="3xl"
        padding={width > 600 ? "50px" : "20px"}
      >
        <Box
          minH={height / 2}
          minW={width > 600 ? "80%" : "98%"}
          border="1px"
          borderStyle="solid"
          borderColor="gray.600"
          borderRadius="3xl"
        >
          <VStack
            w="100%"
            alignItems={"center"}
            verticalAlign={"center"}
            spacing={"20px"}
            //divider={<StackDivider h={"50px"} />}
          >
            <Image src={logo} alt="" w={"300px"} />

            <Text fontSize="xl">Select Ethereum mainnet to continue!</Text>

            <StackDivider h={"20px"} />
          </VStack>
        </Box>
      </Box>
    </Flex>
  );
}
