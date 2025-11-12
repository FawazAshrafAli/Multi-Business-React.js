import React, { useEffect, useState, useContext } from 'react'
import createDOMPurify from 'dompurify';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import AOS from 'aos';
import 'aos/dist/aos.css';

import LogoContext from './context/LogoContext';
import TitleContext from './context/TitleContext';
import PhoneNumberContext from './context/PhoneNumberContext';

import company from '../lib/api/company';

import Loading from './Loading';
import BlogContext from './context/BlogContext';
import AutoPopUp from './common/AutoPopUp';
import Message from './common/Message';



const CompanyAbout = () => {
    const { slug } = useParams();

    const [message, setMessage] = useState();
    const [messageClass, setMessageClass] = useState();

    const [currentCompany, setCurrentCompany] = useState();
    const [currentCompanyError, setCurrentCompanyError] = useState(null);
    const [currentCompanyLoading, setCurrentCompanyLoading] = useState(true);    

    const [about, setAbout] = useState();    
    const [aboutLoading, setAboutLoading] = useState(false);
    const [aboutError, setAboutError] = useState(null);

    const { setLogo, resetLogo } = useContext(LogoContext)
    const { setTitle, resetTitle } = useContext(TitleContext)
    const { setPhoneNumber, resetPhoneNumber } = useContext(PhoneNumberContext)  
    
    const { setBlogs, resetBlogs } = useContext(BlogContext);

    const [sanitizedContent, setSanitizedContent] = useState([]);  

    useEffect(() => {
        if (typeof window === 'undefined' || !about) return;
    
          const content = about?.content || "";
    
          const DOMPurify = createDOMPurify(window);
          const sanitized = DOMPurify.sanitize( content || '');         
    
          setSanitizedContent(sanitized);
    }, [about]);

    useEffect(() => {
        const fetchCurrentCompany = async() => {
            try {
                const response = await company.getCompany(slug);
                setCurrentCompany(response.data); 
                setBlogs(response.data?.blogs)               
            } catch (err) {
                setCurrentCompanyError(err);
            } finally {
                setCurrentCompanyLoading(false);
            }
        }

        const fetchAboutUs = async() => {
            try {
                const response = await company.getCompanyAbout(slug);
                setAbout(response.data[0]);                
            } catch (err) {
                setAboutError(err);
            } finally {
                setAboutLoading(false);
            }
        }

        fetchCurrentCompany();
        fetchAboutUs();
    }, [slug]);
  

    useEffect(() => {
        if (!currentCompanyLoading && currentCompany) {
        const { logo_url, meta_title, sub_type, phone1, phone2, blogs } = currentCompany;
    
        if (logo_url) setLogo(logo_url);
        setTitle(`About Us - ${meta_title || sub_type}`);
    
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
    }, [currentCompanyLoading, currentCompany]);    
    

    useEffect(() => {
        AOS.init({
          // duration: 500,
          once: true,
        });
      }, []);

    [
        currentCompanyError, aboutError
    ].map(error => {
        if (error) {
            console.error(error);
        }
    });

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
        {/*banner-slider start */}
        <section className="bg-half" style={{backgroundImage: "url('/images/city-4667143_1920.jpeg')"}}>
            <div className="bg-overlay"></div>
            <div className="home-center">
                <div className="home-desc-center" data-aos="fade-in">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="page-next-level text-white">
                                    <h1>About Us</h1>
                                    <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                                    
                                    <p id="breadcrumbs">
                                        <span>
                                            <span><Link href="/">Home</Link></span> » 
                                            <span><Link href={`/${currentCompany?.slug}`}>{currentCompany?.sub_type}</Link></span> »         
                                            <span className="breadcrumb_last" aria-current="page">About Us</span>
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

                <h2>Who We Are</h2>
                <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>

                <div className="row" data-aos="fade-up" style={{textAlign: "initial"}}>
                <div className="col-md-12">
                {aboutLoading? <Loading/> :
                <div dangerouslySetInnerHTML={{__html: sanitizedContent}}/>
                }
                </div>
                
                </div>
            

            </div>
        </section>        
        
    </>
  )
}

export default CompanyAbout