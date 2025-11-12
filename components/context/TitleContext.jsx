import { createContext } from "react";

const TitleContext = createContext({
  title: "null",
  setTitle: () => {},
  resetTitle: () => {},
});

export default TitleContext;
