import React, { useEffect, useState } from 'react'
import useEnquiryForm from '../../../hooks/useProductEnquiry';

import location from '../../../lib/api/location';
import product from '../../../lib/api/product';


const EnquiryForm = ({company, setMessage, setMessageClass}) => {
    const [states, setStates] = useState();
    const [statesLoading, setStatesLoading] = useState(false);
    const [statesError, setStatesError] = useState(null);

    const [products, setProducts] = useState();
    const [productsLoading, setProductsLoading] = useState(false);
    const [productsError, setProductsError] = useState(null);    

    

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

    // Products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await product.getProducts(company?.slug);
                setProducts(response.data);
            } catch (err) {
                setProductsError(err);
            } finally {
                setProductsLoading(false);
            }
        };

        fetchProducts();
        
    }, [company]);

    const errors = [statesError, productsError];

    errors.map(error => {
        if (error) {
            console.error(error);
        }
    });

  return (
    <>
        <div className="regstrtn-faq-space"  >
            <div className="faq-form-section">
                <h2>Get A Quote</h2>
                <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                <form action="#" method="post" onSubmit={handleFormSubmit}>
                    <input type="text" name="name" placeholder="Your Name:" value={formData?.name || ''} onChange={handleChange} required/><br/>
                    <input type="tel" name="phone" placeholder="Phone Number:" value={formData?.phone || ''} onChange={handleChange} pattern="^[^A-Za-z]*$" title="Phone number must not contain letters." required /><br/>
                    <input type="email" name="email" placeholder="E-Mail Address:" value={formData?.email || ''} onChange={handleChange} required/><br/>
                    <select className="country" name="product" value={formData?.product || ''} onChange={handleChange} required>
                        <option value="" disabled hidden>-- Select Product --</option>
                        {productsLoading? <option value="" disabled>Loading . . .</option> :
                        products?.map((product) => <option key={product.slug} value={product.slug}>{product.name}</option>)
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