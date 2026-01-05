import React from 'react'
import Sidebar from './Sidebar'
import product from '../../lib/api/product'

const OrderDetail = ({user, order}) => {
    const handleDownloadInvoice = async() => {
        if (!order?.slug) return;

        try {
            const response = await product.downloadInvoice(order?.slug);            

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.download = `invoice_${order?.slug}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(err);
        }
    }
  return (
    <>
        <section>
   
            <div className="orders-page-wrapper">
            <div className="orders-layout">

                {/*  */}
                {/* Sidebar */}
                <Sidebar user={user} />

                {/* Main */}
                <main className="orders-main">
                <div className="order-details-card">

                    {/* HEADER */}
                    <div className="od-header">
                        <h2>Order Details</h2>
                        <span className="od-status od-status-success">{order.status}</span>
                    </div>

                    {/* BASIC INFO */}
                    <div className="od-info">
                        <div>
                            <span className="od-label">Order ID</span>
                            <span className="od-value">#{order?.order_id}</span>
                        </div>
                        <div>
                            <span className="od-label">Order Date</span>
                            <span className="od-value">{order?.ordered_date}</span>
                        </div>
                        <div>
                            <span className="od-label">Payment Method</span>
                            <span className="od-value">{order?.payment_method}</span>
                        </div>
                        <div>
                            <span className="od-label">Payment Status</span>
                            <span className="od-value od-paid">{order?.status}</span>
                        </div>
                    </div>

                    {/* ITEMS */}
                    <div className="od-items">
                    <h3>Items</h3>

                    {order?.items?.map((item, index) => (
                        <div className="od-item-row" key={index+1}>
                            <div className="od-item-info">
                            <img src={item.product_image} alt={item.product}/>
                            <div>
                                <h4>{item.product}</h4>
                                <p>Qty: {item.quantity || 0} • {item.color || ""}</p>
                            </div>
                            </div>
                            <span className="od-price">₹{item.product_price || "0.00"}</span>
                        </div>
                    ))}
                    

                    </div>

                    {/* PRICE SUMMARY */}
                    <div className="od-summary">
                        <h3>Price Summary</h3>

                        <div className="od-summary-row">
                            <span>Subtotal</span>
                            <span>₹{order?.total_amount || "0.00"}</span>
                        </div>

                        <div className="od-summary-row">
                            <span>GST</span>
                            <span>₹0.00</span>
                        </div>

                        <div className="od-summary-row">
                            <span>Delivery Charges</span>
                            <span>₹0.00</span>
                        </div>

                        <div className="od-summary-row od-total">
                            <span>Total Paid</span>
                            <span>₹{order?.total_amount || "0.00"}</span>
                        </div>
                    </div>

                    {/* ADDRESS */}
                    <div className="od-address">
                        <h3>Billing / Contact</h3>
                        <p>
                            {order?.address?.full_name}<br/>
                            {order?.address?.partial_address},<br/>
                            {order?.address?.city} - {order?.address?.pincode}, {order?.address?.state}, India<br/>
                            Phone: +91 {order?.address?.phone}
                        </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="od-actions">
                    <button type="button" className="od-btn od-btn-primary" onClick={() => handleDownloadInvoice()}>Download Invoice</button>
                    <a href="tel:+919845272560" className="od-btn od-btn-outline text-center">Contact Support</a>
                    </div>

                </div>
                </main>

            </div>
            </div>
            </section>
    </>
  )
}

export default OrderDetail