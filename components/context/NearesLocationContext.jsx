import { createContext } from "react"

const NearestLocationContext = createContext({
  nearestLocation: null,
  setNearestLocation: () => {},
  resetNearestLocation: () => {},
})

export default NearestLocationContext