import React, { Fragment, useContext, useEffect, useState } from 'react';
import createDOMPurify from 'dompurify';
import slugify from 'slugify';

import AOS from 'aos';
import 'aos/dist/aos.css';

import registration from '../../lib/api/registration';

import $ from 'jquery';
import  "/public/easy-responsive-tabs.js";
import Link from 'next/link.js';

import Loading from '../Loading';
import DetailPageSlider from './slider/DetailPageSlider';

import NeonPhoneLink from '../common/NeonPhoneLink';
import EnquiryForm from './common/EnquiryForm';
import Faq from '../common/Faq';
import DarkEnquiryForm from './common/DarkEnquiryForm';
import TagCloud from '../home/TagCloud';

const MultipageRegistration = ({
  slug, currentCompany, replacedMultipage,
  setMessage, setMessageClass, state, 
  district, place, isIndianData, pathname
}) => {    
    const [registrationDetails, setRegistrationDetails] = useState();
    const [registrationDetailsError, setRegistrationDetailsError] = useState(null);
    const [registrationDetailsLoading, setRegistrationDetailsLoading] = useState(true);              

    const [sanitizedDescription, setSanitizedDescription] = useState();

    const sanitizedTextEditor = (content) => {
        if (!content || typeof window === 'undefined') return;

        const DOMPurify = createDOMPurify(window);
        const sanitized = DOMPurify.sanitize(content || '')

        return sanitized || "";
    }       

  useEffect(() => {
    if (typeof window === 'undefined' || !replacedMultipage) return;
                      
      const DOMPurify = createDOMPurify(window);
      const sanitized = DOMPurify.sanitize(replacedMultipage.description || '')

      setSanitizedDescription(sanitized);

    if (
      replacedMultipage?.vertical_tabs?.length &&
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
      replacedMultipage?.horizontal_tabs?.length &&
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

  }, [replacedMultipage]);

  useEffect(() => {
    const fetchCompanyRegistrationDetails = async () => {
    try {
        const response = await registration?.getSliderDetails(slug);
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
      once: true,
    });
  }, []);  

  [
    registrationDetailsError,     
    ].map((error) => {
      if (error) {
        console.error(error);
      }
  });

  return (
    <>          
        {/*banner-  lider start */}
            <section className="bg-half" style={{backgroundImage: "url('/images/city-4667143_1920.jpeg')"}}>
                <div className="bg-overlay"></div>
                <div className="home-center">
                    <div className="home-desc-center" data-aos="fade-in">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-8">
                                {!replacedMultipage? <Loading/> :
                                <div className="page-next-level text-white">
                                    
                                <h1 style={{textAlign:"left"}}>
                                    {isIndianData ?
                                        <>{replacedMultipage?.title}{!replacedMultipage?.title?.includes("India")?" in India":""}{replacedMultipage?.sub_title}</>
                                    :
                                        <>{replacedMultipage?.title}{replacedMultipage?.sub_title}</>
                                    }
                                </h1>
                                                                
                                <ul className="row list-default">
                                    {replacedMultipage&&!replacedMultipage?.hide_features&&replacedMultipage?.features? replacedMultipage?.features.map((feature) => <li key={feature.id}>{feature.feature}</li>): []}
                                </ul>

                                <p id="breadcrumbs">
                                    <span>
                                        <span><Link href="/" >Home</Link></span> » 
                                        <span><Link href={`/${slug}`} >{currentCompany?.sub_type}</Link></span> » 
                                        {replacedMultipage?.url_type == "location_filtered" ?
                                        <>
                                        {isIndianData ? 
                                            <span className="breadcrumb_last" aria-current="page">{replacedMultipage?.title}{!replacedMultipage?.title?.includes("India")?" in India":""}</span>
                                        :
                                            
                                        <>
                                            <span><Link href={`/${slug}/${replacedMultipage?.slug}`} >{replacedMultipage?.modified_title || replacedMultipage?.title}</Link></span> »
                                            {(place || district) && 
                                            <>
                                                <span><Link href={`/${slug}/${replacedMultipage?.slug}/${state?.slug}`} >{state?.name}</Link></span> »
                                            </>
                                            }
                                            {place && 
                                            <>                                        
                                                <span><Link href={`/${slug}/${replacedMultipage?.slug}/${state?.slug}/${district?.slug}`} >{district?.name || state?.name}</Link></span> »
                                            </>
                                            }
                                            <span className="breadcrumb_last" aria-current="page">{place?.name || district?.name || state?.name}</span>
                                        </>
                                        }
                                        </>
                                        :
                                        <span className="breadcrumb_last" aria-current="page">{replacedMultipage?.title}</span>
                                        }
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
    {replacedMultipage&&!replacedMultipage?.hide_support_languages&&
    <>
        <div className="communicate_language"><p> <span style={{color: "#ff0", textTransform:"uppercase"}}>Support Languages:</span> English <span style={{color: "#f00"}}>|</span> ಕನ್ನಡ <span style={{color: "#f00"}}>|</span> हिंदी <span style={{color: "#f00"}}>|</span> தமிழ் <span style={{color: "#f00"}}>|</span> മലയാളം <span style={{color: "#f00"}}>|</span> తెలుగు</p></div>

        <NeonPhoneLink currentCompany={currentCompany}/>
    </>
    }
    <div style={{clear:"both"}}></div>


    <toc className="bzindia_toc_scroll">
    {replacedMultipage&&replacedMultipage?.toc ? replacedMultipage?.toc.map((title, index) => <a key={index} href={`${pathname}#${slugify(title || "", { lower: true })}-section`}>{title}</a>) : []}
    </toc>

    


    </div>
    
    
        {/*banner-slider end */}

    
    
    <section>
    <div className="container">
        <div className="row">
        <div className="tg-authorbox" data-aos="fade-up">
            <figure className="tg-authorpic">
            
            <Link href={replacedMultipage?.image_url || "/images/food-887348_640.jpg"} target="_blank">
                <img src={replacedMultipage?.image_url || "/images/food-887348_640.jpg"} alt={replacedMultipage?.title} />
            </Link>
            </figure>
            <div className="tg-authorinfo">
    
            <div className="tg-section-heading">
                <h2>
                    {isIndianData ?
                        <>{replacedMultipage?.title}{!replacedMultipage?.title?.includes("India")?" in India":""}{replacedMultipage?.sub_title}</>
                    :
                        <>{replacedMultipage?.title}{replacedMultipage?.sub_title}</>
                    }
                </h2>
            </div>
            <div className="tg-description">
                <p>{replacedMultipage?.summary}</p>
            </div>

                
    
            </div>
        </div>
        </div>
    </div>
    </section>
    

    {/* registration-services-section start */}

    <section className="content_area001">
        <div className="container">

        <div className="row">
            <div className="col-md-12 col-sm-12 col-xs-12">
            <p>
            <span dangerouslySetInnerHTML={{__html: sanitizedDescription}} />
            </p>
            </div>
        </div>

        {replacedMultipage&&!replacedMultipage?.hide_vertical_tab&& 
        <>
            <h3 id={replacedMultipage?.vertical_title ? `${slugify(replacedMultipage?.vertical_title, { lower: true })}-section` : undefined} >{replacedMultipage?.vertical_title}</h3>
            <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>

            <div className="row" data-aos="fade-in">
            
            <div className="col-md-12 col-sm-12 col-xs-12">
                <div id="verticalTab">
                <ul className="resp-tabs-list">
                    {replacedMultipage&&replacedMultipage?.vertical_tabs ? replacedMultipage?.vertical_tabs.map((tab) => <li key={tab.id}>{tab.heading}</li>): []}
                            
                </ul>
                <div className="resp-tabs-container">

                    {replacedMultipage&&replacedMultipage?.vertical_tabs ? replacedMultipage?.vertical_tabs.map((tab) =>  (
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
        
        {replacedMultipage&&!replacedMultipage?.hide_horizontal_tab&& 
        <>
            <h3 id={replacedMultipage?.horizontal_title ? `${slugify(replacedMultipage?.horizontal_title, { lower: true })}-section` : undefined}>{replacedMultipage?.horizontal_title}</h3>
            <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
            <div className="row">
            <div className="col-md-12 col-sm-12 col-xs-12" data-aos="fade-in">
                <div id="horizontalTab">
                <ul className="resp-tabs-list">
                {replacedMultipage&&replacedMultipage?.horizontal_tabs ? replacedMultipage?.horizontal_tabs.map((tab) => <li key={tab.id}>{tab.heading}</li>): []}
                </ul>

                <div className="resp-tabs-container">
                    {replacedMultipage&&replacedMultipage?.horizontal_tabs ? replacedMultipage?.horizontal_tabs.map((tab) =>  (
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

        {replacedMultipage&&!replacedMultipage?.hide_table&&
        <>
            <h3 id={replacedMultipage?.table_title ? `${slugify(replacedMultipage?.table_title, { lower: true })}-section` : undefined}>{replacedMultipage?.table_title}</h3>
            <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
            
            {replacedMultipage&&
            <div className="row" data-aos="fade-up">
            <div className="col-md-12 col-sm-12 col-xs-12">
                <table>
                <thead>
                    <tr>
                    {replacedMultipage?.tables?replacedMultipage?.tables.map((table) => <th key={table.id}>{table.heading}</th>) : []}           
                    </tr>
                    </thead>
                    <tbody>
                    {replacedMultipage?.get_data? replacedMultipage?.get_data.map((row, index) => (
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

        {replacedMultipage&&!replacedMultipage?.hide_bullets&&
        <>
        <h3 id={replacedMultipage?.bullet_title ? `${slugify(replacedMultipage?.bullet_title, { lower: true })}-section` : undefined}>{replacedMultipage?.bullet_title}</h3>
        <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
        <ul className="row list-default" data-aos="fade-up">
            {replacedMultipage&&replacedMultipage?.bullet_points?replacedMultipage?.bullet_points.map((bullet) => <li key={bullet.id} className="col col-md-6 col-12">{bullet.bullet_point}</li>) : []}
        </ul>
        </>
        }        

        {replacedMultipage?.text_editors?.map((text_editor, editorIndex) => (
            <Fragment key={text_editor.slug || editorIndex + 1}>
                <h3 className="text-start" id={text_editor?.text_editor_title ? `${slugify(text_editor?.text_editor_title, { lower: true })}-section` : undefined}>{text_editor?.text_editor_title}</h3>
                <div className="text-start" dangerouslySetInnerHTML={{__html: sanitizedTextEditor(text_editor.content || "")}} />
            </Fragment>
        ))
        }
        
        
        </div>

    </section>



    
    <section className="multi_serv_slider">

        <DetailPageSlider registrationDetails={replacedMultipage?.slider_registrations || registrationDetails} error={registrationDetailsError} loading={registrationDetailsLoading} />    

    </section>  

    
    {replacedMultipage&&!replacedMultipage?.hide_timeline&&
    (
    <section className="resume segments" id="resume" style={{background: "#ecf2ef", padding: "60px 0px", margin: "0px 0px 0px 0px"}}>
    <div className="container">
        <div className="row">
        <div className="col-md-12 col-sm-12 col-xs-12" data-aos="fade-up">
            <h3 id={replacedMultipage?.timeline_title ? `${slugify(replacedMultipage?.timeline_title, { lower: true })}-section` : undefined}>{replacedMultipage?.timeline_title}</h3>
            <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>

            <ul className="timeline">
            {replacedMultipage&&replacedMultipage?.timelines?replacedMultipage?.timelines.map((timeline) => (
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

        <div className="registration-faq-section my-5" id="faqs-section">        
            <div className="row">
            <div className="col-md-8">

                <div className="regstrtn-faq-space">

                <div className="registrsn-fq-scrool-bar-clm">
                    <h3>FAQs</h3>
                    <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                    <div className="registrsn-fq-scrool-bar-clm-cntnt">
                    <div className=" pre-scrollable" style={{height: "340px", overflowY: "auto"}}>
                        <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                            <Faq faqs={replacedMultipage&&replacedMultipage?.faqs}/>
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

    {replacedMultipage?.meta_tags &&
        <div className="content_area001" id="tags-section">
            <TagCloud
                metaTags={replacedMultipage?.meta_tags?.map(tag => {
                    let slug = tag.slug;
    
                    if (place?.name && place?.slug) {
                    slug = slug.replace(place.name, place.slug);
                    }
                    if (district?.name && district?.slug) {
                    slug = slug.replace(district.name, district.slug);
                    }
                    if (state?.name && state?.slug) {
                    slug = slug.replace(state.name, state.slug);
                    }
    
                    slug = slug.replace("India", "india");
    
                    return {
                    name: tag.name,
                    slug
                    };
                })}
                />
        </div>
    }

    {/* <TestimonialSlider testimonials={currentCompany?.testimonials || []} />       */}
    </>
  )
}

export default MultipageRegistration