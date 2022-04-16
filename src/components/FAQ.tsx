import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useWindowDimensions from "../hooks/useWindowDimensions";
import {
  Box,
  Flex,
  Text,
  Center,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorMode,
} from "@chakra-ui/react";
const ITEMS = require("../assets/faq.json");

const useScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location]);
};

export default function FAQ() {
  useScrollToTop();
  const { colorMode } = useColorMode();
  const { height, width } = useWindowDimensions();

  return (
    <Flex
      direction={"column"}
      align="center"
      justify="center"
      mt="80px"
      minH="90vh"
      justifyItems={"center"}
      justifyContent={"center"}
      padding="25px"
    >
      <Center w={"222px"} m={2}>
        {/* <Text fontSize="lg">{"FAQ"}</Text> */}
        <Heading fontSize="xl">FAQ</Heading>
      </Center>
      <Accordion
        allowToggle
        w="80%"
        minH={height / 2}
        minW={width > 600 ? "80%" : "95%"}
        border="1px"
        borderStyle="solid"
        borderColor="gray.600"
        borderRadius="3xl"
        alignSelf="center"
        justifyItems={"center"}
        justifyContent={"center"}
        p={6}
      >
        {ITEMS?.length &&
          ITEMS.map((item: any, index: number) => (
            <AccordionItem
              key={index}
              p={2}
              mb={2}
              border="0px"
              borderRadius="8px"
              bg={colorMode === "dark" ? "gray.700" : "gray.100"}
              _hover={{
                border: "1px",
                borderStyle: "solid",
                borderColor: "blue.400",
                backgroundColor: colorMode === "dark" ? "gray.600" : "blue.200",
              }}
            >
              <h2>
                <AccordionButton _expanded={{ bg: "gray.700", color: "white" }}>
                  <Box flex="1" textAlign="left">
                    {item.title}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel>
                <Text>{item.description.split("/")[0]}</Text>
                <Text>{item.description.split("/")[1]}</Text>
                <Text>{item.description.split("/")[2]}</Text>
              </AccordionPanel>
            </AccordionItem>
          ))}
      </Accordion>
    </Flex>
  );
}
