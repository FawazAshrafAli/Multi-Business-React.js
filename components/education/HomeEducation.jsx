import React, { useEffect, useState } from 'react'

import Faq from '../common/Faq';

import course from '../../lib/api/course';

import EnquiryForm from './common/EnquiryForm';
import dynamic from 'next/dynamic';
import Loading from '../Loading';

const PartnerSlider = dynamic(() => import('./home/PartnerSlider.jsx'), {
  ssr: false,
  loading: () => <Loading />
});
const LargeCourseSlider = dynamic(() => import('./home/LargeCourseSlider.jsx'), {
  ssr: false,
  loading: () => <Loading />
});
const BannerSlider = dynamic(() => import('../common/BannerSlider.jsx'), {
  ssr: false,
  loading: () => <Loading />
});
const CompanyIntro = dynamic(() => import('../common/CompanyIntro.jsx'), {
  ssr: false,
  loading: () => <Loading />
});
const TestimonialSlider = dynamic(() => import('./common/TestimonialSlider.jsx'), {
  ssr: false,
  loading: () => <Loading />
});

const HomeEducation = ({
    slug, company, detailPages, testimonials,
    setMessage, setMessageClass
}) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [partners, setPartners] = useState();    
    
    if (!slug) {
        return;
    }        

    // Corporate Partners
    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const response = await course.getPartners(slug);
                setPartners(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPartners();

    }, [slug]);

    if (error) {
        console.error(error);
    }

    
  return (
    <>                  
        <BannerSlider slug={slug}/>
        
        <PartnerSlider partners={partners} loading={loading} heading={company?.client_slider_heading}/>

        <CompanyIntro name={company&&company.name} description={company&&company.description} loading={loading}/>

        <section>
            <div className="container-fluid">
                <div className="registration-faq-section my-5"  >                  
                    <div className="row">
                        <div className="col-md-8">
                            <div className="regstrtn-faq-space">
                                <div className="registrsn-fq-scrool-bar-clm">
                                    <h3>Company FAQs</h3>
                                    <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                                    <div className="registrsn-fq-scrool-bar-clm-cntnt">
                                        <div className=" pre-scrollable" style={{height: "500px", overflowY: "auto"}}>                                    
                                            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                                                <Faq faqs={company?.faqs} companyFaq={true}/>                                    
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-4">    
                            <EnquiryForm company={company} setMessage={setMessage} setMessageClass={setMessageClass}/>                            
                        </div>
                    </div>
                </div>
            </div>

        </section>

        <LargeCourseSlider company={company} courseDetails={detailPages} loading={loading} slug={slug}/>
        

        <TestimonialSlider testimonials={testimonials} loading={loading} />
                
    </>
  )
}

export default HomeEducation