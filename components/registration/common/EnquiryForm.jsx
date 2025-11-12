import React, { useEffect, useState } from 'react'
import useEnquiryForm from '../../../hooks/useRegistrationEnquiry';

import location from '../../../lib/api/location';
import registration from '../../../lib/api/registration';


const EnquiryForm = ({company, setMessage, setMessageClass}) => {
    const [states, setStates] = useState();
    const [statesLoading, setStatesLoading] = useState(false);
    const [statesError, setStatesError] = useState(null);

    const [registrations, setRegistrations] = useState();
    const [registrationsLoading, setRegistrationsLoading] = useState(false);
    const [registrationsError, setRegistrationsError] = useState(null);    

    

    const {
        formData,
        handleChange,
        handleSubmit,        
    } = useEnquiryForm({}, company, setMessage, setMessageClass);


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
        
    }, []);

    // Registrations
    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const response = await registration.getRegistrations(company?.slug);
                setRegistrations(response.data);
            } catch (err) {
                setRegistrationsError(err);
            } finally {
                setRegistrationsLoading(false);
            }
        };

        fetchRegistrations();
        
    }, [company]);

    const errors = [statesError, registrationsError];

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
        <div className="regstrtn-faq-space aos-init" data-aos="fade-up">
            <div className="faq-form-section">
                <h2>Register Now</h2>
                <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                <form action="#" method="post" onSubmit={handleFormSubmit}>
                    <input type="text" name="name" placeholder="Your Name:" value={formData?.name || ''} onChange={handleChange} required/><br/>
                    <input type="tel" name="phone" placeholder="Phone Number:" value={formData?.phone || ''} onChange={handleChange} pattern="^[^A-Za-z]*$" title="Phone number must not contain letters." required /><br/>
                    <input type="email" name="email" placeholder="E-Mail Address:" value={formData?.email || ''} onChange={handleChange} required/><br/>
                    <select className="country" name="registration" value={formData?.registration || ''} onChange={handleChange} required>
                        <option value="" disabled hidden>-- Select Registration --</option>
                        {registrationsLoading? <option value="" disabled>Loading . . .</option> :
                        registrations?.map((registration) => <option key={registration.slug} value={registration.slug}>{registration.title}</option>)
                        }
    
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