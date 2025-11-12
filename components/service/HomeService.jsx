import React, { useEffect, useState } from 'react'
import TestimonialSlider from '../common/TestimonialSlider'
import Faq from '../common/Faq'
import EnquiryForm from '../service/common/EnquiryForm'
import BannerSlider from '../common/BannerSlider'
import ClientSlider from '../common/ClientSlider'
import CompanyIntro from '../common/CompanyIntro'

import company from '../../lib/api/company'

import LargeServiceSlider from './common/LargeServiceSlider'

import AOS from 'aos';
import 'aos/dist/aos.css';

const HomeService = ({
    slug, currentCompany, companyTypeSlug, 
    detailPages, testimonials, 
    setMessage, setMessageClass
}) => {
    const [clients, setClients] = useState();
    const [clientsLoading, setClientsLoading] = useState(true);        

    // Clients
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await company.getClients(slug);
                setClients(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setClientsLoading(false);
            }
        };

        fetchClients();

    }, [slug]);
    
    useEffect(() => {
        AOS.init({
            once: true,
        });
    }, []);
    

  return (
    <>                  
        <BannerSlider slug={slug}/>

        <ClientSlider clients={clients} loading={clientsLoading} heading={currentCompany?.client_slider_heading}/>

        <CompanyIntro name={currentCompany?.name} description={currentCompany?.description}/>

  <section>
    <div className="container-fluid">

      <div className="service-faq-section my-5"  data-aos="fade-up">        
        <div className="row">
          <div className="col-md-8">

            <div className="regstrtn-faq-space">

              <div className="registrsn-fq-scrool-bar-clm">
                <h3>REGISTRATION FAQs</h3>
                <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                <div className="registrsn-fq-scrool-bar-clm-cntnt">
                  <div className=" pre-scrollable" style={{height: "500px", overflowY: "auto"}}>
                    
 <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
 
  <Faq faqs={currentCompany?.faqs} companyFaq={true}/>


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

  <section>
    <LargeServiceSlider serviceDetails={detailPages} companyTypeSlug={companyTypeSlug} company={currentCompany}/>
  </section>

  <TestimonialSlider testimonials={testimonials} />  

    </>
  )
}

export default HomeService