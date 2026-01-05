import React, { useContext, useEffect, useState } from 'react'
import product from '../../lib/api/product';

import createDOMPurify from 'dompurify';

import $ from 'jquery';
import  "/public/easy-responsive-tabs.js";
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AuthContext from '../context/AuthContext';

const DetailProduct = ({
  detailPage, currentCompany,
  setMessage, setMessageClass,
  user
  }) => {
  const [formData, setFormData] = useState({});
  const router = useRouter();

  const {setUserCartCount} = useContext(AuthContext);

  const [sanitizedDescription, setSanitizedDescription] = useState();
  const [qty, setQty] = useState(1);
  const [itemColor, setItemColor] = useState(detailPage?.colors?.[0]?.slug || "");

  let oldPrice;

  if (detailPage?.price) {
    oldPrice = (1.28 * detailPage?.price);
  }  

  useEffect(() => {
    if (typeof window === 'undefined' || !detailPage?.description) return;

    const DOMPurify = createDOMPurify(window);
    const sanitized = DOMPurify.sanitize(detailPage.description || '')
    
    setSanitizedDescription(sanitized);
  }, [detailPage?.description]);

  useEffect(() => {
    if (!detailPage?.slug) return;    

    setFormData({
      ...formData,
      "product": detailPage?.slug
    })    

  }, [detailPage?.slug]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.$ || !$.fn.easyResponsiveTabs) return;

    const initTabs = () => {
      const horiz = document.getElementById("horizontalTab");
      if (horiz) {
        // destroy existing instance if any
        try { $(horiz).easyResponsiveTabs('destroy'); } catch {}
        
        $(horiz).easyResponsiveTabs({
          type: 'horizontal',
          width: 'auto',
          fit: true
        });
      }
    };

    // Delay so React mounts DOM first
    const timer = setTimeout(initTabs, 0);

    return () => clearTimeout(timer);
  }, [detailPage?.slug]); // only re-run when page changes


  useEffect(() => {
        const timeout = setTimeout(() => {
          import("../../public/js/newScript.js");
        }, 300); 
  
        return () => clearTimeout(timeout);
      }, []);

  const handleAddToCart = async (e, buyNow = false) => {
    e.preventDefault();

    if (!user) {
      router.push('/login');
      return;
    }

    const csrfToken = Cookies.get('csrfToken');

    try {
      const response = await product.addToCart(
        {
          "product": detailPage?.product_slug || "",
          "quantity": qty || 1, 
          "color": itemColor || "",   
        },
        {
          headers:{
          'X-CSRFToken': csrfToken,
          "Content-Type": "application/json"
        }, 
        withCredential: true
      },      
      )

      const { success, message, cart_count } = response?.data || {};


      
      if (success) {
        if (buyNow) {
          router.push("/cart")
          return;
        }

        setMessageClass(success ? "bg-success" : "bg-danger");
        setMessage(message);
        setQty(1);
      }

      if (cart_count) {
        setUserCartCount(cart_count);
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
        <div className="container">
  <nav className="breadcrumb">
    <Link href="/">Home</Link> › 
    <Link href={`/${currentCompany?.slug}`}>{currentCompany?.sub_type}</Link> › 
    <Link href={`/${currentCompany?.slug}/${detailPage?.category_slug}`}>{detailPage?.category_name}</Link> ›
    <Link href={`/${currentCompany?.slug}/${detailPage?.category_slug}/${detailPage?.sub_category_slug}`}>{detailPage?.sub_category_name}</Link> ›
    <span>{detailPage?.name?.slice(0,50)}{detailPage?.name?.length > 50 && "..."}</span>
  </nav>

  <div className="page">
    {/* ========== GALLERY ========== */}
    <aside className="gallery">
      <div className="preview" id="preview">
        <img id="mainImg" src={detailPage?.image_url || "#"} alt={detailPage?.name}/>
      </div>
      <div className="thumb-row" id="thumbRow">
        <div className="thumb active"><img src={detailPage?.image_url || "#"} data-large={detailPage?.image_url || "#"} alt={detailPage?.name} /></div>
        {/* <div className="thumb"><img src="https://picsum.photos/id/1074/300/220" data-large="https://picsum.photos/id/1074/900/700" alt=""/></div>
        <div className="thumb"><img src="https://picsum.photos/id/1080/300/220" data-large="https://picsum.photos/id/1080/900/700" alt=""/></div>
        <div className="thumb"><img src="https://picsum.photos/id/1084/300/220" data-large="https://picsum.photos/id/1084/900/700" alt=""/></div>
        <div className="thumb"><img src="https://picsum.photos/id/1081/300/220" data-large="https://picsum.photos/id/1081/900/700" alt=""/></div> */}
      </div>
    </aside>

    {/* ========== INFO ========== */}
    <section className="card">
      <div className="bd">
        <div className="sub">Brand: <a href="#">{detailPage?.brand_name}</a> • SKU: {detailPage?.sku}</div>
        <h1 className="title">{detailPage?.name}</h1>

        <div className="row" style={{gap:"12px", margin:"8px 0 2px"}}>
          <span className="rating">
            <svg className="star" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.87 1.402-8.168L.132 9.211l8.2-1.193z"/></svg>
            {detailPage?.rating} · {detailPage?.rating_count} reviews
          </span>
          <span className="badge">Bestseller</span>
        </div>

        <div className="price" style={{display: "none"}}>
          <span className="offer" id="offerPrice">₹215</span>
          <span className="mrp" id="mrpPrice">₹300</span>
          <span className="badge" id="savePct">Save 28%</span>
        </div>

        <div className="price">
          <span className="offer">₹{detailPage?.price}</span>
          <span className="mrp">₹{oldPrice}</span>
          <span className="badge">Save 28%</span>
        </div>
          
          {detailPage?.stock > 0 ?          
            <div className="stock"><span className="dot ok"></span><b id="stockText">In stock</b> <span className="help"> — ready to dispatch</span></div>
          :
            <div className="stock"><span className="dot no"></span><b id="stockText">Out of stock</b> <span className="help"> — check again later</span></div>
          }        

        {/* Colors / Sizes */}
        <div className="opt">
          <div className="lbl">Color</div>
          <div className="swatches" id="colors">
            {detailPage?.colors?.map((color, index) => <label key={color.slug || index + 1} className={`swatch color ${index === 0? "active" : ""}`} data-value={color.hexa} title={color.name}><input type="radio" name="color" value={color.slug} onClick={(e) => setItemColor(color.slug)} /><span style={{width:"100%",height:"100%",borderRadius:"8px",background:`${color.hexa}`}}></span></label>)}
            {/* <label className="swatch color active" data-value="yellow" title="Yellow"><input type="radio" name="color" checked /><span style={{width:"100%",height:"100%",borderRadius:"8px",background:"#f59e0b"}}></span></label>
            <label className="swatch color" data-value="gold" title="Golden"><input type="radio" name="color" /><span style={{width:"100%",height:"100%",borderRadius:"8px",background:"#fbbf24"}}></span></label>
            <label className="swatch color" data-value="raw" title="Raw"><input type="radio" name="color" /><span style={{width:"100%",height:"100%",borderRadius:"8px",background:"#ca8a04"}}></span></label> */}
          </div>
        </div>

        {/* {detailPage?.size &&    
            <div className="opt">
                <div className="lbl">Size</div>
                <div className="swatches" id="sizes">
                    <label className="swatch active" data-size={detailPage?.size}>{detailPage?.size}</label>                    
                </div>
                <div className="help">Price updates with size.</div>
            </div>
        } */}

        <div className="opt">
          <div className="row">
            <div className="stepper">
              <button id="dec" onClick={() => setQty(prev => prev != 1 ? prev - 1 : prev)}>−</button>
              <input id="qty" value={qty || "1"} inputMode="numeric" />
              <button id="inc" onClick={() => setQty(prev => prev + 1)}>+</button>
            </div>
            <button className="btn primary" id="addCart" onClick={(e) => handleAddToCart(e)}>Add to Cart</button>
            <button className="btn ghost" id="buyNow" onClick={(e) => handleAddToCart(e, true)}>Buy Now</button>
            {/* <button className="btn wish" id="wishBtn">♡ Wishlist</button> */}
          </div>
        </div>

        <div className="opt">
          {/* <div className="ship">
            <input className="input" id="pincode" placeholder="Enter pincode for delivery ETA" />
            <button className="btn ghost" id="checkPin">Check</button>
   
          </div> */}
          
          <div className="share">
      
                 <a className="ic" title="Share"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M18 8a3 3 0 0 0-2.82 2H8.82a3.001 3.001 0 0 0 0 2h6.36a3 3 0 1 0 .5-2.5l-6.36-.01a3 3 0 1 0 0 2l6.36.01A3 3 0 1 0 18 8z" fill="#111"/></svg></a>
            <a className="ic" title="Copy link" id="copyLink"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M3.9 12a4 4 0 0 1 4-4h3v2h-3a2 2 0 1 0 0 4h3v2h-3a4 4 0 0 1-4-4Zm12-4h-3v2h3a2 2 0 1 1 0 4h-3v2h3a4 4 0 0 0 0-8Z" fill="#111"/></svg></a>
            </div>
          <div className="help" id="pinMsg">Free delivery for orders above ₹499</div>
           <div className="help">100% secure payments • Easy returns</div>
        </div>

  

    

{/* Sticky CTA (mobile) */}
<div className="sticky-cta">
  <button className="btn ghost" style={{flex:"1"}} id="stickyWish">♡</button>
  <button className="btn primary" style={{flex:"2"}} id="stickyAdd">Add to Cart</button>
  <button className="btn" style={{flex:"2",border:"1px solid #d8dee6",background:"#fff"}} id="stickyBuy">Buy Now</button>
</div>

<div className="toast" id="toast">Added to cart</div>




      </div>
    </section>
    
    
 

  </div>
  
  
</div>


<div className="container">
  <div className="fullwidth-tabs">
  <div className="tabs">
    <div className="tab-head">
      <button className="tab-btn active" data-tab="desc">Description</button>
      <button className="tab-btn" data-tab="spec">Specifications</button>
      <button className="tab-btn" data-tab="rev">Reviews</button>
      <button className="tab-btn" data-tab="faq">FAQ</button>
    </div>

    <div className="tab-body" id="tab-desc">
      <span dangerouslySetInnerHTML={{__html: sanitizedDescription}} />
    </div>

    <div className="tab-body" id="tab-spec" hidden>
      <table className="specs">
        <tbody>
            <tr><td>Brand</td><td>{detailPage?.brand_name}</td></tr>
            <tr><td>Category</td><td>{detailPage?.category_name}</td></tr>
            <tr><td>Sub Category</td><td>{detailPage?.sub_category_name}</td></tr>
            <tr><td>Item</td><td>{detailPage?.name}</td></tr>
            {(detailPage?.size || detailPage?.dimension) &&
              <tr><td>Size</td><td>{detailPage?.size || detailPage?.dimension}</td></tr>
            }
        </tbody>
      </table>
    </div>

    <div className="tab-body" id="tab-rev" hidden>
      {detailPage?.reviews?.map((review, index) => {
        const fullStars = Math.floor(review.rating || 0);
        const emptyStars = 5 - fullStars;

        const stars = `${'★'.repeat(fullStars)}${'★'.repeat(emptyStars)}`;
        return (
        <div className="review" key={review.slug || index + 1}>          
          <b>{review?.review_by || review?.name}.</b> — {stars} <br/>{review?.text}.
        </div>
      )})}      
    </div>

    <div className="tab-body" id="tab-faq" hidden>
      {detailPage?.faqs?.map((faq, index) => (
        <p key={faq?.slug || index + 1}><b>Q.</b> {faq?.question} <br/><b>A.</b> {faq?.answer}</p>
      ))}
      {/* <p><b>Q.</b> Any additives? <br/><b>A.</b> No colors or preservatives.</p> */}
    </div>
  </div>
</div>

</div>
    </>
  )
}

export default DetailProduct