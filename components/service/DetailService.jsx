import React, { useEffect, useState } from 'react'
import createDOMPurify from 'dompurify';
import slugify from 'slugify';

import AOS from 'aos';
import 'aos/dist/aos.css';

import $ from 'jquery';
import  "/public/easy-responsive-tabs.js";

import DetailPageSlider from './slider/DetailPageSlider'
import DarkEnquiryForm from './common/DarkEnquiryForm'
import Link from 'next/link.js';
import service from '../../lib/api/service';
import Loading from '../Loading'
import Faq from '../common/Faq';
import EnquiryForm from './common/EnquiryForm';
import TestimonialSlider from '../common/TestimonialSlider';

import NeonPhoneLink from '../common/NeonPhoneLink';
import TagCloud from '../home/TagCloud';

const DetailService = ({
  slug, detailPage, currentCompany,
  setMessage, setMessageClass
}) => {  

  const [serviceDetails, setRegistrationDetails] = useState();
  const [serviceDetailsError, setRegistrationDetailsError] = useState(null);
  const [serviceDetailsLoading, setRegistrationDetailsLoading] = useState(true);   

  const [sanitizedDescription, setSanitizedDescription] = useState();

  useEffect(() => {
    if (!detailPage) return;

    if (typeof window === 'undefined' || !detailPage) return;
                                  
    const DOMPurify = createDOMPurify(window);
    const sanitized = DOMPurify.sanitize(detailPage.description || '')
    
    setSanitizedDescription(sanitized);

    if (
      detailPage?.vertical_tabs?.length &&
      window.$ &&
      $.fn.easyResponsiveTabs &&
      document.getElementById('verticalTab')
    ) {

      $('#verticalTab').easyResponsiveTabs({
        type: 'vertical',
        width: 'auto',
        fit: true
      });
    }

    if (
      detailPage?.horizontal_tabs?.length &&
      window.$ &&
      $.fn.easyResponsiveTabs &&
      document.getElementById('horizontalTab')
    ) {

      $('#horizontalTab').easyResponsiveTabs({
        type: 'horizontal',
        width: 'auto',
        fit: true
      });
      
    }
  }, [detailPage]);

  useEffect(() => {
    const fetchCompanyRegistrationDetails = async () => {
      try {
        const response = await service?.getSliderDetails(slug);
        setRegistrationDetails(response.data.results);
      } catch (err) {
        setRegistrationDetailsError(err);
      } finally {
        setRegistrationDetailsLoading(false);
      }
    };

    fetchCompanyRegistrationDetails();
  }, [slug]);

  useEffect(() => {
    AOS.init({
      // duration: 500,
      once: true,
    });
  }, []);  

  let errors = [
    serviceDetailsError,    
  ]

  errors.map(err_obj => {
      if (err_obj) {
          console.error(err_obj);
      }
  });
  
  return (
    <>      
      <section className="bg-half" style={{backgroundImage: "url('/images/city-4667143_1920.jpeg')"}}>
          <div className="bg-overlay"></div>
          <div className="home-center">
              <div className="home-desc-center" data-aos="fade-in">
                  <div className="container">
                      <div className="row">
                          <div className="col-md-8">
                            {!detailPage? <Loading/> :
                            <div className="page-next-level text-white">
                              <h1 style={{textAlign:"left"}}>{detailPage?.name}</h1>
                            
                              <ul className="row list-default">
                                {detailPage&&!detailPage.hide_features&&detailPage.features? detailPage.features.map((feature) => <li key={feature.id}>{feature.feature}</li>): []}
                              </ul>

                              <p id="breadcrumbs">    
                                <span>
                                  <span><Link href="/"  >Home</Link></span> » 
                                  <span><Link href={`/${currentCompany?.slug}`}>{currentCompany?.sub_type}</Link></span> » 
                                  <span><Link href={`/${currentCompany?.slug}/${detailPage?.category_slug}`}>{detailPage?.category_name}</Link></span> » 
                                  <span><Link href={`/${currentCompany?.slug}/${detailPage?.category_slug}/${detailPage?.sub_category_slug}`}>{detailPage?.sub_category_name}</Link></span> » 
                                  <span className="breadcrumb_last" aria-current="page">{detailPage?.name}</span>
                                </span>
                              </p>
                            </div>
                            }
                          </div>  
                
                <div className="col-md-4">                  
                  <DarkEnquiryForm company={currentCompany} setMessage={setMessage} setMessageClass={setMessageClass}/>
                </div>                              
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="stick_navbar" style={{padding: "0px 0"}}>
        {detailPage&&!detailPage.hide_support_languages&&
        <>
          <div className="communicate_language"><p> <span style={{color: "#ff0", textTransform:"uppercase"}}>Support Languages:</span> English <span style={{color: "#f00"}}>|</span> ಕನ್ನಡ <span style={{color: "#f00"}}>|</span> हिंदी <span style={{color: "#f00"}}>|</span> தமிழ் <span style={{color: "#f00"}}>|</span> മലയാളം <span style={{color: "#f00"}}>|</span> తెలుగు</p></div>

          <NeonPhoneLink currentCompany={currentCompany}/>
        </>
        }
      <div style={{clear:"both"}}></div>

<toc className="bzindia_toc_scroll">
  {detailPage?.toc?.map((title, index) => <a key={index} href={`#${slugify(title||"", { lower: true })}-section`}>{title}</a>) || []}
</toc>

</div>
 
<section>
  <div className="container">
    <div className="row">
      <div className="tg-authorbox" data-aos="fade-up">
        <figure className="tg-authorpic">
          <a href="#">
            <img src={detailPage?.image_url || "/images/food-887348_640.jpg"} alt={detailPage?.name} />
          </a>
        </figure>
        <div className="tg-authorinfo">
 
          <div className="tg-section-heading">
            <h2>{detailPage?.name}</h2>
          </div>
          <div className="tg-description">
            <p>{detailPage?.summary}</p>
          </div>

            
 
        </div>
      </div>
    </div>
  </div>
</section>
 
  <section className="content_area001">
    <div className="container">

      <div className="row">
        <div className="col-md-12 col-sm-12 col-xs-12">
        <p>
          <span dangerouslySetInnerHTML={{__html: sanitizedDescription}} />
        </p>
      </div>
      </div>


      {detailPage&&!detailPage.hide_vertical_tab&& 
        <>
          <h3 id={detailPage?.vertical_title ? `${slugify(detailPage.vertical_title, { lower: true })}-section` : undefined} >{detailPage?.vertical_title}</h3>
          <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
  
          <div className="row" data-aos="fade-in">
          
            <div className="col-md-12 col-sm-12 col-xs-12">
              <div id="verticalTab">
                <ul className="resp-tabs-list">
                  {detailPage&&detailPage.vertical_tabs ? detailPage.vertical_tabs.map((tab) => <li key={tab.id}>{tab.heading}</li>): []}
                          
                </ul>
                <div className="resp-tabs-container">
  
                  {detailPage&&detailPage.vertical_tabs ? detailPage.vertical_tabs.map((tab) =>  (
                  <div key={tab.id}>
                    <h4>{tab.sub_heading}</h4>
                    <p>{tab.summary}</p>
          
                    <ul className="row list-default">
                      {tab.bullets? tab.bullets.map((bullet) => <li key={bullet.id} className="col col-md-6 col-12">{bullet.bullet}</li>) : []}                
                    </ul>
                  </div>
                  )): []}                              
                </div>
              </div>
            </div>
          </div>
        </>
      }
      
      {detailPage&&!detailPage.hide_horizontal_tab&& 
        <>
          <h3 id={detailPage?.horizontal_title ? `${slugify(detailPage.horizontal_title, { lower: true })}-section` : undefined}>{detailPage?.horizontal_title}</h3>
          <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
          <div className="row">
            <div className="col-md-12 col-sm-12 col-xs-12" data-aos="fade-in">
              <div id="horizontalTab">
                <ul className="resp-tabs-list">
                {detailPage&&detailPage.horizontal_tabs ? detailPage.horizontal_tabs.map((tab) => <li key={tab.id}>{tab.heading}</li>): []}
                </ul>
  
                <div className="resp-tabs-container">
                  {detailPage&&detailPage.horizontal_tabs ? detailPage.horizontal_tabs.map((tab) =>  (
                  <div key={tab.id}>
                    <p>{tab.summary}</p>
                    <ul className="row list-default">
                      {tab.bullets? tab.bullets.map((bullet) => <li key={bullet.id} className="col col-md-6 col-12">{bullet.bullet}</li>) : []}                
                    </ul>
              
                  </div>
                  )) : []}
                  
                </div>
              </div>
            </div>
          </div>
        </>
      }

      {detailPage&&!detailPage.hide_table&&
      <>
        <h3 id={detailPage?.table_title ? `${slugify(detailPage.table_title, { lower: true })}-section` : undefined}>{detailPage?.table_title}</h3>
        <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
        
        {detailPage&&
        <div className="row" data-aos="fade-up">
          <div className="col-md-12 col-sm-12 col-xs-12">
            <table>
              <thead>
                <tr>
                  {detailPage.tables?detailPage.tables.map((table) => <th key={table.id}>{table.heading}</th>) : []}           
                </tr>
                </thead>
                <tbody>
                  {detailPage.get_data? detailPage.get_data.map((row, index) => (
                    <tr key={index}>
                      {row.map((data, index) => <td key={index}>{data}</td>)}                    
                    </tr>
                  )) : []}                            
              </tbody>
            </table>
          </div>
        </div>      
        }
      </>
      }

      {detailPage&&!detailPage.hide_bullets&&
      <>
      <h3 id={detailPage?.bullet_title ? `${slugify(detailPage.bullet_title, { lower: true })}-section` : undefined}>{detailPage?.bullet_title}</h3>
      <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
      <ul className="row list-default" data-aos="fade-up">
        {detailPage&&detailPage.bullet_points?detailPage.bullet_points.map((bullet) => <li key={bullet.id} className="col col-md-6 col-12">{bullet.bullet_point}</li>) : []}
      </ul>
      </>
      }           

</div>
  </section>

  <section className="multi_serv_slider">
  
    <DetailPageSlider serviceDetails={serviceDetails} company={currentCompany} error={serviceDetailsError} loading={serviceDetailsLoading} />    

</section>  

 

 {detailPage&&!detailPage.hide_timeline&&
 (
 <section className="resume segments" id="resume" style={{background: "#ecf2ef", padding: "60px 0px", margin: "0px 0px 0px 0px"}}>
   <div className="container">
     <div className="row">
       <div className="col-md-12 col-sm-12 col-xs-12" data-aos="fade-up">
         <h3 id={detailPage?.timeline_title ? `${slugify(detailPage.timeline_title, { lower: true })}-section` : undefined}>{detailPage?.timeline_title}</h3>
         <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
 
         <ul className="timeline">
           {detailPage&&detailPage.timelines?detailPage.timelines.map((timeline) => (
           <li key={timeline.id}>
             <h4>{timeline.heading}</h4>
             <span>{timeline.summary}</span>
           </li>
           )) : []}
         </ul>
       </div>
     </div>
   </div>
 </section>
 )
 }

  <section>
    <div className="container-fluid">

      <div className="registration-faq-section my-5" id="faqs-section" data-aos="fade-up">        
        <div className="row">
          <div className="col-md-8">

            <div className="regstrtn-faq-space">

              <div className="registrsn-fq-scrool-bar-clm">
                <h3>Service FAQs</h3>
                <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                <div className="registrsn-fq-scrool-bar-clm-cntnt">
                  <div className=" pre-scrollable" style={{height: "340px", overflowY: "auto"}}>
                    
 <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
 
  <Faq faqs={detailPage?.faqs}/>


</div>
                    
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="col-md-4 ">            
            <EnquiryForm company={currentCompany} setMessage={setMessage} setMessageClass={setMessageClass}/>
          </div>
        </div>
      </div>
    </div>

  </section>

  {detailPage?.meta_tags &&
    <div className="content_area001" id="tags-section">
      <TagCloud metaTags={detailPage.meta_tags}/>
    </div>
  }  

  <TestimonialSlider testimonials={currentCompany?.testimonials} />       
    </>
  )
}

export default DetailService