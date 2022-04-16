import { ReactNode } from "react";
import {
  Box,
  chakra,
  Container,
  Link,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

import logo from "../assets/images/blocksurance.png";
import { Logo } from "./Logo";
import { useMatch, useResolvedPath } from "react-router-dom";
import { Link as Dlink } from "react-router-dom";

import type { LinkProps } from "react-router-dom";
const Links = ["Home", "About", "Contact"];
const URLS = ["/", "/about", "/contact"];

function NavLink({ to, children, ...props }: LinkProps) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (
    <div>
      <Dlink
        style={{ textDecoration: match ? "underline" : "none" }}
        to={to}
        {...props}
      >
        {children}
      </Dlink>
      {/* {match && " (active)"} */}
    </div>
  );
}

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <chakra.button
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      as={"a"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export const Footer = () => (
  <Box
    as="footer"
    role="contentinfo"
    //py={{ base: "12", md: "10" }}
    bg={useColorModeValue("gray.100", "gray.900")}
    color={useColorModeValue("gray.700", "gray.200")}
    px={4}
    position="sticky"
    //width="100%"
    //padding="20px"
    //position="fixed"
    // bottom={0}
    minW="400px"
  >
    <Container
      as={Stack}
      //maxW={'6xl'}
      py={4}
      mb={0}
      spacing={4}
      //justify={'center'}
      align={"center"}
    >
      <Stack direction={"row"} spacing={6}>
        <Logo
          //h="40vmin"
          pointerEvents="none"
          boxSize="40px"
          padding="5px"
          alignSelf="center"
          src={logo}
        />

        <NavLink to={URLS[1]}>{Links[1]}</NavLink>
        <Link href={"https://discord.com"}>Discord</Link>
        <Link href={"https://www.github.com"}>GitHub</Link>
        <NavLink to={URLS[2]}>{Links[2]}</NavLink>
      </Stack>
    </Container>

    <Box
      borderTopWidth={1}
      borderStyle={"solid"}
      borderColor={useColorModeValue("gray.200", "gray.700")}
    >
      <Container
        as={Stack}
        maxW={"6xl"}
        py={4}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
      >
        <Text>© 2021 BlockSurance DAO. All rights reserved</Text>
        <Stack direction={"row"} spacing={6}>
          <SocialButton label={"Twitter"} href={"https://tritter.com"}>
            <FaTwitter />
          </SocialButton>
          <SocialButton label={"YouTube"} href={"https://youtube.com"}>
            <FaYoutube />
          </SocialButton>
          <SocialButton label={"Instagram"} href={"https://instagram.com"}>
            <FaInstagram />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  </Box>
);
