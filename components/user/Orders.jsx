import React, { useEffect, useRef, useState, useCallback } from 'react'
import Sidebar from './Sidebar';
import product from '../../lib/api/product';
import Loading from '../Loading';

const Orders = ({user}) => {
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true);

    const [status, setStatus] = useState("all");
    const [month, setMonth] = useState("all");
                                            
    const [nextPage, setNextPage] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const loaderRef = useRef(null);
    const fetchingRef = useRef(false);
    const observerRef = useRef(null);

    const handleDownloadInvoice = async(orderSlug) => {
        if (!orderSlug) return;

        try {
            const response = await product.downloadInvoice(orderSlug);            

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.download = `invoice_${orderSlug}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(err);
        }
    }

    const fetchOrders = useCallback(async (url, isReset = false) => {
        if (!url || fetchingRef.current) return;
        
        fetchingRef.current = true;
        setOrdersLoading(true);

        try {
            const response = await product.getOrders(url);

            if (isReset) {
                setOrders(response.data.results || []);
            } else {
                setOrders(prev => {
                    // Create a map of existing orders by unique key (order_id + slug)
                    const existingOrders = new Map();
                    prev.forEach(item => {
                        const key = `${item.order_id}-${item.slug || ''}`;
                        existingOrders.set(key, item);
                    });
                    
                    // Filter out duplicates from new results
                    const newItems = (response.data.results || []).filter(item => {
                        const key = `${item.order_id}-${item.slug || ''}`;
                        return !existingOrders.has(key);
                    });
                    
                    return [...prev, ...newItems];
                });
            }

            // Check if there's a next page
            setNextPage(response.data.next);
            setHasMore(!!response.data.next);
            
            // Log for debugging
            console.log("Fetched orders:", {
                count: response.data.results?.length || 0,
                next: response.data.next,
                totalThisFetch: (response.data.results || []).length,
                isReset
            });

        } catch (err) {
            console.error("Error fetching orders:", err);
            setHasMore(false);
        } finally {
            fetchingRef.current = false;
            setOrdersLoading(false);
            setInitialLoad(false);
        }
    }, []);

    // Reset and fetch when filters change
    useEffect(() => {
        if (initialLoad) return;
        
        setOrders([]);
        fetchingRef.current = false;
        setHasMore(true);
        const initialUrl = `/product_api/order/?status=${status}&month=${month}`;
        fetchOrders(initialUrl, true);
    }, [status, month, fetchOrders]);

    // Initial fetch
    useEffect(() => {
        const initialUrl = `/product_api/order/?status=${status}&month=${month}`;
        fetchOrders(initialUrl, true);
    }, [fetchOrders]);

    // Infinite scroll observer
    useEffect(() => {
        if (ordersLoading || !hasMore || !nextPage) {
            if (observerRef.current && loaderRef.current) {
                observerRef.current.unobserve(loaderRef.current);
            }
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && nextPage && hasMore && !ordersLoading && !fetchingRef.current) {
                    console.log("Loading more orders from:", nextPage);
                    fetchOrders(nextPage, false);
                }
            },
            { 
                root: null,
                rootMargin: "100px",
                threshold: 0.1
            }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        observerRef.current = observer;

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [nextPage, ordersLoading, hasMore, fetchOrders]);

    // Debug: log current state
    useEffect(() => {
        console.log("Current orders state:", {
            totalOrders: orders.length,
            hasMore,
            nextPage,
            ordersLoading,
            fetching: fetchingRef.current
        });
    }, [orders, hasMore, nextPage, ordersLoading]);

    return (
        <>
            <section>
                <div className="orders-page-wrapper">
                    <div className="orders-layout">

                        {/* Sidebar */}
                        <Sidebar user={user}/>

                        {/* Main */}
                        <main className="orders-main">
                            <div className="orders-main-header">
                                <div>
                                    <h2>My Orders</h2>
                                    <p>View all your order purchases and payment history.</p>
                                </div>
                                <div className="orders-filters">
                                    <select 
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="all">All Status</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                    <select 
                                        value={month}
                                        onChange={(e) => setMonth(e.target.value)}
                                    >
                                        <option value="6">Last 6 months</option>
                                        <option value="12">Last 12 months</option>
                                        <option value="all">All time</option>
                                    </select>
                                </div>
                            </div>

                            <div className="orders-list">
                                {/* Orders List */}
                                {orders?.length > 0 ? (
                                    orders.map((order, index) => {
                                        const product_names = order.product_names?.join(", ");
                                        const uniqueKey = `${order.order_id}-${order.slug || index}`;

                                        return (
                                            <article className="order-card" key={uniqueKey}>
                                                <div className="order-card-top">
                                                    <div>
                                                    <div className="order-id">#{order.order_id}</div>
                                                    <div className="order-meta">Placed on {order.ordered_date} • Paid via {order.payment_method}</div>
                                                    </div>
                                                    <span className="order-status order-status-success">{order.status}</span>
                                                </div>

                                                <div className="order-card-middle">
                                                    <div className="order-item-info">
                                                    <h3 title={product_names} style={{display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis"}}>{product_names}</h3>
                                                    <p>Qty: {order.items_count} • Access via BZIndia</p>
                                                    </div>
                                                    <div className="order-amount">
                                                    <span>Total Amount</span>
                                                    <strong>₹{order.total_amount || "0.00"}</strong>
                                                    </div>
                                                </div>

                                                <div className="order-card-bottom">
                                                    <div className="order-small">
                                                    Delivered on 08 Dec 2025 • Invoice available
                                                    </div>
                                                    <div className="order-actions">
                                                    <button className="order-btn order-btn-outline" onClick={() => handleDownloadInvoice(order.slug)}>Download Invoice</button>
                                                    <a href={`/orders/${order.slug}`} className="order-btn order-btn-primary">View Details</a>
                                                    </div>
                                                </div>
                                                </article>
                                        );
                                    })
                                ) : !ordersLoading ? (
                                    <div className="no-orders">
                                        <p>No orders found.</p>
                                    </div>
                                ) : null}

                                {/* Loading Indicator */}
                                {ordersLoading && <Loading />}

                                {/* Loader ref for infinite scroll */}
                                {hasMore && !ordersLoading && (
                                    <div 
                                        ref={loaderRef} 
                                        style={{ 
                                            height: '20px', 
                                            margin: '20px 0',
                                            visibility: 'visible'
                                        }}
                                    >
                                        {/* Optional: Add a subtle indicator */}
                                        <div style={{ 
                                            textAlign: 'center', 
                                            color: '#666',
                                            fontSize: '14px'
                                        }}>
                                            Scroll to load more...
                                        </div>
                                    </div>
                                )}

                                {/* Show message when no more orders */}
                                {!hasMore && orders.length > 0 && (
                                    <div style={{ 
                                        textAlign: 'center', 
                                        padding: '20px',
                                        color: '#666',
                                        fontSize: '14px'
                                    }}>
                                        No more orders to load
                                    </div>
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Orders