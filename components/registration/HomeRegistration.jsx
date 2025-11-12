import React, { useEffect, useState } from 'react'

import Faq from '../common/Faq';

import company from '../../lib/api/company';

import ClientSlider from '../common/ClientSlider';
import BannerSlider from '../common/BannerSlider';
import CompanyIntro from '../common/CompanyIntro';
import EnquiryForm from './common/EnquiryForm';
import LargeRegistrationSlider from './home/LargeRegistrationSlider';
import TestimonialSlider from '../common/TestimonialSlider';

const HomeRegistration = ({
    slug, currentCompany, companyTypeSlug,
    detailPages, testimonials, setMessage, setMessageClass
}) => {    
    const [loading, setLoading] = useState(true);

    const [clients, setClients] = useState();
    const [clientsError, setClientsError] = useState(null);
    const [clientsLoading, setClientsLoading] = useState(true);    
    
    useEffect(() => {
        if (currentCompany) {
            setLoading(false);
        }
    }, [currentCompany]);

    // Clients
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await company.getClients(slug);
                setClients(response.data);
            } catch (err) {
                setClientsError(err);
            } finally {
                setClientsLoading(false);
            }
        };

        fetchClients();

    }, [slug]);
    

    const errors = [
        clientsError
    ];

    errors.map(err_obj => {
        if (err_obj) {
            console.error(err_obj);
        }
    })
    

  return (
    <>                
        <BannerSlider slug={slug} />
        
        <ClientSlider clients={clients} loading={clientsLoading} heading={currentCompany.client_slider_heading}/>

        <CompanyIntro name={currentCompany?.name} description={currentCompany?.description} loading={loading}/>

        <section>
            <div className="container-fluid">
                <div className="registration-faq-section my-5"  >                  
                    <div className="row">
                        <div className="col-md-8" data-aos="fade-up">
                            <div className="regstrtn-faq-space">
                                <div className="registrsn-fq-scrool-bar-clm">
                                    <h3>Company FAQs</h3>
                                    <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                                    <div className="registrsn-fq-scrool-bar-clm-cntnt">
                                        <div className=" pre-scrollable" style={{height: "500px", overflowY: "auto"}}>                                    
                                            <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                                                <Faq faqs={currentCompany?.faqs} loading={loading} companyFaq={true}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-4">                                   
                            <EnquiryForm company={currentCompany} setMessage={setMessage} setMessageClass={setMessageClass}/>
                        </div>
                    </div>
                </div>
            </div>

        </section>

        <LargeRegistrationSlider company={currentCompany} registrationDetails={detailPages} companyTypeSlug={companyTypeSlug}/>

        <TestimonialSlider testimonials={testimonials} loading={loading} />        
    </>
  )
}

export default HomeRegistration