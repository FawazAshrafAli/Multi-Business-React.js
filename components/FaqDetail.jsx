import React, { useContext, useEffect, useState } from 'react'
import createDOMPurify from 'dompurify';

import AOS from 'aos';
import 'aos/dist/aos.css';

import LogoContext from './context/LogoContext'
import TitleContext from './context/TitleContext'
import PhoneNumberContext from './context/PhoneNumberContext'

import destination from '../lib/api/destination'
import Link from 'next/link';
import BlogContext from './context/BlogContext';

const FaqDetail = ({
    currentFaq, blogs
}) => {    

    const [sanitizedAnswer, setSanitizedAnswer] = useState();

    const { setBlogs, resetBlogs } = useContext(BlogContext)      

    useEffect(() => {
        if (typeof window === 'undefined' || !currentFaq) return;
                                      
        const DOMPurify = createDOMPurify(window);
        const sanitized = DOMPurify.sanitize(currentFaq.answer || '')
        
        setSanitizedAnswer(sanitized);
    }, [currentFaq])

    useEffect(() => {
        if (blogs) {      

        setBlogs(blogs);
        }
    
        return () => {      
        resetBlogs();
        };
    }, [blogs]);    

    useEffect(() => {
        AOS.init({
            once: true,
        });
        }, []);

  return (
    <>
        {/*banner-slider start */}
        <section className="bg-half" style={{backgroundImage: "url('/images/city-4667143_1920.jpeg')"}}>
            <div className="bg-overlay"></div>
            <div className="home-center">
                <div className="home-desc-center" data-aos="fade-in">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="page-next-level text-white">
                                    <h1>{currentFaq?.question}</h1>
                                    <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                                    
                                    <p id="breadcrumbs">
                                        <span>
                                            <span><Link href="/">Home</Link></span> » 
                                            <span><Link href={`/faqs`}>FAQs</Link></span> » 
                                            <span className="breadcrumb_last" aria-current="page">{currentFaq?.question}</span>
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

                <h1>{currentFaq?.question}</h1>
                <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>

                <div className="row" data-aos="fade-up">
                <div className="col-md-12">
                <p className='text-start'>
                    <span dangerouslySetInnerHTML={{__html: sanitizedAnswer}} />
                </p>
                    </div>
                
                </div>
            </div>
        </section>

    </>
  )
}

export default FaqDetail