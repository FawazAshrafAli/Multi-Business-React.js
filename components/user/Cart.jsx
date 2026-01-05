import React, { useContext, useEffect, useState } from 'react'
import product from '../../lib/api/product';
import Cookies from 'js-cookie';
import Message from '../common/Message';
import Loading from '../Loading';
import { useDebounce } from '../../hooks/useDebounce';
import AuthContext from '../context/AuthContext';

const Cart = ({user}) => {
    const [message, setMessage] = useState();
    const [messageClass, setMessageClass] = useState();

    const [cartItems, setCartItems] = useState();
    const [cartItemsLoading, setCartItemsLoading] = useState(true);

    const [totalAmount, setTotalAmount] = useState(0);

    const {setUserCartCount} = useContext(AuthContext);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
                setMessageClass("");
            }, 5000);
    
            return () => clearTimeout(timer);
        }
    }, [message]);

    useEffect(() => {
        const sum = cartItems?.reduce(
            (acc, item) => acc + item.quantity * item.price,
            0
        ) || 0;

        setTotalAmount(sum);
    }, [cartItems]);

    useEffect(() => {
        if (!user) return;

        const fetchCartitems = async () => {
            try {
                const response = await product.getCartItems(user?.id);
                setCartItems(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setCartItemsLoading(false);
            }
        }

        fetchCartitems();
    }, [user]);

    const setQty = async (itemSlug, qty) => {
        if (qty === 0) return;

        const csrfToken = Cookies.get('csrftoken');

        try {
            const response = await product.setCartItemQty(
                itemSlug,
                { quantity: qty },
                {
                    headers: {
                        "X-CSRFToken": csrfToken,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            const { new_quantity } = response.data;

            setCartItems(prev =>
                prev.map(item =>
                    item.slug === itemSlug ? { ...item, quantity: new_quantity } : item
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
    };    

    const debouncedUpdateQty = useDebounce((itemId, qty) => {
        const updatedItem = cartItems.find(i => i.id === itemId);
        setQty(updatedItem?.slug, qty);
    });

    const handleQtyChange = (e, itemId) => {
        e.preventDefault();
        const qty = Number(e.target.value);
        if (qty <= 0) return;

        setCartItems(prev =>
            prev.map(item =>
                item.id === itemId ? { ...item, quantity: qty } : item
            )
        );

        debouncedUpdateQty(itemId, qty);
    };



    const handleIncrease = (e, itemId) => {
        e.preventDefault();

        setCartItems(prev => {
            const updated = prev.map(item =>
                item.id === itemId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );

            const item = updated.find(i => i.id === itemId);
            debouncedUpdateQty(itemId, item.quantity);

            return updated;
        });
    };



    const handleDecrease = (e, itemId) => {
        e.preventDefault();

        setCartItems(prev => {
            const updated = prev.map(item =>
                item.id === itemId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            );

            const item = updated.find(i => i.id === itemId);
            debouncedUpdateQty(itemId, item.quantity);

            return updated;
        });
    };



    const handleRemoveItem = async (e, itemSlug) => {
        e.preventDefault();

        if (!itemSlug) return;

        try {
            const response = await product.removeFromCart(itemSlug)

            const { success, message, cart_count } = response?.data || {};            
            
            setCartItems(prev => prev.filter(item => item.slug !== itemSlug));

            if (success) {
                setUserCartCount(cart_count)
                // setMessageClass(success ? "bg-success" : "bg-danger");
                // setMessage(message);
            }
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
                <span className="cart-step">3. ADDRESS</span>
                <span className="cart-step">4. CONFIRM & PAY</span>
            </div>

            <div className="cart-container">
                {/* LEFT: Items */}
                <div className="cart-left">
                <h1 className="cart-title">My Cart <span className="muted">( <span id="bzCount">{cartItems?.length || 0}</span> item)</span></h1>

                {/* Item */}
                {cartItemsLoading? <Loading/> 
                :
                    cartItems?.map((item, index) => (
                        <article className="cart-item" data-price="5000" key={item.slug || index + 1}>
                        <div className="thumb">
                        <img src={item.image_url || "https://admin.bzindia.in/media/course/Diploma-in-Building-Management-System-DBMS.jpg"} alt="Product" />
                        </div>
                        <div className="cart-item-details">
                        <h3 className="cart-item-title">{item.product_name}</h3>
                        {item.color_name && 
                        <p className="cart-item-sub">(Color : {item.color_name})</p>
                        }
                        <p className="cart-item-sub">({item.quantity} Pack : Piece/Pieces)</p>

                        <div className="cart-item-meta">
                            <div className="qty-controls" aria-label="Quantity controls">
                            <button className="qty-btn" data-qty="dec" type="button" onClick={(e) => handleDecrease(e, item.id)}>−</button>
                            <input className="qty-input" type="text" inputMode="numeric" pattern="[0-9]*" value={item.quantity} aria-label="Quantity" onInput={(e) => handleQtyChange(e, item.id)}/>
                            <button className="qty-btn" data-qty="inc" type="button" onClick={(e) => handleIncrease(e, item.id)}>+</button>
                            </div>

                            <a href="#" className="remove-btn" data-remove><i className="fa fa-trash" aria-hidden="true" onClick={(e) => handleRemoveItem(e, item.slug)}></i></a>
                        </div>
                        </div>

                        <div className="cart-item-price">
                        ₹ <span className="lineTotal">{item.quantity * item.price}</span>
                        </div>
                    </article>
                    ))
                }
                
                
                                

                {/* Duplicate the <article> above for more items (change data-price) */}
                </div>

                {/* RIGHT: Summary */}
                <aside className="cart-right">
                <div className="order-summary">
                    <h3>ORDER SUMMARY</h3>

                    <div className="summary-row">
                    <span className="summary-label">Total Price (<span id="sumCount">{cartItems?.length || 0}</span> items)</span>
                    <span className="summary-value">₹ <span id="sumSubtotal">{totalAmount}</span></span>
                    </div>

                    <div className="summary-row">
                    <span className="summary-label">Round Off</span>
                    <span className="summary-value">₹ <span id="sumRound">0.00</span></span>
                    </div>

                    <div className="summary-row">
                    <span className="summary-label">GST</span>
                    <span className="summary-value">₹ <span id="sumGST">0.00</span></span>
                    </div>

                    <div className="summary-row">
                    <span className="summary-label">Discount</span>
                    <span className="summary-value">₹ <span id="sumDisc">0.00</span></span>
                    </div>

                    <div className="summary-row">
                    <span className="summary-label">Delivery Charges</span>
                    <span className="summary-value">₹ <span id="sumShip">0.00</span></span>
                    </div>

                    <div className="summary-row summary-total">
                    <span className="summary-label">Total Cart Amount</span>
                    <span className="summary-value">₹ <span id="sumGrand">{totalAmount}</span></span>
                    </div>

                    {cartItems?.length > 0 &&
                    <a className="btn-primary text-center" href="/delivery-address" type="button">PROCEED TO CHECKOUT</a>
                    }
                    <a className="btn-whatsapp" href="https://api.whatsapp.com/send?phone=919845272560" aria-label="Chat on WhatsApp">
                        {/* simple WA icon */}
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5a11.4 11.4 0 0 0-9.7 17.4L1.5 24l6.3-1.6A11.4 11.4 0 1 0 12 .5Zm6.6 17.2c-.3.8-1.7 1.5-2.3 1.6-.6.1-1.3.2-2.1 0-1.8-.4-3.6-1.5-5-3.1-1.3-1.5-2.2-3.3-2.5-5.1-.1-.8 0-1.5.3-2.1.3-.5.8-1.1 1.5-1.2.4 0 .9 0 1 .1.2.1.5 1.3.6 1.6.1.3.2.5.1.7-.1.2-.2.4-.4.6l-.2.3c-.1.1-.2.3-.1.5.2.4.7 1.3 1.6 2.2 1 1.1 2.3 1.8 2.7 1.9.2.1.4 0 .6-.2l.5-.7c.2-.3.4-.4.6-.3.2.1 1.4.7 1.6.8.3.1.6.3.7.5.1.2.1 1 .0 1.1Z"/></svg>
                        CHAT WITH US
                    </a>
                </div>
                </aside>
            </div>
            </section>
    </>
  )
}

export default Cart