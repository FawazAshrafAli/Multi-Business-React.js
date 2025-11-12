import React, { useEffect, useState } from 'react'
import course from '../../lib/api/course';
import service from '../../lib/api/service';
import registration from '../../lib/api/registration';
import product from '../../lib/api/product';
import Cookies from 'js-cookie';
import company from '../../lib/api/company';
import location from '../../lib/api/location';
import enquiry from '../../lib/api/enquiry';

const GeneralEnquiryForm = ({setMessage, setMessageClass}) => {
    const [clusterCompanies, setClusterCompanies] = useState();
    const [selectedEnquiryType, setSelectedEnquiryType] = useState();
    const [items, setItems] = useState();
    const [states, setStates] = useState([]);
    const [enquiryFormData, setEnquiryFormData] = useState({});

    const handleEnquiryFormChange = (e) => {
      e.preventDefault();

      setEnquiryFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }))
    }

    const handleEnquirySubmit = async (e) => {
        e.preventDefault();

        const csrfToken = Cookies.get('csrftoken');

        try {
        const payload = {...enquiryFormData};
        const config = {
            headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
            },
            withCredentials: true
        }

        const response = await enquiry.postEnquiry(payload, config)

        const { success, message } = response.data || {};

        setMessageClass(success?"bg-success":"bg-danger");
        setMessage(message);

        if (success) {
            setEnquiryFormData({});
            setSelectedEnquiryType(null);
        }
        } catch (err) {
        console.error(err)
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

    const fetchClusterCompanies = async(companyType) => {
        try {
            const response = await company.getMinimalCompanies(companyType, 5);

            setClusterCompanies(response.data?.map(company => (
                {"name": company.name, "slug": company.slug, "sub_type": company.sub_type}
            )))
        } catch (err) {
            console.error(`Error fetching ${companyType.toLowerCase()} companies:`, err);
        }
    };

    const handleTypeChange = async (e) => {
        const value = e.target.value;

        setClusterCompanies([]);
        setItems([]);
        
        handleEnquiryFormChange(e);

        setEnquiryFormData(prev => ({
        ...prev,
        "company_sub_type": "",
        "item": ""
        }))

        setSelectedEnquiryType(value);
        fetchClusterCompanies(value);
    }

    const enquiryTypes = [
        "Education", "Product", "Service", "Registration"
    ]

    const fetchItems = async (companySlug) => {
        const functions = {
        "Education": course.getCourses,
        "Service": service.getServices,
        "Registration": registration.getRegistrations,
        "Product": product.getProducts
        }


        try {
        const fetchFunction = functions[`${selectedEnquiryType}`];

        if (!fetchFunction) return;

        const response = await fetchFunction(companySlug);
        setItems(response.data);
        } catch (err) {
        console.error(err);
        }
    }

    const handleCompanyChange = async (e) => {
        const companySlug = e.target.value;

        setItems([]);

        const company = clusterCompanies?.filter(subType => subType.slug == e.target.value)?.[0];

        setEnquiryFormData(prev => ({
        ...prev,
        "company_sub_type": company?.sub_type,
        "company_sub_type_slug": company?.slug,
        "item": ""
        }))

        fetchItems(companySlug);
    }

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const responce = await location.getMinimalStates();
                setStates(responce.data)
            } catch (err) {
                console.error(err);
            }
        };

        if (states?.length == 0) {
            fetchStates();
        } 

    }, [states]);

  return (
    <>
        <form action="#" method="post" onSubmit={(e) => handleEnquirySubmit(e)}>
            <input type="text" name="name" placeholder="Your Name:" value={enquiryFormData?.name || ""} onChange={(e) => handleEnquiryFormChange(e)} required/><br/>
            <input type="tel" name="phone" placeholder="Phone Number:" value={enquiryFormData?.phone || ""} onChange={(e) => handleEnquiryFormChange(e)} required/><br/>
            <input type="email" name="email" placeholder="E-Mail Address:" value={enquiryFormData?.email || ""} onChange={(e) => handleEnquiryFormChange(e)} required/><br/>
            <select className="country" value={enquiryFormData?.service_type || ""} name="service_type" onChange={(e) => handleTypeChange(e)} required>
                <option value="" disabled hidden>-- Select Services --</option>
                {enquiryTypes?.map((type, index) => <option key={type || index + 1} value={type}>{type}</option>)}                    

            </select><br/>
            
            <select className="country" value={enquiryFormData?.company_sub_type_slug || ""} name="company_sub_type" onChange={(e) => handleCompanyChange(e)} required>
                <option value="" disabled hidden>-- Select Type --</option>
                {clusterCompanies?.map((company, index) => <option key={company?.slug || index + 1} value={company?.slug}>{company?.sub_type}</option>)}                    

            </select><br/>
            
            <select className="country" value={enquiryFormData?.item || ""} name="item" onChange={(e) => handleEnquiryFormChange(e)} required>
                <option value="" disabled hidden>-- Select {selectedEnquiryType || "Item"} --</option>
                {items?.map((item, index) => <option key={item?.slug + index + 1} value={item?.name || item?.title}>{item?.name || item?.title}</option>)}                    
            </select><br/>

            <select className="country" value={enquiryFormData?.state || ""} name="state" onChange={(e) => handleEnquiryFormChange(e)} required>
                <option value="" disabled hidden>-- Select State --</option>

            {states?.map((state, index) => <option key={state?.slug + index + 1} value={state?.slug}>{state?.name}</option>)}
            
            {/* Add more options as needed */}
            </select><br/>

            <textarea name="comment" rows="4" placeholder="Requirements:" cols="50" onChange={(e) => handleEnquiryFormChange(e)} value={enquiryFormData?.comment || ""} required></textarea><br/>
            <div className="frm-btn-sctn">
            <div>
                <button className="primary_button" role="button" type="submit">SUBMIT</button>
            </div>
            </div>
        </form>
    </>
  )
}

export default GeneralEnquiryForm