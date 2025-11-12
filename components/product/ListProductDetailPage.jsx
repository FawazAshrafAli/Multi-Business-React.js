import React, { useEffect, useState, useRef, useContext } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';

import product from '../../lib/api/product';
import location from '../../lib/api/location';
import Loading from '../Loading';
import BlogContext from '../context/BlogContext';
import TitleContext from '../context/TitleContext';

const ListProductDetailPage = ({ blogs, homeContent }) => {
    const searchParams = useSearchParams();
    const category = searchParams.get("category");

    const [noDetailMsg, setNoDetailMsg] = useState("");
    const [productDetailPages, setProductDetailPages] = useState([]);
    const [productDetailPagesError, setProductDetailPagesError] = useState(null);
    const [productDetailPagesLoading, setProductDetailPagesLoading] = useState(false);

    const [nearbyPlaces, setNearbyPlaces] = useState([]);
    const [nearbyPlacesError, setNearbyPlacesError] = useState(null);
    const [nearbyPlacesLoading, setNearbyPlacesLoading] = useState(true);

    const [nextParams, setNextParams] = useState("limit=9&offset=0");

    const loaderRef = useRef(null);
    const { setBlogs, resetBlogs } = useContext(BlogContext);
    const { setTitle, resetTitle } = useContext(TitleContext);

    // Set blogs in context
    useEffect(() => {
        if (blogs) setBlogs(blogs);
        return () => resetBlogs();
    }, [blogs]);

    useEffect(() => {
        if (homeContent) setTitle(`Products${homeContent?.meta_title ? ` - ${homeContent?.meta_title}` : ""}`);      
    
        return () => {      
        resetTitle();
        };
    }, [homeContent]);

    // Fetch nearby places
    useEffect(() => {
        const fetchNearbyPlaces = async () => {
            try {
                const response = await location.getNearbyPlaces();
                setNearbyPlaces(response.data);
            } catch (err) {
                setNearbyPlacesError(err);
            } finally {
                setNearbyPlacesLoading(false);
            }
        };
        fetchNearbyPlaces();
    }, []);

    // Fetch product details with pagination
    const fetchProductDetails = async (params = null, reset = false) => {
        if (!params) params = "limit=9&offset=0";

        let slug = "all"; // or any default slug if needed
        let urlParams = params;
        if (category) urlParams += `&category=${category}`;

        try {
            setProductDetailPagesLoading(true);
            const response = await product.getProductDetailList(slug, urlParams);

            if (reset) {
                setProductDetailPages(response.data.results);
            } else {
                // Avoid duplicates
                const newItems = response.data.results.filter(
                    item => !productDetailPages.some(existing => existing.slug === item.slug)
                );
                setProductDetailPages(prev => [...prev, ...newItems]);
            }

            // Update nextParams for infinite scroll
            if (response.data.next) {
                const nextUrl = new URL(response.data.next, window.location.origin);
                setNextParams(nextUrl.searchParams.toString());
            } else {
                setNextParams(null);
            }
        } catch (err) {
            setProductDetailPagesError(err);
            console.error(err);
        } finally {
            setProductDetailPagesLoading(false);
        }
    };

    // Reset and fetch when nearbyPlaces or category changes
    useEffect(() => {
        setProductDetailPages([]);
        setNextParams("limit=9&offset=0");
        fetchProductDetails("limit=9&offset=0", true);
    }, [nearbyPlaces, category]);

    // Infinite scroll
    useEffect(() => {
        if (!loaderRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && nextParams && !productDetailPagesLoading) {
                    fetchProductDetails(nextParams);
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [nextParams, productDetailPagesLoading]);

    // No results message
    useEffect(() => {
        if (!productDetailPagesLoading && productDetailPages.length === 0) {
            let msg = "No Products to Display.";
            if (category) msg = "No products available for the provided category.";
            setNoDetailMsg(msg);
        }
    }, [productDetailPages, productDetailPagesLoading, category]);

    // Initialize AOS
    useEffect(() => {
        AOS.init({ once: true });
    }, []);

    return (
        <>
            <section className="bg-half" style={{ backgroundImage: "url('/images/city-4667143_1920.jpeg')" }}>
                <div className="bg-overlay"></div>
                <div className="home-center">
                    <div className="home-desc-center" data-aos="fade-in">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="page-next-level text-white">
                                        <h1>Products</h1>
                                        <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                                        <p id="breadcrumbs">
                                            <span>
                                                <span><Link href="/">Home</Link></span> » 
                                                <span className="breadcrumb_last" aria-current="page">Products</span>
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cleints-listing-secion py-5 h2_second">
                <div className="container">
                    <h2>{category ? `Category: ${category}` : "Products"}</h2>
                    <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                    <div className="row" data-aos="fade-up">
                        {productDetailPagesLoading && productDetailPages.length === 0 && <Loading />}
                        {!productDetailPagesLoading && productDetailPages.length === 0 && (
                            <h6 className='text-center text-danger'>{noDetailMsg}</h6>
                        )}

                        {productDetailPages?.map((multipage, index) => (
                            <div className="col-md-4" key={multipage.slug + index || index + 1}>
                                <article className="post multipage-post">
                                    <div className="post-preview">
                                        <Link href={`/${multipage.url}`}>
                                            <img src={multipage?.product?.image_url || '/images/building-3697342_1280.jpg'} 
                                                 alt={multipage?.product?.name} 
                                                 className="img-fluid mx-auto d-block" 
                                                 style={{ height: "312.841px" }} />
                                        </Link>
                                    </div>
                                    <div className="post-header">
                                        <h4 className="post-title"><Link href={`/${multipage.url}`}>{multipage?.product?.name}</Link></h4>
                                        <div className="post-content">
                                            <p className="text-muted" style={{textAlign:"left", display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden", textOverflow:"ellipsis"}}>{multipage.summary}</p>
                                        </div>
                                        <span className="bar"></span>
                                        <div className="post-footer">
                                            <div className="post-more"><Link href={`/${multipage.url}`}>Read More <i className="mdi mdi-arrow-right"></i></Link></div>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        ))}

                        {productDetailPagesLoading && productDetailPages.length > 0 && <Loading />}
                        <div ref={loaderRef} style={{ height: '1px' }} />
                    </div>
                </div>
            </section>
        </>
    );
};

export default ListProductDetailPage;
