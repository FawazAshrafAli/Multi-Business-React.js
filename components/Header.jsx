import React, { useEffect, useState } from 'react'
import { useContext } from 'react';

import AOS from 'aos';
import 'aos/dist/aos.css';

import Navbar from './Navbar'
import TitleContext from './context/TitleContext';
import PhoneNumberContext from './context/PhoneNumberContext';

import location from '../lib/api/location';
import { useRouter } from 'next/router';

const Header = () => {
  const router = useRouter();

  const {slug} = router.query;

  const {title} = useContext(TitleContext);
  const {phoneNumber} = useContext(PhoneNumberContext);

  const [states, setStates] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quoteFormVisibility, setQuoteFormVisibility] = useState(false);

  // States
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await location.getStates();
        setStates(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
      
  }, []);

  
  const handleQuoteFormVisibility = (e) => {
    e.preventDefault();

    setQuoteFormVisibility(!quoteFormVisibility)

  }

  useEffect(() => {
    AOS.init({
      once: true,
    });
  }, []);

  return (
    <>
<header className="inner-hom-banner-section" id="banner-top"  itemScope="itemScope" itemType="https://schema.org/WPHeader" data-aos="fade-in">
      
          <div className="cmpany-logo-top-section">
           <div className="cmpny-logo d-flex justify-content-center p-2">
              <h1 itemProp="headline">{title}</h1>
               <meta itemProp="name" content={title}/>
                <meta itemProp="description" content={title + ". Explore our curated business directory, focusing on one trusted company that delivers top-notch services and products nationwide."}/>
           </div>           
         </div>       
       
   
           
               <div className="main-wrapper">
                  <Navbar/>

         
       </div>
           
         
       </header>
    </>
  )
}

export default Header