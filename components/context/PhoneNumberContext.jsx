import { createContext } from "react";

const PhoneNumberContext = createContext({
  phoneNumber: null,
  setPhoneNumber: () => {},
  resetPhoneNumber: () => {},
});

export default PhoneNumberContext;