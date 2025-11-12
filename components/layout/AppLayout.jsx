// components/layout/AppLayout.jsx
import Header from '../Header';
import Message from '../common/Message';
import LogoContext from '../context/LogoContext';
import TitleContext from '../context/TitleContext';
import PhoneNumberContext from '../context/PhoneNumberContext';
import BlogContext from '../context/BlogContext';

import { useState } from 'react';
import Footer from '../Footer';
import LocationContext from '../context/LocationContext';

export default function AppLayout({ children }) {    

  const [title, setTitle] = useState('BZIndia - Find the top companies in India');

  const [blogs, setBlogs] = useState([]);
  const [placeLocation, setLocation] = useState(null);

  const [logo, setLogo] = useState('/images/logo.svg');

  const defaultPhoneNumber = '9606377677 - 9606277677';

  const [phoneNumber, setPhoneNumber] = useState(defaultPhoneNumber);


  const resetLogo = () => setLogo('/images/logo.svg');

  const resetTitle = () =>
    setTitle('BZIndia - Find the top companies in India');
  const resetPhoneNumber = () => setPhoneNumber(defaultPhoneNumber);


  const resetBlogs = () => {
    setBlogs([]);
  };

  const resetLocation = () => {
    setLocation(null);
  };

  return (
    <TitleContext.Provider value={{ title, setTitle, resetTitle }}>
      <PhoneNumberContext.Provider value={{ phoneNumber, setPhoneNumber, resetPhoneNumber }}>
        <LogoContext.Provider value={{ logo, setLogo, resetLogo }}>
          <BlogContext.Provider value={{ blogs, setBlogs, resetBlogs }}>
            <LocationContext.Provider value={{ placeLocation, setLocation, resetLocation }} >
              <Header />
              <Message />
              <main>{children}</main>
              <Footer/>
            </LocationContext.Provider>
          </BlogContext.Provider>
        </LogoContext.Provider>
      </PhoneNumberContext.Provider>
    </TitleContext.Provider>
  );
}
