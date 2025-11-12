import { createContext } from "react";

const LogoContext = createContext({
  logo: null,
  setLogo: () => {},
  resetLogo: () => {},
});

export default LogoContext;