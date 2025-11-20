import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { useContext } from 'react';

import LogoContext from './context/LogoContext';
import TitleContext from './context/TitleContext';
import PhoneNumberContext from './context/PhoneNumberContext';

import MultipageEducation from './education/MultipageEducation';
import MultipageRegistration from './registration/MultipageRegistration';
import location from '../lib/api/location';
import MultipageProduct from './product/MultipageProduct';
import MultipageService from './service/MultipageService';
import AutoPopUp from './common/AutoPopUp';
import Message from './common/Message';
import { usePathname } from 'next/navigation';

const CompanyMultipage = ({slug, currentCompany, replacedMultipage}) => {    
    const pathname = usePathname();
    
    const [state, setState] = useState(null);
    const [district, setDistrict] = useState(null);
    const [place, setPlace] = useState(null);

    const { setLogo, resetLogo } = useContext(LogoContext)
    const { setTitle, resetTitle } = useContext(TitleContext)
    const { setPhoneNumber, resetPhoneNumber } = useContext(PhoneNumberContext);

    const [isIndianData, setIsIndianData] = useState(false);

    const [message, setMessage] = useState();
    const [messageClass, setMessageClass] = useState();
    
    // const { setBlogs, resetBlogs } = useContext(BlogContext);

    const router = useRouter();
    const { multipageParams } = router.query;
  
    let stateSlug, districtSlug, placeSlug;

    if (multipageParams.length == 5) {
      stateSlug = multipageParams?.[2]
      districtSlug = multipageParams?.[3]
      placeSlug = multipageParams?.[4]
    } else if (multipageParams.length == 4) {
      stateSlug = multipageParams?.[2]
      districtSlug = multipageParams?.[3]
    } else if (multipageParams.length == 3) {
      stateSlug = multipageParams?.[2]
    }

    useEffect(() => {
      if (replacedMultipage?.url_type === "location_filtered" && !(placeSlug || districtSlug || stateSlug)) {
        setIsIndianData(true);
      }
  
    }, [placeSlug, stateSlug, districtSlug, replacedMultipage?.url_type])

    useEffect(() => {
      if (!multipageParams?.[1]) return;

      if (!place && !district && !state) {
        const passingSlug = multipageParams?.[1]

        const fetchLocation = async () => {
          try {
            const response = await location.getUrlLocation(undefined, passingSlug);
            const locationData = response.data;
            const matchType = locationData?.match_type;

            if (matchType === "place") {
              setPlace(locationData.data);
            } else if (matchType === "district") {
              setDistrict(locationData.data);
            } else if (matchType === "state") {
              setState(locationData.data);
            }

          } catch (err) {
            console.error(err);
          }
        }

        fetchLocation();
      }
    }, [
      place, district, state, multipageParams?.[1],
    ]);
  
    useEffect(() => {
      if (!stateSlug) {
        setState(null);
        return;
      }
  
      const fetchState = async () => {
        try {
          const response = await location.getState(stateSlug);
          setState({
            "name": response.data?.name,
            "slug": response.data?.slug
          });
        } catch (err) {
          console.error(err);
        }
      }
  
      fetchState();
  
    }, [stateSlug]);
  
    useEffect(() => {
      if (!districtSlug) {
        setDistrict(null);
        return;
      }
      
      const fetchDistrict = async () => {
        try {
          const response = await location.getDistrict(districtSlug);
          setDistrict({
            "name": response.data?.name,
            "slug": response.data?.slug
          });
        } catch (err) {
          console.error(err);
        }
      }
  
      fetchDistrict();
  
    }, [districtSlug]);
  
    useEffect(() => {
      if (!placeSlug) {
        setPlace(null);
        return;
      }
      
      const fetchPlace = async () => {
        try {
          const response = await location.getPlace(placeSlug);
          setPlace({
            "name": response.data?.name,
            "slug": response.data?.slug
          });
        } catch (err) {
          console.error(err);
        }
      }
  
      fetchPlace();
  
    }, [placeSlug]);

    useEffect(() => {
      if (currentCompany) {
        const { logo_url, meta_title, phone1, phone2 } = currentCompany;
    
        if (logo_url) setLogo(logo_url);
        if (meta_title && replacedMultipage) setTitle(replacedMultipage?.meta_title);
    
        const phones = [phone1, phone2].filter(Boolean).join(' - ');
        if (phones) setPhoneNumber(phones);

      }
    
      return () => {
        resetLogo();
        resetTitle();
        resetPhoneNumber();
      };
    }, [currentCompany]); 

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
                setMessageClass("");
            }, 5000);
    
            return () => clearTimeout(timer);
        }
    }, [message]);    

  return (
    <>
      {message&&
        <Message message={message} messageClass={messageClass} />
      }      
      <AutoPopUp currentCompany={currentCompany} setMessage={setMessage} setMessageClass={setMessageClass}/>
      {(slug && replacedMultipage && currentCompany) &&
        <>
        {(currentCompany?.company_type == "Education")? 
        <MultipageEducation 
          slug={slug}          
          currentCompany={currentCompany}            
          replacedMultipage={replacedMultipage}
          state={state}
          district={district}
          place={place}
          isIndianData={isIndianData}        
          pathname={pathname}
          setMessage={setMessage}
          setMessageClass={setMessageClass}
          />
        : (currentCompany?.company_type == "Registration")? 
          <MultipageRegistration 
          slug={slug}          
          currentCompany={currentCompany}            
          replacedMultipage={replacedMultipage}
          state={state}
          district={district}
          place={place}
          isIndianData={isIndianData}          
          pathname={pathname}
          setMessage={setMessage}
          setMessageClass={setMessageClass}
          />
        : (currentCompany?.company_type == "Product")? 
          <MultipageProduct
          slug={slug}          
          currentCompany={currentCompany}            
          replacedMultipage={replacedMultipage}
          state={state}
          district={district}
          place={place}
          isIndianData={isIndianData}          
          pathname={pathname}
          setMessage={setMessage}
          setMessageClass={setMessageClass}
          />
        : (currentCompany?.company_type == "Service")? 
          <MultipageService
          slug={slug}          
          currentCompany={currentCompany}            
          replacedMultipage={replacedMultipage}
          state={state}
          district={district}
          place={place}
          isIndianData={isIndianData}          
          pathname={pathname}
          setMessage={setMessage}
          setMessageClass={setMessageClass}
          />
        : null}
        </>
      }      
    </>
  )
}

export default CompanyMultipage