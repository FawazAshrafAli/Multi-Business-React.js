import React, { useEffect, useState, useContext } from 'react'

import Link from 'next/link';
import { useParams } from 'next/navigation';
import Cookies from 'js-cookie'

import AOS from 'aos';
import 'aos/dist/aos.css';

import LogoContext from './context/LogoContext';
import TitleContext from './context/TitleContext';
import PhoneNumberContext from './context/PhoneNumberContext';

import Message from './common/Message';
import location from '../lib/api/location';
import company from '../lib/api/company';

import Loading from './Loading';

import $ from 'jquery';
import '/public/easy-responsive-tabs';
import BlogContext from './context/BlogContext';
import AutoPopUp from './common/AutoPopUp';

const ContactForm = () => {
    const { slug } = useParams();

    const [message, setMessage] = useState();
    const [messageClass, setMessageClass] = useState();

    const [currentCompany, setCurrentCompany] = useState();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const { setLogo, resetLogo } = useContext(LogoContext)
    const { setTitle, resetTitle } = useContext(TitleContext)
    const { setPhoneNumber, resetPhoneNumber } = useContext(PhoneNumberContext)
    
    const [states, setStates] = useState();
    const [statesLoading, setStatesLoading] = useState(true);
    const [statesError, setStatesError] = useState(null);

    const [contactUs, setContactUs] = useState();
    const [contactUsError, setContactUsError] = useState(null);
    const [contactUsLoading, setContactUsLoading] = useState(true);    

    const [formData, setFormData] = useState({});

    const { setBlogs, resetBlogs } = useContext(BlogContext);

    
    
            
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

            const response = await company.postEnquiry(
                payload,
                {
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                },
                slug || ""
            );

            const { success, message } = response?.data || {};

            setMessageClass(success ? "bg-success" : "bg-danger");
            setMessage(message);

            if (success) {
                setFormData({});
            }

        } catch (err) {
            console.error("Submission failed:", err);

            const responseData = err.response?.data;
            setMessageClass("bg-danger");

            if (responseData?.errors) {
                console.error("Validation details:", responseData.errors);
            }

            setMessage(responseData?.message || "Something went wrong.");
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
        const fetchCurrentCompany = async() => {
            try {
                const response = await company.getCompany(slug);
                setCurrentCompany(response.data); 
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        const fetchContactUs = async() => {
            try {
                const response = await company.getContactUs(slug);
                setContactUs(response.data);                
            } catch (err) {
                setContactUsError(err);
            } finally {
                setContactUsLoading(false);
            }
        }

        fetchCurrentCompany();
        fetchContactUs();
    }, [slug]);

    useEffect(() => {
        if (!loading && currentCompany) {
        const { logo_url, meta_title, phone1, phone2, blogs } = currentCompany;
    
        if (logo_url) setLogo(logo_url);
        if (meta_title) setTitle(meta_title);
    
        const phones = [phone1, phone2].filter(Boolean).join(' - ');
        if (phones) setPhoneNumber(phones);

        setBlogs(blogs);
        }
    
        return () => {
        resetLogo();
        resetTitle();
        resetPhoneNumber();
        resetBlogs();
        };
    }, [loading, currentCompany]);    

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
        if (!contactUs) return;

        if ($.fn.easyResponsiveTabs) {
        $('#verticalTab').easyResponsiveTabs({
            type: 'vertical',
            width: 'auto',
            fit: true
        });
        } else {
        console.warn('easyResponsiveTabs is not loaded properly');
        }
    }, [contactUs]);         

    if (statesError) {
        console.error(statesError);
    }

    if (contactUsError) {
        console.error(contactUsError);
    }

    if (error) {
        console.error(error);
    }

    useEffect(() => {
        AOS.init({
            once: true,
        });
        }, []);

    if (error) {
        console.error(error)
    }

  return (      
        <>   
        <AutoPopUp currentCompany={currentCompany} setMessage={setMessage} setMessageClass={setMessageClass}/>
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
                                            <span><Link href={`/${slug}`} className='breadcrumb-nav' >{currentCompany?.sub_type}</Link></span> »
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
                            <ul className="resp-tabs-list">
                                {contactUs?.map((contact, index) => <li key={contact.slug || index + 1}>{contact?.district_name}, {contact?.state_name}</li>)}                                
                            </ul>
                            <div className="resp-tabs-container">              
                                {contactUs?.map((contact, index) => (
                                <div key={contact.slug || index}> 

                                        <div className="row">
                                            <div className="col-md-6 contact_page_style">
                                                <h4>{currentCompany?.name} <br/>{contact?.district_name}, {contact?.state_name}</h4>
                                                
                                                <p>{contact?.address} – {contact?.pincode}
                                                </p>
                                                
                                                <p style={{lineHeight: "30px"}} >Tel: <Link href={`tel:${contact?.tel}`}>{contact?.tel}</Link><br/>                                                
                                                Mob: <Link href={`tel:${contact.mobile}`}>{contact.mobile}</Link><br/>
                                                E-Mail: <Link href={`mailto:${contact?.email}`}>{contact?.email}</Link><br/>
                                                {contact?.web && <>Web: <Link href={contact.web || "#"}>{contact.web}</Link></> }                                               
                                                </p>
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
                                                title={`${currentCompany?.name || "Our company"} on Google Maps`}
                                            />
                                            )}                              
                                            </div>
                                        </div>         
                                </div>
                                ))}
                            <div>            
                        </div>
                        
                    </div>
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
                                <input id="mobile" name="phone" type="text" placeholder="Contact No." className="validate form-control" value={formData?.phone || ''} onChange={handleChange} pattern="^[^A-Za-z]*$" title="Phone number must not contain letters." required/>
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
                                <textarea placeholder="Your Comment" name="message" className="form-control" value={formData?.message || ''} onChange={handleChange} required></textarea>
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

export default ContactForm