import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation';
import LogoContext from '../context/LogoContext';
import TitleContext from '../context/TitleContext';
import PhoneNumberContext from '../context/PhoneNumberContext';
import Faq from '../common/Faq';
import EnquiryForm from './common/EnquiryForm';
import TestimonialSlider from '../common/TestimonialSlider';
import Message from '../common/Message';
import createDOMPurify from 'dompurify';

import product from '../../lib/api/product';
import Loading from '../Loading';
import BlogContext from '../context/BlogContext';
import Link from 'next/link';
import AutoPopUp from '../common/AutoPopUp';


const ListProduct = ({
    currentCompany, reviews
}) => {
    const [message, setMessage] = useState();
    const [messageClass, setMessageClass] = useState();    

    const {slug} = useParams();

    const { setLogo, resetLogo } = useContext(LogoContext)
    const { setTitle, resetTitle } = useContext(TitleContext)
    const { setPhoneNumber, resetPhoneNumber } = useContext(PhoneNumberContext)
    const { setBlogs, resetBlogs } = useContext(BlogContext);

    const [productDetails, setProductDetails] = useState([]);
    const [productDetailsError, setProductDetailsError] = useState(null);
    const [productDetailsLoading, setProductDetailsLoading] = useState(false); 

    const [productCategories, setProductCategories] = useState();
    const [productCategoriesError, setProductCategoriesError] = useState(null);
    const [productCategoriesLoading, setProductCategoriesLoading] = useState(true);     
    
    const [expantedCategory, setExpantedCategory] = useState(null);
    const [formData, setFormData] = useState({});

    const [catalogs, setCatalogs] = useState([]);

    const [nextParams, setNextParams] = useState('limit=9&offset=0');
    const [params, setParams] = useState(null)

    const [sanitizedDescription, setSanitizedDescription] = useState([]);

    const loaderRef = useRef(null);        

    const updateParams = () => {
        const paramList = [];

        const catalog = formData?.catalog;
        const category = formData?.category;

        if (catalog) {
            paramList.push(`catalog=${encodeURIComponent(catalog)}`);
        }

        if (category) {
            paramList.push(`category=${encodeURIComponent(category)}`);
        }

        const queryString = paramList.join("&");
        
        setParams(queryString);
    }

    useEffect(() => {
        updateParams();
    }, [formData]);    

    const fetchProducts = async (url, reset = false) => {
        setProductDetailsLoading(true);

        try {
            const response = await product.getProductDetailList(slug, url);

            if (reset) {
                setProductDetails(response.data.results);
            } else {
                setProductDetails(prev => [
                    ...prev,
                    ...response.data.results.filter(
                        item => !prev.some(existing => existing.slug === item.slug)
                    )
                ]);
            }

            setNextParams(response.data.next ? response.data.next.split('?')[1] : null);
        } catch (err) {
            setProductDetailsError(err);
        } finally {
            setProductDetailsLoading(false);
        }
    };


    useEffect(() => {
        if (!loaderRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && nextParams && !productDetailsLoading) {
                    fetchProducts(nextParams);
                }
            },
            { threshold: 1 }
        );

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [nextParams, productDetailsLoading]);


    useEffect(() => {
        if (!productCategories) return;

        const rawSubCategories = productCategories.flatMap(
          category => category?.sub_categories || []
        );
        
        setCatalogs(rawSubCategories);

    }, [productCategories]);

    const handleCategoryExpansion = (categoryId) => {
        setExpantedCategory(prev => prev == categoryId? null : categoryId);        
    }

    const clearKeywords = () => {
        setFormData(prev => ({
            ...prev,
            "keywords": ""
        }))
    }

    useEffect(() => {
        if (!currentCompany) return;

        if (typeof window === 'undefined' || !currentCompany) return;
                                    
        const DOMPurify = createDOMPurify(window);
        const sanitized = DOMPurify.sanitize(currentCompany.description || '')
        

        setSanitizedDescription(sanitized);

    }, [currentCompany]);

    useEffect(() => {
        if (currentCompany) {
        const { logo_url, meta_title, phone1, phone2, blogs } = currentCompany;
    
        if (logo_url) setLogo(logo_url);
        if (meta_title) setTitle(meta_title);
        if (blogs) setBlogs(blogs);
    
        const phones = [phone1, phone2].filter(Boolean).join(' - ');
        if (phones) setPhoneNumber(phones);
        }
    
        return () => {
        resetLogo();
        resetTitle();
        resetPhoneNumber();
        resetBlogs();
        };
    }, [currentCompany]);    

    useEffect(() => {
        
        const fetchProductCategories = async () => {
            try {
                const response = await product.getCategories(slug);
                setProductCategories(response.data);
            } catch (err) {
                setProductCategoriesError(err);
            } finally {
                setProductCategoriesLoading(false);
            }
        };
        
        fetchProductCategories();
    }, [slug]);

    const handleCatalog = (e) => {
        const filtered_catalogs = productCategories.filter(productCategory => productCategory?.slug === e.target.value? productCategory : null).flatMap(
          category => category?.sub_categories || []
        );

        setFormData(prev => ({
            ...prev,
            "catalog": ""
        }))

        setCatalogs(filtered_catalogs);
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const paramList = [];

        const q = formData?.keywords;
        const catalog = formData?.catalog;
        const category = formData?.category;

        if (q) {
            paramList.push(`q=${encodeURIComponent(q)}`);
        }

        if (catalog) {
            paramList.push(`catalog=${encodeURIComponent(catalog)}`);
        }

        if (category) {
            paramList.push(`category=${encodeURIComponent(category)}`);
        }

        const queryString = paramList.join("&");
        
        setParams(queryString);

    }

    useEffect(() => {
        if (!slug) return;

        const initialParams = params ? `${params}&limit=9&offset=0` : 'limit=9&offset=0';
        setNextParams(initialParams);

        fetchProducts(initialParams, true);  // Reset product details
    }, [slug, params]);

    
    [
        productDetailsError, productCategoriesError
    ].map(error => {
        if (error) {
            console.error(error);
        }
    })  

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
                setMessageClass("");
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [message]);

  return (
    <>     
        <AutoPopUp currentCompany={currentCompany} setMessage={setMessage} setMessageClass={setMessageClass}/>     
        {message&&
        <Message message={message} messageClass={messageClass} />
        }
        <section className="bg-half" style={{background: "#005353 url('/images/bg-pattran.png')"}}>
 
            <div className="container">
                <div className="filter-box">
                    <h3>What are you looking for?</h3>
                    <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                    <form className="row faq-form-section" action="#" method="get" onSubmit={(e) => handleSubmit(e)}>
                        <div className="col-md-4">
                            
                                 <input placeholder="Search by Keyword" id="keywords" name="keywords" type="text" value={formData?.keywords || ""} onChange={(e) => handleChange(e)} />
                             
                        </div>
                        <div className="col-md-3 ">
                             
                            <select name="catalog" id="catalog" onChange={(e) => {handleChange(e);  clearKeywords()}} value={formData?.catalog || ""}>
                                    <option value="">Search the Catalog</option>
                                    {catalogs?.map((catalog, index) => <option key={catalog?.slug || index + 1} value={catalog?.slug}>{catalog?.name}</option>)}                                    
                                </select> 
                        </div>
                        <div className="col-md-3">
                             
                                 <select name="category" id="category" value={formData?.category || ""} onChange={(e) => {handleChange(e); clearKeywords(); handleCatalog(e)}}>
                                    <option value="">All Categories</option>
                                    {productCategories?.map((category, index) => <option key={category?.slug || index + 1} value={category?.slug}>{category?.name}</option>) || []}                                                                
                                </select>  
                            
                        </div>
                        <div className="col-md-2">
                             
                            <input style={{width: "100%"}} className="primary_button" type="submit" value="Search"/>
                             
                        </div>
                    </form>
                </div>

                
               <div className="row">
                
                    <p id="breadcrumbs" style={{textAlign: "center"}}>
                        <span>
                            <span><a href="/">Home</a></span> » 
                            <span><a href={`/${slug}`}>{currentCompany?.sub_type}</a></span> » 
                            <span className="breadcrumb_last" aria-current="page">Products</span>
                        </span>
                    </p>
               </div>

            </div>

       
        </section>

 
<section style={{padding: "30px 0px 0px 0px"}}>
  <div className="container">
    <div className="row">
        <div className="col-md-3 order-2 order-lg-1">
            {/*sidebar-categores-box start  */}
            <div className="sidebar-categores-box mt-sm-30 mt-xs-30">
                <div className="sidebar-title">
                    <h2>Categories</h2>
                </div>
                {/* category-sub-menu start */}
                <div className="category-sub-menu">
                    <ul>
                        {productCategoriesLoading?
                            <Loading/> 
                        :
                            productCategories?.filter(category => category?.sub_categories.length > 1? category : null).map((category, productIndex) => (
                                <li className={`has-sub ${expantedCategory === category?.slug ? "open" : ""}`} key={category?.slug || productIndex + 1}><a href="" onClick={(e) =>  {e.preventDefault(); handleCategoryExpansion(category?.slug)}}>{category?.name}</a>
                                    <ul style={{ display: expantedCategory === category?.slug ? "block": "none"}}>
                                        {category?.sub_categories?.map((sub_category, index) => (
                                            <li key={sub_category?.slug || index + 1}><Link href={`/${currentCompany.slug}/${sub_category.category_slug}/${sub_category.slug}`}>{sub_category?.name}</Link></li>
                                        )) || []}                                 
                                    </ul>
                                </li>
                            ))  || []
                        }
                    </ul>
                </div>
                {/* category-sub-menu end */}
            </div>
            {/*sidebar-categores-box end  */}
            {/*sidebar-categores-box start  */}
            <div className="sidebar-categores-box">
                <div className="sidebar-title">
                    <h2>Filter By</h2>
                </div>
                {/* btn-clear-all start */}
                <button className="btn-clear-all mb-sm-30 mb-xs-30">Clear all</button>
                {/* btn-clear-all end */}
                {/* filter-sub-area start */}
                <div className="filter-sub-area">
                    <h5 className="filter-sub-titel">Brand</h5>
                    <div className="categori-checkbox">
                        <form action="#">
                            <ul>
                                <li><input type="checkbox" name="product-categori"/><a href="#">Prime Video (13)</a></li>
                                <li><input type="checkbox" name="product-categori"/><a href="#">Computers (12)</a></li>
                                <li><input type="checkbox" name="product-categori"/><a href="#">Electronics (11)</a></li>
                            </ul>
                        </form>
                    </div>
                 </div>
                {/* filter-sub-area end */}
                {/* filter-sub-area start */}
                <div className="filter-sub-area pt-sm-10 pt-xs-10">
                    <h5 className="filter-sub-titel">Categories</h5>
                    <div className="categori-checkbox">
                        <form action="#">
                            <ul>
                                <li><input type="checkbox" name="product-categori"/><a href="#">Graphic Corner (10)</a></li>
                                <li><input type="checkbox" name="product-categori"/><a href="#"> Studio Design (6)</a></li>
                            </ul>
                        </form>
                    </div>
                 </div>
                {/* filter-sub-area end */}
                {/* filter-sub-area start */}
                <div className="filter-sub-area pt-sm-10 pt-xs-10">
                    <h5 className="filter-sub-titel">Size</h5>
                    <div className="size-checkbox">
                        <form action="#">
                            <ul>
                                <li><input type="checkbox" name="product-size"/><a href="#">S (3)</a></li>
                                <li><input type="checkbox" name="product-size"/><a href="#">M (3)</a></li>
                                <li><input type="checkbox" name="product-size"/><a href="#">L (3)</a></li>
                                <li><input type="checkbox" name="product-size"/><a href="#">XL (3)</a></li>
                            </ul>
                        </form>
                    </div>
                </div>
                {/* filter-sub-area end */}
                {/* filter-sub-area start */}
                <div className="filter-sub-area pt-sm-10 pt-xs-10">
                    <h5 className="filter-sub-titel">Color</h5>
                    <div className="color-categoriy">
                        <form action="#">
                            <ul>
                                <li><span className="white"></span><a href="#">White (1)</a></li>
                                <li><span className="black"></span><a href="#">Black (1)</a></li>
                                <li><span className="Orange"></span><a href="#">Orange (3) </a></li>
                                <li><span className="Blue"></span><a href="#">Blue  (2) </a></li>
                            </ul>
                        </form>
                    </div>
                </div>
                {/* filter-sub-area end */}
                {/* filter-sub-area start */}
                <div className="filter-sub-area pt-sm-10 pb-sm-15 pb-xs-15">
                    <h5 className="filter-sub-titel">Dimension</h5>
                    <div className="categori-checkbox">
                        <form action="#">
                            <ul>
                                <li><input type="checkbox" name="product-categori"/><a href="#">40x60cm (6)</a></li>
                                <li><input type="checkbox" name="product-categori"/><a href="#">60x90cm (6)</a></li>
                                <li><input type="checkbox" name="product-categori"/><a href="#">80x120cm (6)</a></li>
                            </ul>
                        </form>
                    </div>
                 </div>
                {/* filter-sub-area end */}
            </div>
            {/*sidebar-categores-box end  */}
            {/* category-sub-menu start */}
            <div className="sidebar-categores-box mb-sm-0 mb-xs-0">
                <div className="sidebar-title">
                    <h2>Tags</h2>
                </div>
                <div className="category-tags">
                    <ul>
                        {currentCompany?.meta_tags?.map((tag, index) => <li key={tag?.slug || index + 1}><a href={`/tag/${tag.slug}`}>{tag?.name}</a></li>)}                        
                    </ul>
                </div>
                {/* category-sub-menu end */}
            </div>
        </div>

        <div className="col-md-9 order-2 order-lg-2">
          
            <div className="row">
                {productDetails?.map((detail, index) => (
                    <div className="col-md-4" key={detail?.slug + index || index + 1}>
                        <div className="product-grid">
                            <div className="product-image">
                                <Link href={`/${detail.url}`} className="image">
                                    <img className="pic-1" src={detail?.product?.image_url} alt={detail?.product?.name} style={{maxHeight: "274.4px", objectFit: "contain"}}/>
                                    <img className="pic-2" src={detail?.product?.image_url} alt={detail?.product?.name} style={{maxHeight: "274.4px", objectFit: "contain"}}/>
                                </Link>
                                <span className="product-sale-label">sale!</span>
                                <ul className="social">
                                    <li><Link href={`/${detail.url}`} data-tip="Quick View"><i className="fa fa-eye"></i></Link></li>
                                    <li><Link href={`/${detail.url}`} data-tip="Add to wishlist"><i className="fa fa-heart"></i></Link></li>
                                </ul>
                                <div className="product-rating">
                                    <ul className="client_review">
                                        <span className="fa fa-star checked" aria-hidden="true"></span>
                                        <span className="fa fa-star checked" aria-hidden="true"></span>
                                        <span className="fa fa-star checked" aria-hidden="true"></span>
                                        <span className="fa fa-star" aria-hidden="true"></span>
                                        <span className="fa fa-star" aria-hidden="true"></span>                            
                                    </ul>                            
                                    <Link className="add-to-cart" href={`/${detail.url}`}> BUY NOW </Link>
                                </div>
                            </div>
                            <div className="product-content">
                                <h3 className="title"><Link href={`/${detail.url}`}>{detail?.product?.name}</Link></h3>
                                <div className="price">&#8377;{detail?.product?.price}</div>     
                            </div>
                        </div>
                    </div>
                ))
                }
                {productDetailsLoading && <Loading/>}
                <div ref={loaderRef} />            
                    
            </div>

        </div>
    </div>
  </div>
</section>
 

  {/* registration-services-section start */}

  <section className="content_area001" style={{paddingTop: "30px"}}>
    <div className="container">

      <div className="row">
        <div className="col-md-12 col-sm-12 col-xs-12">
            <h1>{currentCompany?.name}</h1>
            <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
    
        <span dangerouslySetInnerHTML={{__html: sanitizedDescription}}/>
      </div>
      </div>

  <h3>Tags Cloud</h3>
  <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
  <div className="row" data-aos="fade-up">
    <div className="col-md-12 col-sm-12 col-xs-12">
        <div className="tags_cloud">
            {currentCompany?.meta_tags?.map((item, index) => <Link key={item.slug || index + 1} href={`/tag/${item.slug}`} title={item.name}>{item.name}</Link> ) || []}
        </div>
    </div>
</div>

</div>

  </section>

<section>
    <div className="container-fluid">

        <div className="registration-faq-section my-5" data-aos="fade-up">            
            <div className="row">
                <div className="col-md-8">
                    <div className="regstrtn-faq-space">
                        <div className="registrsn-fq-scrool-bar-clm">
                            <h3>FAQs</h3>
                            <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                            <div className="registrsn-fq-scrool-bar-clm-cntnt">
                                <div className=" pre-scrollable" style={{height: "500px", overflowY: "auto"}}>
                                    <Faq faqs={currentCompany?.faqs} />                                                        
                                </div>                                
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 ">                    
                        <EnquiryForm company={currentCompany} setMessage={setMessage} setMessageClass={setMessageClass}/>
                    
                </div>
            </div>
        </div>
    </div>

</section>

  <TestimonialSlider testimonials={reviews}/>  
    
    </>
  )
}

export default ListProduct