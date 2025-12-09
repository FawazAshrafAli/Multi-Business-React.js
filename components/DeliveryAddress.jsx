import React, { useContext, useEffect, useState } from 'react'
import AuthContext from './context/AuthContext'
import product from '../lib/api/product';
import Cookies from 'js-cookie';
import Message from './common/Message';
import Loading from './Loading';
import { useDebounce } from '../hooks/useDebounce';
import Link from 'next/link';

const DeliveryAddress = () => {
    const {user} = useContext(AuthContext);
    
    const [message, setMessage] = useState();
    const [messageClass, setMessageClass] = useState();

    const [formData, setFormData] = useState({"address_type": "Home"});
    const [addresses, setAddresses] = useState();
    const [addressesLoading, setAddressesLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchAddresses = async() => {
            try {
                const response = await product.getDeliveryAddresses(user?.id);
                setAddresses(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setAddressesLoading(false);
            }
        }

        fetchAddresses();
    }, [user]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
                setMessageClass("");
            }, 5000);
    
            return () => clearTimeout(timer);
        }
    }, [message]);    

    const handleChange = (e) => {
        e.preventDefault();

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })        
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        const csrfToken = Cookies.get("csrftoken");

        try {
            const response = await product.addDeliveryAddress(
                {...formData},
                {
                    headers: {
                        "X-CSRFToken": csrfToken,
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            )

            const { success, message, new_address } = response?.data || {};

            if (new_address) {
                setAddresses(prev => [
                    new_address,
                    ...prev
                ])
            }

            setMessageClass(success ? "bg-success" : "bg-danger");
            setMessage(message);

            if (success) {
                setFormData({"address_type": "Home"});
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
    }

    const handleRemove = async (e, addressName, addressSlug) => {
        e.preventDefault();

        if (!addressSlug) return;

        const ok = window.confirm(`Are you sure you want to remove address: ${addressName}?`);
        if (!ok) return;

        try {
            const response = await product.removeDeliveryAddress(addressSlug);

            const { success, message, new_checked_address_slug } = response?.data || {};

            console.log(new_checked_address_slug)

            setAddresses(prev =>
                prev
                    .filter(addr => addr.slug !== addressSlug)
                    .map(addr => 
                        addr.slug === new_checked_address_slug ? 
                            { ...addr, is_default: true }: { ...addr, is_default: false }                
                    )
            );
            setMessageClass(success ? "bg-success" : "bg-danger");
            setMessage(message);

        } catch (err) {
            console.error("Submission failed:", err);

            const responseData = err.response?.data;
            setMessageClass("bg-danger");

            if (responseData?.errors) {
                console.error("Validation details:", responseData.errors);
            }

            setMessage(responseData?.message || "Something went wrong.");
        }
    };

    const handleCheckedAddress = useDebounce((e, addressSlug) => {
        e.preventDefault();
        setCheckedAddress(addressSlug);
    });

    const setCheckedAddress = async(addressSlug) => {        
        const csrfToken = Cookies.get('csrftoken');

        try {
            const response = await product.setDefaultAddress(
                addressSlug,                
                {
                    headers: {
                        "X-CSRFToken": csrfToken,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            setAddresses(prev =>
                prev.map(address =>
                    address.slug === addressSlug ? { ...address, is_default: true } : { ...address, is_default: false }
                )
            );
        } catch (err) {
            console.error("Submission failed:", err);

            const responseData = err.response?.data;
            setMessageClass("bg-danger");

            if (responseData?.errors) {
                console.error("Validation details:", responseData.errors);
            }

            setMessage(responseData?.message || "Something went wrong.");
        }
    }

  return (
    <>
        {message&&
            <Message message={message} messageClass={messageClass} />
        }
        <section id="bzCart">
            {/* Progress */}
            <div className="cart-progress">
                <span className="cart-step active">1. LOGIN</span>
                <span className="cart-step active">2. CART</span>
                <span className="cart-step active">3. ADDRESS</span>
                <span className="cart-step">4. CONFIRM & PAY</span>
            </div>

            <div className="cart-container">
            <div className="grid cols-2">
                {/* Left: Address form & saved addresses */}
                <form className="card" onSubmit={(e) => handleSubmit(e)}>
                    <div className="hd"><h2>Add Delivery Address</h2></div>
                    <div className="bd">
                        <div className="form-grid">
                        <div>
                            <label>Full Name</label>
                            <input className="input" name="full_name" value={formData?.full_name || ""} onChange={(e) => handleChange(e)} placeholder="Your name" required />
                        </div>
                        <div>
                            <label>Phone</label>
                            <input className="input" name="phone" value={formData?.phone || ""} onChange={(e) => handleChange(e)} placeholder="+91 9XXXXXXXXX" required />
                        </div>

                        <div className="row2">
                            <div>
                            <label>House / Flat / Building</label>
                            <input className="input" name="building" value={formData?.building || ""} onChange={(e) => handleChange(e)} placeholder="Flat 12B, Rose Residency" required />
                            </div>
                            <div>
                            <label>Area / Street</label>
                            <input className="input" name="street" value={formData?.street || ""} onChange={(e) => handleChange(e)} placeholder="MG Road, Near Metro Gate" required />
                            </div>
                        </div>

                        <div>
                            <label>Landmark (optional)</label>
                            <input className="input" name="landmark" value={formData?.landmark || ""} onChange={(e) => handleChange(e)} placeholder="Opposite City Mall"/>
                        </div>

                        <div className="row2">
                            <div>
                            <label>City</label>
                            <input className="input" name="city" value={formData?.city || ""} onChange={(e) => handleChange(e)} placeholder="Bengaluru" required/>
                            </div>
                            <div>
                            <label>State</label>
                            <input className="input" name="state" value={formData?.state || ""} onChange={(e) => handleChange(e)} placeholder="Karnataka" required/>
                            </div>
                        </div>

                        <div className="row2">
                            <div>
                            <label>Pincode</label>
                            <input className="input" name="pincode" value={formData?.pincode || ""} onChange={(e) => handleChange(e)} placeholder="560001" required/>
                            </div>
                            <div>
                            <label>Address Type</label>
                            <select className="input" name="address_type" value={formData?.address_type || "Home"} onChange={(e) => handleChange(e)} required>
                                <option value={"Home"}>Home</option>
                                <option value={"Office"}>Office</option>
                                <option value={"Other"}>Other</option>
                            </select>
                            </div>
                        </div>
                        </div>
                        <p className="help" style={{marginTop:"8px"}}>We’ll share order updates on your phone & email.</p>
                    </div>
                    <div className="ft">
                        <button className="btn primary" type="submit">Save & Continue</button>
                    </div>
                </form>

                {/* Right: Saved addresses + order summary quick */}
                <aside className="card">
                <div className="hd"><h2>Saved Addresses</h2></div>
                <div className="bd">
                    <div className="addr-list">
                        {addressesLoading? <Loading/> 
                        :    
                        addresses?.map((address, index) => {                            

                            const fullAddress = [address.building, address.street, address.landmark, address.city].filter(Boolean)?.join(", ");                            
                            // const isDefault = checkedAddress !== null 
                            // ? checkedAddress === index 
                            // : address.is_default;

                            return(
                                <label className="addr" key={address.slug?? index + 1}>
                                    <input type="radio" name="addr" value={index} checked={address.is_default} onChange={(e) => handleCheckedAddress(e, address.slug)}/>
                                        <div className="meta">
                                        <div><strong>{address.full_name}</strong> <span className="tag">{address.address_type}</span></div>
                                        <div>{fullAddress} – {address.pincode}</div>
                                        <div className="help">+91 {address.phone}</div>
                                        {/* <a href="#">Edit</a> */}
                                        <a href="#" onClick={(e) => handleRemove(e, address.full_name, address.slug)}>Remove</a>
                                    </div>
                                </label>
                            )
                        })
                        }
                    
                    </div>
                </div>
                {(addresses?.length > 0) &&
                    <div className="ft">
                        <Link href="/confirm-pay" className="btn ghost full">Deliver to this address</Link>
                    </div>
                }
                </aside>
            </div>
            </div>

            </section>

            
    </>
  )
}

export default DeliveryAddress