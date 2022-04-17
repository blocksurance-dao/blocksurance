import {
  Box,
  Flex,
  chakra,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  // StatHelpText,
  // StatGroup,
  // StatArrow,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/react";

interface StatsCardProps {
  title: string;
  stat: string;
}

function StatsCard(props: StatsCardProps) {
  const { title, stat } = props;
  const { colorMode } = useColorMode();
  return (
    <Stat
      px={{ base: 4, md: 8 }}
      py={"5"}
      //shadow={"xl"}
      // border={"1px solid"}
      borderColor={useColorModeValue("gray.800", "gray.500")}
      rounded={"lg"}
      _hover={{ bg: colorMode === "dark" ? "gray.800" : "gray.200" }}
      bgGradient={
        colorMode === "dark"
          ? "linear(to-t, gray.900, gray.700)"
          : "linear(to-t, white, gray.100)"
      }
    >
      <StatLabel
        fontWeight={"lg"}
        fontSize={"xl"}
        textColor={"gray.500"}
        isTruncated
      >
        {title}
      </StatLabel>
      <StatNumber fontSize={"2xl"} fontWeight={"medium"}>
        {stat}
      </StatNumber>
    </Stat>
  );
}

export default function About() {
  return (
    <Flex align="center" justify="center" padding="25px" minH="90vh">
      <Box
        mt={"80px"}
        minH="400px"
        alignSelf="center"
        border="1px"
        borderStyle="solid"
        borderColor="gray.600"
        borderRadius="3xl"
        pb={"60px"}
        // bgGradient="linear(to-t, purple.900, gray.700)"
      >
        <Box maxW="7xl" mx={"auto"} p={5} px={{ base: 2, sm: 12, md: 17 }}>
          <chakra.h1
            textAlign={"center"}
            fontSize={"4xl"}
            py={10}
            fontWeight={"bold"}
          >
            Want to insure your ERC20 tokens?
          </chakra.h1>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
            <StatsCard title={"Step one"} stat={"Stake 4SURE coin"} />
            <StatsCard title={"Step two"} stat={"Create your vault"} />
            <StatsCard title={"Step three"} stat={"Deposit tokens to vault"} />
          </SimpleGrid>
          {/* <Box maxW="7xl" mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
          <StatGroup>
            <Stat>
              <StatLabel>Sent</StatLabel>
              <StatNumber>345,670</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                23.36%
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Clicked</StatLabel>
              <StatNumber>45</StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />
                9.05%
              </StatHelpText>
            </Stat>
          </StatGroup>
        </Box>*/}
        </Box>
      </Box>
    </Flex>
  );
}
