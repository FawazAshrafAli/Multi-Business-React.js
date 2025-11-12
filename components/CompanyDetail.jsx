import React, { useEffect, useState } from 'react'
import { useContext } from 'react';

import LogoContext from './context/LogoContext';
import TitleContext from './context/TitleContext';
import PhoneNumberContext from './context/PhoneNumberContext';

import DetailEducation from './education/DetailEducation';
import DetailRegistration from './registration/DetailRegistration';
import DetailProduct from './product/DetailProduct';
import DetailService from './service/DetailService';
import BlogContext from './context/BlogContext';
import AutoPopUp from './common/AutoPopUp';
import Message from './common/Message';

const CompanyDetail = (
  {slug, currentCompany, detailPage}
) => {
    const { setLogo, resetLogo } = useContext(LogoContext)
    const { setTitle, resetTitle } = useContext(TitleContext)
    const { setPhoneNumber, resetPhoneNumber } = useContext(PhoneNumberContext)
    const { setBlogs, resetBlogs } = useContext(BlogContext)         

    const [message, setMessage] = useState();
    const [messageClass, setMessageClass] = useState();

    useEffect(() => {
      if (currentCompany && detailPage) {
        const { logo_url, meta_title, phone1, phone2, blogs } = currentCompany;        
    
        if (logo_url) setLogo(logo_url);
        if (meta_title && detailPage) setTitle(detailPage?.meta_title);
    
        const phones = [phone1, phone2].filter(Boolean).join(' - ');
        if (phones) setPhoneNumber(phones);

        setBlogs(blogs);
      }
    
      return () => {
        resetLogo();
        resetTitle();
        resetPhoneNumber();
        resetBlogs();
      };
    }, [currentCompany, detailPage]);

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
      {(currentCompany?.company_type == "Education")? 
        <DetailEducation slug={slug} detailPage={detailPage} company={currentCompany} setMessage={setMessage} setMessageClass={setMessageClass}/>
        : (currentCompany?.company_type == "Registration")? 
        <DetailRegistration slug={slug} detailPage={detailPage} currentCompany={currentCompany} setMessage={setMessage} setMessageClass={setMessageClass}/>
        : (currentCompany?.company_type == "Product")? 
        <DetailProduct slug={slug} detailPage={detailPage} currentCompany={currentCompany} setMessage={setMessage} setMessageClass={setMessageClass}/>
        : (currentCompany?.company_type == "Service")? 
        <DetailService slug={slug} detailPage={detailPage} currentCompany={currentCompany} setMessage={setMessage} setMessageClass={setMessageClass}/>
        :[]
      }      
    </>
  )
}

export default CompanyDetail