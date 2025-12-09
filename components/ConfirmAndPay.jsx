import React, { useContext, useEffect, useState } from 'react'
import AuthContext from './context/AuthContext';
import product from '../lib/api/product';
import Link from 'next/link';
import Loading from './Loading';
import Cookies from 'js-cookie';
import Message from './common/Message';
import { useRouter } from 'next/router';

const ConfirmAndPay = () => {
    const {user} = useContext(AuthContext);

    const router = useRouter();

    const [cartSummary, setCartSummary] = useState();
    const [cartSummaryLoading, setCartSummaryLoading] = useState(true);

    const [message, setMessage] = useState();
    const [messageClass, setMessageClass] = useState();

    const [paymentMethod, setPaymentMethod] = useState("UPI / QR"); 
    
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
        setPaymentMethod(e.target.value);
    }

    useEffect(() => {
        if (!user) return;

        const fetchCartSummary = async() => {
            try {
                const response = await product.getCartSummary(user?.username);
                setCartSummary(response.data);

            } catch (err) {
                console.error(err);
            } finally {
                setCartSummaryLoading(false);
            }
        }

        fetchCartSummary();
    }, [user]);

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (!user) return;

        const csrfToken = Cookies.get('csrftoken');

        try {
            const response = await product.placeOrderAndPay(
                {
                    "payment_method": paymentMethod},
                {
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );
            
            const {success, message, order_slug} = response.data || {};

            
            if (success) {
                setMessageClass(success ? "bg-success" : "bg-danger");
                setMessage(message);

                setPaymentMethod("UPI / QR");
                router.push(`/success`)
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
                <span className="cart-step active">4. CONFIRM & PAY</span>
            </div>
            
            <div className="container"  style={{padding:"30px 0"}}>
            <div className="grid cols-2">
                {/* Left: Payment methods */}
                <form className="card" onSubmit={(e) => handleSubmit(e)}>
                <div className="hd"><h2>Payment Method</h2></div>
                <div className="bd">
                    <div className="pay-methods">
                    <label className="pay">
                        <input type="radio" name="pay" value="UPI / QR" checked={paymentMethod === "UPI / QR"? true : false} onChange={(e) => handleChange(e)}/>
                        <div>
                        <div className="ttl">UPI / QR</div>
                        <div className="help">Pay using any UPI app. Instant confirmation.</div>
                        </div>
                    </label>

                    <label className="pay">
                        <input type="radio" name="pay" value="Credit / Debit Card" onChange={(e) => handleChange(e)}/>
                        <div>
                        <div className="ttl">Credit / Debit Card <span className="badge">Secure</span></div>
                        <div className="help">Visa, MasterCard, RuPay, Amex</div>
                        </div>
                    </label>

                    <label className="pay">
                        <input type="radio" name="pay" value="Netbanking" onChange={(e) => handleChange(e)} />
                        <div>
                        <div className="ttl">Netbanking</div>
                        <div className="help">All major Indian banks supported</div>
                        </div>
                    </label>

                    <label className="pay">
                        <input type="radio" name="pay" value="Cash on Delivery" onChange={(e) => handleChange(e)} />
                        <div>
                        <div className="ttl">Cash on Delivery</div>
                        <div className="help">Pay in cash/card at delivery (₹50 COD fee)</div>
                        </div>
                    </label>
                    </div>

                    <div style={{marginTop:"16px"}} className="coupon">
                    <input className="input" placeholder="Have a coupon? Enter code" />
                    <button className="btn ghost">Apply</button>
                    </div>
                </div>
                <div className="ft">
                    <button className="btn success" type="submit">Place Order & Pay</button>
                </div>
                </form>

                {/* Right: Order Summary */}
                <aside className="card">
                <div className="hd"><h2>Order Summary</h2></div>
                <div className="bd">
                    {cartSummaryLoading? <Loading/> 
                    :
                    <ul className="summary" style={{listStyle:"none", margin:"0", padding:"0"}}>
                        <li><span>Items ({cartSummary?.item_count})</span><strong>₹{cartSummary?.total || 0}</strong></li>
                        <li><span>GST</span><strong>₹0.00</strong></li>
                        <li><span>Delivery</span><strong>₹0.00</strong></li>
                        <li><span>Round Off</span><strong>₹0.00</strong></li>
                        <li className="total"><span>Total Amount</span><span>₹{cartSummary?.total || 0}</span></li>
                    </ul>
                    }
                    <p className="help" style={{marginTop:"8px"}}>* Freight charges are extra if applicable and will be informed by the seller.</p>
                </div>
                <div className="ft">
                    <Link className="btn ghost full" href="/delivery-address">Back to Address</Link>
                </div>
                </aside>
            </div>
            </div>
            

            </section>
    </>
  )
}

export default ConfirmAndPay