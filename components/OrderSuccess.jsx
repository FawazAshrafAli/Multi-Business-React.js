import React, { useEffect, useState } from 'react'
import styles from './order.module.css';
import product from '../lib/api/product';

const OrderSuccess = ({user}) => {
    const [recentOrder, setRecentOrder] = useState();
    const [recentOrderLoading, setRecentOrderLoading] = useState(true);

    console.log(recentOrder)

    useEffect(() => {
        if (!user) return;

        const fetchRecentOrder = async () => {
            try {
                const response = await product.getRecentOrder();
                setRecentOrder(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setRecentOrderLoading(false);
            }
        }

        fetchRecentOrder();
    }, [user]);
  return (
    <>
        <section>
            <div className={styles["orders-page-wrapper"]}>
            <div className={styles["orders-layout"]}>

                {/* Sidebar */}
                <aside className={styles["orders-sidebar"]}>
                <div className={styles["osb-user"]}>
                    <div className={styles["osb-avatar"]}>{user?.username?.toUpperCase()?.slice(0,1)}</div>
                    <div>
                    <h3>{user?.username}</h3>
                    <p>{user?.email}</p>
                    </div>
                </div>

                <nav className={styles["osb-menu"]}>
                    <a href="orders-list.html">My Orders</a>
                    <a href="#">Address</a>
                    <a href="#">Profile</a>
                    <a href="#">Billing</a>
                    <a href="#" className={styles["logout"]}>Logout</a>
                </nav>
                </aside>

                {/* Main */}
                <main className={styles["orders-main"]}>

                <div className={styles["order-success-card"]}>

                    {/* Icon + Title */}
                    <div className={styles["os-header"]}>
                    <div className={styles["os-icon"]}>
                        <span>&#10003;</span>
                    </div>
                    <div>
                        <h2>Order Placed Successfully!</h2>
                        <p>Your order has been confirmed. We’ve sent the details to your registered email and mobile number.</p>
                    </div>
                    </div>

                    {/* Order Basic Info */}
                    <div className={styles["os-main"]}>
                    <div className={styles["os-row"]}>
                        <div>
                        <span className={styles["os-label"]}>Order ID</span>
                        <span className={styles["os-value"]}>#{recentOrder?.order_id}</span>
                        </div>
                        <div>
                        <span className={styles["os-label"]}>Order Date</span>
                        <span className={styles["os-value"]}>{recentOrder?.ordered_date}</span>
                        </div>
                    </div>

                    <div className={styles["os-row"]}>
                        <div>
                        <span className={styles["os-label"]}>Customer</span>
                        <span className={styles["os-value"]}>{recentOrder?.username}</span>
                        </div>
                        <div>
                        <span className={styles["os-label"]}>Payment Method</span>
                        <span className={styles["os-value"]}>{recentOrder?.payment_method}</span>
                        </div>
                    </div>

                    <div className={styles["os-summary"]}>
                        <h3>Order Summary</h3>
                        <div className={styles["os-summary-row"]}>
                        <span>Items ({recentOrder?.items_count || 0})</span>
                        <span>₹{recentOrder?.total_amount || 0}</span>
                        </div>
                        <div className={styles["os-summary-row"]}>
                        <span>GST</span>
                        <span>₹0.00</span>
                        </div>
                        <div className={styles["os-summary-row"]}>
                        <span>Delivery</span>
                        <span>₹0.00</span>
                        </div>
                        <div className={`${styles["os-summary-row"]} ${["os-total"]}`}>
                        <span>Total Amount</span>
                        <span>₹{recentOrder?.total_amount || 0}</span>
                        </div>
                        <p className={styles["os-note"]}>* Freight charges, if applicable, will be informed by the seller.</p>
                    </div>

                    {/* Address Block (optional) */}
                    <div className={styles["os-address"]}>
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
                    <div className={styles["os-actions"]}>
                    <button className={`${styles["os-btn"]} ${styles["os-btn-primary"]}`}>Continue Shopping</button>
                    <button className={`${styles["os-btn"]} ${styles["os-btn-outline"]}`}>View Order Details</button>
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