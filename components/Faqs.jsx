import React, {useContext, useEffect, useState} from 'react';

import AOS from 'aos';
import 'aos/dist/aos.css';

import $ from 'jquery';
import '/public/easy-responsive-tabs';
import Link from 'next/link.js';

import BlogContext from './context/BlogContext.jsx';
import customPage from '../lib/api/customPage';
import Loading from './Loading';
import TitleContext from './context/TitleContext.jsx';

const Faqs = ({
  homeContent, blogs, companies,  
}) => { 

  const { setBlogs, resetBlogs } = useContext(BlogContext)
  const { setTitle, resetTitle } = useContext(TitleContext)

  const [bzindiaFaqs, setBzindiaFaqs] = useState();
  const [bzindiaFaqsLoading, setBzindiaFaqsLoading] = useState(true);

  useEffect(() => {
    const fetchBzindiaFaqs = async () => {
      try {
        const response = await customPage.getBzindiaFaqs();
        setBzindiaFaqs(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setBzindiaFaqsLoading(false);
      }
    }

    fetchBzindiaFaqs();

  }, [])

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

      setTitle(`FAQs - ${homeContent?.meta_title || 'BZIndia - Find the top companies in India'}`);
      }

      return () => {      
      resetTitle();
      };
  }, [homeContent]);


  useEffect(() => {
    if ($.fn.easyResponsiveTabs && (bzindiaFaqs?.length || companies?.length)) {
      // Destroy previous instance if re-running
      $('#verticalTab').removeData('easyResponsiveTabs');

      $('#verticalTab').easyResponsiveTabs({
        type: 'vertical',
        width: 'auto',
        fit: true,
        activate: function () {}
      });

      // Force only first tab active
      const $tabs = $('#verticalTab .resp-tabs-list li');
      const $contents = $('#verticalTab .resp-tabs-container > div');

      $tabs.removeClass('resp-tab-active');
      $contents.removeClass('resp-tab-content-active').hide();

      // Set first one active
      $tabs.first().addClass('resp-tab-active');
      $contents.first().addClass('resp-tab-content-active').show();
    }
  }, [bzindiaFaqs, companies]);
  
  useEffect(() => {
          AOS.init({
          once: true,
      });
  }, [bzindiaFaqs, companies]);
  

  return (
    
    <>  

        <section className="bg-half" style={{backgroundImage: "url('/images/city-4667143_1920.jpeg')"}}>
            <div className="bg-overlay"></div>
            <div className="home-center">
                <div className="home-desc-center" data-aos="fade-in">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="page-next-level text-white">
                                    <h1>FAQs</h1>
                                    <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                                    
                                <p id="breadcrumbs">
                                <span>
                                <span><Link href="/">Home</Link></span> »                                    
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
 
   {/* home -banner section-end  */}
    <br/>
  <section className="content_area001" style={{padding: "0px 0px 40px 0px", marginBottom: "0px", borderBottom: "1px solid #ddd"}}>
    <div className="container" data-aos="fade-up">
            <h3>Frequently Asked Questions - FAQs</h3>
            <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
            <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12">
                    <div id="verticalTab">
                        <ul className="resp-tabs-list">
                            {bzindiaFaqsLoading ? <Loading/> :
                              bzindiaFaqs ? <li>General</li> : ""
                            }
                            {companies?.filter(company => company.faqs?.length > 0)?.map((company, selectCompanyIndex) => (
                                <li key={company.slug || selectCompanyIndex}>{company?.sub_type}</li>
                            ))}                            
                        </ul>

                        <div className="resp-tabs-container">
                            {bzindiaFaqsLoading ? <Loading/> :                            
                              bzindiaFaqs ? 
                                <div>
                                      <h4 style={{paddingBottom: "10px"}}>General</h4>
                                      <div className="row">
                                          <ol>
                                              {bzindiaFaqs?.map((faq, bzFaqIndex) => (
                                                  <li key={faq.slug || bzFaqIndex + 1}>
                                                      <h6><b>{faq.question}</b></h6>                                            
                                                      <p className="col-md-10">{faq.short_answer}..<Link href={`/faqs/${faq.slug}`}  >Read More</Link></p>  
                                                  </li>
                                              ))}
                                          </ol>                                            
                                      </div>

                                  </div>
                              : ""
                            }
                            {companies?.filter(company => company.faqs?.length > 0)?.map((company, companyIndex) => (

                                <div key={company.slug || companyIndex}>
                                    <h4 style={{paddingBottom: "10px"}}>{company.sub_type}</h4>
                                    <div className="row">
                                        <ol>
                                            {company.faqs?.map((faq, faqIndex) => (
                                                <li key={faq.slug || faqIndex + 1}>
                                                    <h6><b>{faq.question}</b></h6>                                            
                                                    <p className="col-md-10">{faq.short_answer}..<Link href={`/faqs/${faq.slug}`}  >Read More</Link></p>  
                                                </li>
                                            ))}
                                        </ol>                                            
                                    </div>

                                </div>

                            ))}                            

                            <div style={{clear: "both"}}></div>
            
                        </div>
                    </div>
                </div>
            </div>
        </div>
  </section>
  
   {/* what-we-do section start  */}
  
</>
  )
}

export default Faqs