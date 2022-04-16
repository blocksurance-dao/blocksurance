import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

//const fonts = { mono: `'Menlo', monospace` }

const breakpoints = createBreakpoints({
  sm: "40em",
  md: "52em",
  lg: "64em",
  xl: "80em",
});

export const theme = extendTheme({
  config: {
    initialColorMode: "dark",
  },
  colors: {
    black: "#16161D",
  },
  fonts: {
    heading: "Inter, sans-serif",
    body: "Inter, sans-serif",
  },
  breakpoints,
  components: {
    Stack: {
      baseStyle: {
        align: "stretch",
      },
    },
  },
  Button: {
    defaultProps: {
      colorScheme: "cyan",
    },
    // 1. We can update the base styles
    baseStyle: {
      fontWeight: "bold", // Normally, it is "semibold"
    },
    // 2. We can add a new button size or extend existing
    sizes: {
      xl: {
        h: "56px",
        fontSize: "lg",
        px: "32px",
      },
    },
    // 3. We can add a new visual variant
    variants: {
      "with-shadow": {
        bg: "#75E6DA",
        boxShadow: "0 0 2px 2px #efdfde",
      },
      // 4. We can override existing variants
      solid: (props: { colorMode: string }) => ({
        bg: props.colorMode === "dark" ? "#75E6DA.500" : "#75E6DA",
      }),
    },
  },
});
