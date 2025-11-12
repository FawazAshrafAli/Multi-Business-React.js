import React, { useEffect, useState } from 'react'
import useEnquiryForm from '../../../hooks/useServiceEnquiry';

import AOS from 'aos';
import 'aos/dist/aos.css';

import location from '../../../lib/api/location';
import service from '../../../lib/api/service';


const EnquiryForm = ({company, setMessage, setMessageClass}) => {
    const [services, setServices] = useState();
    const [servicesLoading, setServicesLoading] = useState(false);
    const [servicesError, setServicesError] = useState(null);    

    const [states, setStates] = useState();
    const [statesLoading, setStatesLoading] = useState(false);
    const [statesError, setStatesError] = useState(null);

    

    // Services
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await service.getServices(company?.slug);
                setServices(response.data);
            } catch (err) {
                setServicesError(err);
            } finally {
                setServicesLoading(false);
            }
        };

        fetchServices();
        
    }, [company]);

    // States
    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await location.getStates();
                setStates(response.data);
            } catch (err) {
                setStatesError(err);
            } finally {
                setStatesLoading(false);
            }
        };

        fetchStates();

        AOS.init({
            once: true,
        });
        
    }, []);

    const {
        formData,
        handleChange,
        handleSubmit,        
    } = useEnquiryForm({}, company, setMessage, setMessageClass);        

    const errors = [statesError, servicesError];

    errors.map(error => {
        if (error) {
            console.error(error);
        }
    });

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        

        let success = false;

        try {
            success = await handleSubmit(e);
        } catch (err) {
            // Fallback for unexpected errors
            console.error('Unexpected error:', err);
            setMessage('An unexpected error occurred.');
            setMessageClass('bg-danger');
        }

    };
  return (
    <>
        <div className="regstrtn-faq-space" data-aos="fade-up">
            <div className="faq-form-section">
                <h2>Get A Quote</h2>
                <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                <form action="#" method="post" onSubmit={handleFormSubmit}>
                    <input type="text" name="name" placeholder="Your Name:" value={formData?.name || ''} onChange={handleChange} required/><br/>
                    <input type="tel" name="phone" placeholder="Phone Number:" value={formData?.phone || ''} onChange={handleChange} pattern="^[^A-Za-z]*$" title="Phone number must not contain letters." required /><br/>
                    <input type="email" name="email" placeholder="E-Mail Address:" value={formData?.email || ''} onChange={handleChange} required/><br/>
                    <select className="country" name="service" value={formData?.service || ''} onChange={handleChange} required>
                        <option value="" disabled hidden>-- Select Service --</option>
                        {services?.map((service) => <option key={service.slug} value={service.slug}>{service.name}</option>)}
    
                    </select><br/>
                    <select className="country" name="state" value={formData?.state || ''} onChange={handleChange} required>
                        <option value="" disabled hidden>-- Select State --</option>
                        {statesLoading? <option value="" disabled>Loading . . .</option> :
                        states&&states.map((state) => <option key={state.slug} value={state.slug}>{state.name}</option>)
                        }
                    
                    </select><br/>

                    <div className="frm-btn-sctn">
                        <div>
                            <button className="primary_button" role="button" type="submit">SUBMIT</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </>
  )
}

export default EnquiryForm