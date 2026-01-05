import React, { useContext, useEffect, useState } from 'react'
import NearestLocationContext from '../context/NearesLocationContext';
import Sidebar from './Sidebar';

const OrderSuccess = ({user, recentOrder}) => {    
    const {nearestLocation} = useContext(NearestLocationContext);

    const [passingLocationSlug, setPassingLocationSlug] = useState('delhi');
    
    useEffect(() => {
        if (!nearestLocation?.district?.slug) return;

        setPassingLocationSlug(nearestLocation?.district?.slug)

    }, [nearestLocation]);
    

  return (
    <>
        <section>
            <div className="orders-page-wrapper">
            <div className="orders-layout">

                {/* Sidebar */}
                <Sidebar user={user}/>

                {/* Main */}
                <main className="orders-main">

                <div className="order-success-card">

                    {/* Icon + Title */}
                    <div className="os-header">
                    <div className="os-icon">
                        <span>&#10003;</span>
                    </div>
                    <div>
                        <h2>Order Placed Successfully!</h2>
                        <p>Your order has been confirmed. We’ve sent the details to your registered email and mobile number.</p>
                    </div>
                    </div>

                    {/* Order Basic Info */}
                    <div className="os-main">
                    <div className="os-row">
                        <div>
                        <span className="os-label">Order ID</span>
                        <span className="os-value">#{recentOrder?.order_id}</span>
                        </div>
                        <div>
                        <span className="os-label">Order Date</span>
                        <span className="os-value">{recentOrder?.ordered_date}</span>
                        </div>
                    </div>

                    <div className="os-row">
                        <div>
                        <span className="os-label">Customer</span>
                        <span className="os-value">{recentOrder?.username}</span>
                        </div>
                        <div>
                        <span className="os-label">Payment Method</span>
                        <span className="os-value">{recentOrder?.payment_method}</span>
                        </div>
                    </div>

                    <div className="os-summary">
                        <h3>Order Summary</h3>
                        <div className="os-summary-row">
                        <span>Items ({recentOrder?.items_count || 0})</span>
                        <span>₹{recentOrder?.total_amount || 0}</span>
                        </div>
                        <div className="os-summary-row">
                        <span>GST</span>
                        <span>₹0.00</span>
                        </div>
                        <div className="os-summary-row">
                        <span>Delivery</span>
                        <span>₹0.00</span>
                        </div>
                        <div className="os-summary-row os-total">
                        <span>Total Amount</span>
                        <span>₹{recentOrder?.total_amount || 0}</span>
                        </div>
                        <p className="os-note">* Freight charges, if applicable, will be informed by the seller.</p>
                    </div>

                    {/* Address Block (optional) */}
                    <div className="os-address">
                        <h3>Billing / Contact</h3>
                        <p>
                        {recentOrder?.address?.full_name}<br/>
                        {recentOrder?.address?.partial_address},<br/>
                        {recentOrder?.address?.city} - {recentOrder?.address?.pincode}, {recentOrder?.address?.state}, India<br/>
                        Phone: +91 {recentOrder?.address?.phone}
                        </p>
                    </div>
                    </div>

                    {/* Buttons */}
                    <div className="os-actions">
                    <a className="os-btn os-btn-primary" href={`/${passingLocationSlug}/more-products`}>Continue Shopping</a>
                    <a className="os-btn os-btn-outline" href={`/orders/${recentOrder?.slug}`}>View Order Details</a>
                    </div>

                </div>

                </main>

            </div>
            </div>

            </section>
    </>
  )
}

export default OrderSuccess