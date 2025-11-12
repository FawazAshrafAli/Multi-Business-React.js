import React, { useEffect, useState } from 'react'

import { useContext } from 'react';

import LogoContext from './context/LogoContext';
import TitleContext from './context/TitleContext';
import PhoneNumberContext from './context/PhoneNumberContext';

import HomeEducation from './education/HomeEducation';
import HomeRegistration from './registration/HomeRegistration';
import HomeProduct from './product/HomeProduct';

import HomeService from './service/HomeService';
import BlogContext from './context/BlogContext';
import AutoPopUp from './common/AutoPopUp';
import Message from './common/Message';

const CompanyHome = ({slug, detailPages, testimonials, currentCompany}) => {        

    const { setLogo, resetLogo } = useContext(LogoContext)  
    const { setTitle, resetTitle } = useContext(TitleContext)
    const { setPhoneNumber, resetPhoneNumber } = useContext(PhoneNumberContext)  
    const { setBlogs, resetBlogs } = useContext(BlogContext)      

    const [message, setMessage] = useState();
    const [messageClass, setMessageClass] = useState();

    useEffect(() => {
        if (currentCompany) {
        const { logo_url, meta_title, phone1, phone2, blogs } = currentCompany;
    
        if (logo_url) setLogo(logo_url);
        if (meta_title) setTitle(meta_title);
    
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
        {(currentCompany?.company_type == "Education")? 
        <HomeEducation slug={slug} company={currentCompany} companyTypeSlug={currentCompany?.type_slug} detailPages={detailPages} testimonials={testimonials} setMessage={setMessage} setMessageClass={setMessageClass}/>
        : (currentCompany?.company_type == "Registration")? 
        <HomeRegistration slug={slug} currentCompany={currentCompany} companyTypeSlug={currentCompany?.type_slug} detailPages={detailPages} testimonials={testimonials} setMessage={setMessage} setMessageClass={setMessageClass}/> 
        : (currentCompany?.company_type == "Product")?
        <HomeProduct slug={slug} currentCompany={currentCompany} companyTypeSlug={currentCompany?.type_slug} detailPages={detailPages} reviews={testimonials} setMessage={setMessage} setMessageClass={setMessageClass}/> 
        : (currentCompany?.company_type == "Service")?
        <HomeService slug={slug} currentCompany={currentCompany} companyTypeSlug={currentCompany?.type_slug} detailPages={detailPages} testimonials={testimonials} setMessage={setMessage} setMessageClass={setMessageClass}/> 
        :null}      
    </>
  )
}

export default CompanyHome