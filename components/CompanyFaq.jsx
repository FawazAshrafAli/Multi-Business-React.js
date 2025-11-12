import React, { useEffect, useState, useContext } from 'react'
import Link from 'next/link';

import AOS from 'aos';
import 'aos/dist/aos.css';

import LogoContext from './context/LogoContext';
import TitleContext from './context/TitleContext';
import PhoneNumberContext from './context/PhoneNumberContext';

import company from '../lib/api/company';

import Faq from './common/Faq';
import BlogContext from './context/BlogContext';
import AutoPopUp from './common/AutoPopUp';
import Message from './common/Message';


const CompanyFaq = ({
    currentCompany
}) => {
    const [message, setMessage] = useState();
    const [messageClass, setMessageClass] = useState();

    const { setLogo, resetLogo } = useContext(LogoContext)
    const { setTitle, resetTitle } = useContext(TitleContext)
    const { setPhoneNumber, resetPhoneNumber } = useContext(PhoneNumberContext)

    const { setBlogs, resetBlogs } = useContext(BlogContext)      

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
        AOS.init({
          once: true,
        });
      }, []);

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
        
        <AutoPopUp currentCompany={currentCompany} setMessage={setMessage} setMessageClass={setMessageClass}/>
        {message&&
        <Message message={message} messageClass={messageClass} />
        }
        <section className="bg-half" style={{backgroundImage: "url('/images/city-4667143_1920.jpeg')"}}>
            <div className="bg-overlay"></div>
            <div className="home-center">
                <div className="home-desc-center" data-aos="fade-in">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="page-next-level text-white">
                                    <h1>Frequently Asked Questions (FAQs)</h1>
                                    <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                                    
                                    <p id="breadcrumbs">
                                        <span>
                                            <span><Link href="/">Home</Link></span> » 
                                            <span><Link href={`/${currentCompany?.slug}`}>{currentCompany?.sub_type}</Link></span> »         
                                            <span className="breadcrumb_last" aria-current="page">FAQs</span>
                                        </span>
                                    </p>

                                </div>
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="cleints-listing-secion py-5 h2_second">
            <div className="container">

                <div className="row" data-aos="fade-up">
                    <div className="regstrtn-faq-space">
                        <div className="registrsn-fq-scrool-bar-clm">
                            <h3>{company?.name} FAQs</h3>
                            <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>

                            <div className="registrsn-fq-scrool-bar-clm-cntnt">
                                <div className=" pre-scrollable">

                                    <Faq faqs={currentCompany?.faqs} companyFaq={true}/>    

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>        
        
    </>
  )
}

export default CompanyFaq