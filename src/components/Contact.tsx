import { useEffect } from "react";
import {
  Flex,
  Box,
  Link,
  Heading,
  IconButton,
  VStack,
  HStack,
  Text,
  Image,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useLocation } from "react-router-dom";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { FaGithub, FaTelegram, FaDiscord } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import snapshot from "../assets/images/snapshot.png";

const useScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location]);
};

export default function About() {
  useScrollToTop();
  const { colorMode } = useColorMode();
  const { height, width } = useWindowDimensions();
  return (
    <Flex align="center" justify="center" padding="5px" minH="90vh">
      <Box
        mt={"80px"}
        minW={width > 600 ? "80%" : "95%"}
        minH="70vh"
        alignSelf="center"
        border="1px"
        borderStyle="solid"
        borderColor="gray.600"
        borderRadius="3xl"
        padding={width > 600 ? "50px" : "20px"}
      >
        <Box
          minH={height / 2}
          minW={width > 600 ? "80%" : "95%"}
          border={width > 450 ? "1px" : 0}
          borderStyle="solid"
          borderColor="gray.600"
          borderRadius="3xl"
          padding="50px"
        >
          <VStack
            p={20}
            spacing="45px"
            px={{ base: 10, md: 20, lg: 30 }}
            py={"5"}
            mt={10}
            shadow={"xl"}
            // border={"1px solid"}
            borderColor={useColorModeValue("gray.800", "gray.500")}
            rounded={"lg"}
            bgGradient={
              colorMode === "dark"
                ? "linear(to-t, gray.900, gray.700)"
                : "linear(to-t, white, gray.100)"
            }
          >
            <Heading>Contact</Heading>
            <HStack mt={{ lg: 10, md: 10 }} alignItems="flex-start">
              <IconButton
                aria-label="email"
                variant="ghost"
                size="lg"
                isRound={true}
                _hover={{ bg: colorMode === "dark" ? "gray.700" : "gray.300" }}
                icon={<MdEmail size="20px" />}
              />
              <Text fontSize="lg" pt={"10px"}>
                support@blocksurance.io
              </Text>
            </HStack>
            <Link
              href={
                "https://etherscan.io/address/0x88888883D7434785e02AC8475B9c9E7b1d3Dd293"
              }
              isExternal
            >
              BLOCKSURANCE (4SURE){" "}
              <ExternalLinkIcon mx="4px" w={5} h={5} color="blue.400" />
            </Link>
            <HStack
              mt={{ lg: 10, md: 10 }}
              spacing={5}
              px={5}
              alignItems="flex-start"
            >
              <Link href={"https://t.me/blocksurance"} isExternal>
                <IconButton
                  aria-label="facebook"
                  variant="ghost"
                  size="lg"
                  isRound={true}
                  _hover={{
                    bg: colorMode === "dark" ? "gray.700" : "gray.300",
                  }}
                  icon={<FaTelegram size="28px" />}
                />
              </Link>

              <Link
                href={"https://github.com/blocksurance-dao/blocksurance"}
                isExternal
              >
                <IconButton
                  aria-label="github"
                  variant="ghost"
                  size="lg"
                  isRound={true}
                  _hover={{
                    bg: colorMode === "dark" ? "gray.700" : "gray.300",
                  }}
                  icon={<FaGithub size="28px" />}
                />
              </Link>
              <Link href={"https://discord.gg/XpA8nFGJfZ"} isExternal>
                <IconButton
                  aria-label="discord"
                  variant="ghost"
                  size="lg"
                  isRound={true}
                  _hover={{
                    bg: colorMode === "dark" ? "gray.700" : "gray.300",
                  }}
                  icon={<FaDiscord size="28px" />}
                />
              </Link>

              <Link
                href={"https://snapshot.org/#/0xswinger.eth/about"}
                isExternal
              >
                <IconButton
                  aria-label="snapshot"
                  variant="ghost"
                  size="lg"
                  isRound={true}
                  _hover={{
                    bg: colorMode === "dark" ? "gray.700" : "gray.300",
                  }}
                  icon={
                    <Image
                      borderRadius="full"
                      boxSize="27px"
                      src={snapshot}
                      alt=""
                    />
                  }
                />
              </Link>
            </HStack>
          </VStack>
        </Box>
      </Box>
    </Flex>
  );
}
