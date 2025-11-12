import React, { useEffect, useState, useContext } from 'react'
import createDOMPurify from 'dompurify';
import Link from 'next/link';

import AOS from 'aos';
import 'aos/dist/aos.css';

import BlogContext from './context/BlogContext';
import TitleContext from './context/TitleContext';

const TermsAndConditions = ({blogs, homeContent, termsAndConditions}) => {        
    const [sanitizedContent, setSanitizedContent] = useState([]);  

    const { setBlogs, resetBlogs } = useContext(BlogContext);
    const { setTitle, resetTitle } = useContext(TitleContext);

    useEffect(() => {
        if (blogs) {      

        setBlogs(blogs);
        }
    
        return () => {      
        resetBlogs();
        };
    }, [blogs]);

    useEffect(() => {
        if (homeContent) {      

        setTitle(`Terms And Conditions - ${homeContent?.meta_title || 'BZIndia - Find the top companies in India'}`);
        }
    
        return () => {      
        resetTitle();
        };
    }, [homeContent]);

    useEffect(() => {
        if (typeof window === 'undefined' || !termsAndConditions) return;
    
          const content = termsAndConditions?.content || "";
    
          const DOMPurify = createDOMPurify(window);
          const sanitized = DOMPurify.sanitize( content || '');         
    
          setSanitizedContent(sanitized);
    }, [termsAndConditions]);    
    

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
                                    <h1>Terms And Conditions</h1>
                                    <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                                    
                                    <p id="breadcrumbs">
                                        <span>
                                            <span><Link href="/">Home</Link></span> » 
                                            <span className="breadcrumb_last" aria-current="page">Terms And Conditions</span>
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

                <h2>Terms And Conditions</h2>
                <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>

                <div className="row" data-aos="fade-up" style={{textAlign: "initial"}}>
                <div className="col-md-12">
                <div dangerouslySetInnerHTML={{__html: sanitizedContent}}/>
                </div>
                
                </div>            

            </div>
        </section>        
    </>
  )
}

export default TermsAndConditions