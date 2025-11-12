import { createContext } from "react";

const LocationContext = createContext({
  placeLocation: null,
  setLocation: () => {},
  resetLocation: () => {},
});

export default LocationContext;