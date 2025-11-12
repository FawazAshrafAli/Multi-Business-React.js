import React, {useContext, useEffect, useState} from 'react'
import Link from 'next/link.js';
import Cookies from 'js-cookie';

import AOS from 'aos';
import 'aos/dist/aos.css';

import Message from './common/Message'

import location from '../lib/api/location';
import enquiry from '../lib/api/enquiry';
import Loading from './Loading';

import $ from 'jquery';
import '/public/easy-responsive-tabs';
import BlogContext from './context/BlogContext';
import customPage from '../lib/api/customPage';
import TitleContext from './context/TitleContext';


const BzIndiaContactForm = ({homeContent, blogs}) => {
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState();
    const [messageClass, setMessageClass] = useState();    

    const [bzindiaContacts, setBzindiaContacts] = useState();
    const [bzindiaContactsLoading, setBzindiaContactsLoading] = useState(true);        

    const { setBlogs, resetBlogs } = useContext(BlogContext); 
    const { setTitle, resetTitle } = useContext(TitleContext);    
    
    const [states, setStates] = useState();
    const [statesLoading, setStatesLoading] = useState(true);
    const [statesError, setStatesError] = useState(null);
    

    useEffect(() => {
        const fetchBzindiaContacts = async () => {
          try {
            const response = await customPage.getBzindiaContacts();
            setBzindiaContacts(response.data);
          } catch (err) {
            console.error(err);
          } finally {
            setBzindiaContactsLoading(false);
          }
        }
    
        fetchBzindiaContacts();
    
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

        setTitle(`Contact Us - ${homeContent?.meta_title || 'BZIndia - Find the top companies in India'}`);
        }
    
        return () => {      
        resetTitle();
        };
    }, [homeContent]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const csrfToken = Cookies.get('csrftoken');

        try {
            const payload = {
                ...formData,
                
            };

            const response = await enquiry.postEnquiry(
                payload,
                {
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                }
            );

            const { success, message } = response.data || {};

            setMessageClass(success?"bg-success":"bg-danger");
            setMessage(message);

            if (success) {
                setFormData({});
            }

        } catch (err) {
            const responseData = err.response?.data;
            setMessageClass("bg-danger");

            if (responseData?.error) {
                // Stop after displaying the first error message
                const errors = responseData.error;
                let firstErrorMessage = "";
            
                // Loop through the errors and stop at the first field's error
                for (const [field, messages] of Object.entries(errors)) {
                  firstErrorMessage = `${field.charAt(0).toUpperCase() + field.slice(1)}: ${messages[0]}`;
                  break; // Stop after the first error is encountered
                }
            
                setMessage(firstErrorMessage);  // Set the message with the first error
              } else {
                setMessage(responseData?.message || "Submission failed");
              }
        } finally {            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

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

    useEffect(() => {
        const fetchStates = async () => {

            try {
                const response = await location.getMinimalStates();
                setStates(response.data);
            } catch (err) {
                setStatesError(err)
            } finally {
                setStatesLoading(false);
            }
        };

        fetchStates();

    }, []);    

    useEffect(() => {
        if ($.fn.easyResponsiveTabs) {
        $('#verticalTab').easyResponsiveTabs({
            type: 'vertical',
            width: 'auto',
            fit: true
        });
        } else {
        console.warn('easyResponsiveTabs is not loaded properly');
        }
    }, [bzindiaContacts]);

    useEffect(() => {
        AOS.init({
            once: true,
        });
        }, [bzindiaContacts]);

    if (statesError) return <div>Error: {statesError}</div>;    

  return (
    <>          
        {message&&
        <Message message={message} messageClass={messageClass} />
        }        
        {/* banner-slider start */}
          <section className="bg-half" style={{backgroundImage: "url('/images/city-4667143_1920.jpeg')"}}>
          <div className="bg-overlay"></div>
          <div className="home-center">
              <div className="home-desc-center" data-aos="fade-in">
                  <div className="container">
                      <div className="row">
                          <div className="col-md-12">
                              <div className="page-next-level text-white">
                                  <h1>Contact Us</h1>
                                  <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                                  
      <p id="breadcrumbs">
                                <span>
      <span><Link href="/" className='breadcrumb-nav' >Home</Link></span> »       
      <span className="breadcrumb_last" aria-current="page">Contact Us</span>
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

              <h2>Contact Us</h2>
              <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>

              
      <div className="row" data-aos="fade-in">
              
            <div className="col-md-12 col-sm-12 col-xs-12">
              <div id="verticalTab">
                {bzindiaContacts ? 
                <>
                    <ul className="resp-tabs-list">
                        {bzindiaContacts?.map((contact, contactIndex) => <li key={contact?.slug || contactIndex + 1}>{contact.district_name}, {contact.state_name}</li> )}                                               
                    </ul>
                    <div className="resp-tabs-container">
                        {bzindiaContacts?.map((contact, contactIndex) => (
                            <div key={contact?.slug || contactIndex + 1}>            
                                <div className="row">
                                    <div className="col-md-6 contact_page_style">
                                        <h4>BZIndia, {contact.district_name}, {contact.state_name}</h4>
                                        <p>{contact.address} – {contact.pincode}</p>
                                        
                                        <p style={{lineHeight: "30px"}}>Tel: <a href={`tel:${contact.tel}`}>{contact.tel}</a><br/>
                                        Mob: <Link href={`tel:${contact.mobile}`}>{contact.mobile}</Link><br/>
                                        E-Mail: <Link href={`mailto:${contact.email}`}>{contact.email}</Link><br/>
                                        Web: <Link href={contact.web || "#"}>{contact.web}</Link></p>
                                    </div>
                                    <div className="col-md-6">
                                        {contact?.lat && contact?.lon && (
                                            <iframe
                                                src={`https://maps.google.com/maps?q=${contact.lat},${contact.lon}&z=15&output=embed`}
                                                width="100%"
                                                height="350"
                                                style={{ border: 0 }}
                                                allowFullScreen
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                                title="BZIndia on Google Maps"
                                            />
                                        )}
                                    </div>
                                </div>         
                            </div>
                        ))}          
                    </div>
                </>
                :
                <>
                    <ul className="resp-tabs-list">
                    <li>Bangalore, Karnataka</li>
                    <li>Malappuram, Kerala</li>
                    </ul>
                    <div className="resp-tabs-container">              
                        <div>            
                            <div className="row">
                                <div className="col-md-6 contact_page_style">
                                    <h4>BZIndia, Bangalore, Karnataka</h4>
                                    <p>No. 1419, 3rd Floor<br/>
                                    5th Main, 20th Cross, 7th Sector<br/>
                                    H.S.R Layout Bangalore – 560102</p>
                                    
                                    <p style={{lineHeight: "30px"}}>Tel: <a href="tel:+910000000000">+910000000000</a><br/>
                                    Mob: <a href="tel:+910000000000">+910000000000</a><br/>
                                    E-Mail: <a href="mailto:info@abcd.com">info@abcd.com</a><br/>
                                    Web: <a href="https://www.abcd.com">www.abcd.com</a></p>
                                </div>
                                <div className="col-md-6">
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.9575625389684!2d77.63027371413462!3d12.910449119711949!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1492e8b7a497%3A0xbab8b1fc5bd188f7!2s5th%20Main%20Rd%20%26%2020th%20Cross%20Rd%2C%20Sector%207%2C%20HSR%20Layout%2C%20Bengaluru%2C%20Karnataka%20560102!5e0!3m2!1sen!2sin!4v1667097937438!5m2!1sen!2sin" height="350" style={{border:"0", width: "100%"}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                                </div>
                            </div>         
                        </div>

                        <div>        
                            <div className="row">
                                <div className="col-md-6 contact_page_style">
                                    <h4>BZIndia, Malappuram, Kerala</h4>
                                    <p>32/437/1<br/>
                                        Ooty Road, Perinthalmanna<br/>
                                        Malappuram, Kerala, 679322</p>

                                        <p style={{lineHeight: "30px"}}>Tel: <a href="tel:+910000000000">+910000000000</a><br/>
                                        Mob: <a href="tel:+910000000000">+910000000000</a><br/>
                                        E-Mail: <a href="mailto:info@abcd.com">info@abcd.com</a><br/>
                                        Web: <a href="https://www.abcd.com">www.abcd.com</a></p>
                                </div>
                                <div className="col-md-6">
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.7885988968105!2d76.21788121483743!3d10.979323237101797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7cd03c0d24f8f%3A0xfc10084f392a7bb7!2sW3%20Digital%20Marketing%20Agency!5e0!3m2!1sen!2sin!4v1667097988675!5m2!1sen!2sin" height="350" style={{border:"0", width: "100%"}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                                </div>
                            </div>         
                
                        </div>                  
                    </div>
                </>
                }

                </div>
            </div>
        </div>



        {statesLoading?
        <Loading/>
        :
        <form className="inner_contact_form" method="#" action="post" onSubmit={handleFormSubmit}>
              <h2>Get a Callback</h2>
              <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
              <div className="row">
      
                  <div className="col-md-6">
                      <div className="form-group">
                          <input id="name" name="name" type="text" placeholder="Name" className="validate form-control" value={formData?.name || ''} onChange={handleChange} required/>
                          <span className="input-focus-effect theme-bg"></span>
                      </div>
                  </div>

                  <div className="col-md-6">
                      <div className="form-group">
                          <input id="mobile" name="phone" type="text" placeholder="Contact No." className="validate form-control" value={formData?.phone || ''} onChange={handleChange} required/>
                          <span className="input-focus-effect theme-bg"></span>
                      </div>
                  </div>

                  <div className="col-md-6">
                      <div className="form-group">
                          <input id="email" type="email" placeholder="Email" name="email" className="validate form-control" value={formData?.email || ''} onChange={handleChange} required/>
                          <span className="input-focus-effect theme-bg"></span>
                      </div>
                  </div>

                  <div className="col-md-6">
                      <div className="form-group">
                          <select className="country bg-white text-dark" name="state" value={formData?.state || ''} onChange={handleChange} required>
                              <option value="" disabled hidden>-- Select State --</option>
                                {states? states.map((state) => (
                                    <option key={state.slug} value={state.slug}>{state.name}</option>
                                )):[]}          
                          
                            {/*  Add more options as needed */}
                          </select>
                          <span className="input-focus-effect theme-bg"></span>
                      </div>
                  </div>
      
                  <div className="col-md-12">
                      <div className="form-group">
                          <textarea placeholder="Your Comment" name="comment" className="form-control" value={formData.comment || ''} onChange={handleChange} required></textarea>
                          <span className="input-focus-effect theme-bg"></span>
                      </div>
                  </div>

                  <div className="col-md-12">
                      <div className="send">
                          <button className="primary_button" type="submit">SUBMIT</button>
                      </div>
                  </div>
              </div>
          </form>
        }
          </div>
      </section>              
    </>
  )
}

export default BzIndiaContactForm