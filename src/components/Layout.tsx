import { ReactNode } from "react";
import { Flex } from "@chakra-ui/react";

type LayoutProps = {
  children?: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => (
  <Flex
    flexDirection="column"
    alignItems="space-between"
    justifyContent="center"
    h="100%"
    //top="0"
    //left="0"
    w="100%"
    //minW={"400px"}
  >
    {children}
  </Flex>
);
