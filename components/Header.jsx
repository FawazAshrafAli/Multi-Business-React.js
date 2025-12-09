import React from 'react'
import { useContext } from 'react';

import Navbar from './Navbar'
import TitleContext from './context/TitleContext';

const Header = () => {
  const {title} = useContext(TitleContext);

  return (
    <>
<header className="inner-hom-banner-section" id="banner-top"  itemScope="itemScope" itemType="https://schema.org/WPHeader">
      
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