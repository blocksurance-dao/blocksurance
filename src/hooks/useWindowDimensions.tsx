import { useState, useEffect } from "react";

export default function useWindowDimensions() {
  const hasWindow = typeof window !== "undefined";
  const width = hasWindow ? window.innerWidth : 0;
  const height = hasWindow ? window.innerHeight : 0;

  const [windowDimensions, setWindowDimensions] = useState({ width, height });

  useEffect(() => {
    function getWindowDimensions() {
      const width = hasWindow ? window.innerWidth : 0;
      const height = hasWindow ? window.innerHeight : 0;
      return {
        width,
        height,
      };
    }

    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    if (hasWindow) {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [hasWindow]);

  return windowDimensions;
}
