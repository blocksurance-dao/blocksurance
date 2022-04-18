import React, { FC } from "react";
import {
  Box,
  Flex,
  Center,
  HStack,
  Image,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuDivider,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  Stack,
  Link as CLink,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

import useWindowDimensions from "../hooks/useWindowDimensions";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import type { LinkProps } from "react-router-dom";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import logo from "../assets/images/blocksurance256.png";
import styled from "styled-components";

const NavbarWrapper = styled.div`
  position: relative;
  overflow: hidden;
  z-index: 200;
`;

const Links = ["About", "Contact", "FAQ"];
const URLS = ["/about", "/contact", "/faq"];

function NavLink({ to, children, ...props }: LinkProps) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <div>
      <Link
        style={{ textDecoration: match ? "underline" : "none" }}
        to={to}
        {...props}
      >
        {children}
      </Link>
      {/* {match && " (active)"} */}
    </div>
  );
}

const Navbar: FC<{
  ConnectComponent: any;
}> = (props) => {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const { width } = useWindowDimensions();

  return (
    <NavbarWrapper>
      <Box
        bg={useColorModeValue("gray.100", "gray.900")}
        px={4}
        position="fixed"
        width="100%"
        height="80px"
        top={0}
        z-index="200"
      >
        <Flex
          h={16}
          alignItems={"center"}
          justifyContent={"space-between"}
          mt={"10px"}
        >
          <HStack spacing={8} alignItems={"center"}>
            {width > 350 && (
              <NavLink to={"/"}>
                <Image src={logo} alt="" w={"46px"} h={"46px"} />
              </NavLink>
            )}
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link, index) => (
                <NavLink to={URLS[index]} key={link}>
                  {link}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Stack direction="row" spacing={5}>
              <props.ConnectComponent />
              {width > 650 && (
                <Button
                  // size="md"
                  height="40px"
                  width="40px"
                  onClick={toggleColorMode}
                  bg={colorMode === "light" ? "gray.200" : "#292B34"}
                >
                  {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                </Button>
              )}

              <Menu>
                <MenuButton
                  as={Button}
                  variant={"link"}
                  cursor={"pointer"}
                  aria-label={"Open Menu"}
                  display={{ md: "none", sm: "flex" }}
                  bg={useColorModeValue("gray.200", "#292B34")}
                  height="40px"
                  width="40px"
                >
                  <HamburgerIcon h={7} w={7} />
                </MenuButton>
                <Box>
                  <MenuList alignItems={"center"}>
                    <br />
                    <Center>
                      <Button
                        // size="md"
                        height="40px"
                        width="40px"
                        onClick={toggleColorMode}
                        bg={colorMode === "light" ? "gray.200" : "#292B34"}
                      >
                        {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                      </Button>
                    </Center>
                    <br />
                    <MenuDivider />
                    <Box p={3}>
                      <NavLink to={"/faq"}>{"FAQ"}</NavLink>
                    </Box>
                    <Box p={3}>
                      <NavLink to={"/about"}>{"About"}</NavLink>
                    </Box>
                    <Box p={3}>
                      <NavLink to={"/contact"}>{"Contact"}</NavLink>
                    </Box>
                    <Box p={3}>
                      <CLink
                        href={"https://snapshot.org/#/0xswinger.eth/about"}
                      >
                        DAO
                      </CLink>
                    </Box>
                    <Box p={3}>
                      <CLink
                        href={
                          "https://etherscan.io/address/0x88888883D7434785e02AC8475B9c9E7b1d3Dd293"
                        }
                        isExternal
                      >
                        Coin
                      </CLink>
                    </Box>
                  </MenuList>
                </Box>
              </Menu>
            </Stack>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link, index) => (
                <NavLink to={URLS[index]} key={link}>
                  {link}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </NavbarWrapper>
  );
};

export default Navbar;
