import React, { useContext, useEffect, useRef, useState } from 'react'
import Link from 'next/link';

import AOS from 'aos';
import 'aos/dist/aos.css';
import createDOMPurify from 'dompurify';

import metaTag from '../lib/api/metaTag';

import Loading from './Loading';
import BlogContext from './context/BlogContext';
import TitleContext from './context/TitleContext';
import location from '../lib/api/location';
import LogoContext from './context/LogoContext';
import Message from './common/Message';
import AutoPopUp from './common/AutoPopUp';

const ListMetaTag = ({
    blogs, initialMetaTags, currentMetaTag, metaTagLocation, mostMatchingCompany}) => {

    const matchingLocation = metaTagLocation?.data;
    const locationType = metaTagLocation?.match_type;

    const [noDetailMsg, setNoDetailMsg] = useState();                

    const [state, setState] = useState(null);
    const [district, setDistrict] = useState(null);
    const [place, setPlace] = useState(null);
        
    // Meta Tags
    const [metaTags, setMetaTags] = useState(initialMetaTags || []);    
    const [metaTagsError, setMetaTagsError] = useState(null);
    const [metaTagsLoading, setMetaTagsLoading] = useState(!initialMetaTags?.length);

    const [matchingItems, setMatchingItems] = useState([]);
    const [matchingItemsError, setMatchingItemsError] = useState(null);
    const [matchingItemsLoading, setMatchingItemsLoading] = useState(true);  
    
    const [nextMetaParams, setNextMetaParams] = useState('limit=9&offset=0');
    const [nextItemUrl, setNextItemUrl] = useState(`/meta_tag_api/matching_items/${currentMetaTag?.slug}/?limit=9&offset=0`);

    const metaLoaderRef = useRef(null);
    const itemLoaderRef = useRef(null);

    const fetchingMetaRef = useRef(false);
    const fetchingItemRef = useRef(false);

    const { setBlogs, resetBlogs } = useContext(BlogContext);
    const { setLogo, resetLogo } = useContext(LogoContext)  
    const { setTitle, resetTitle } = useContext(TitleContext); 

    const [message, setMessage] = useState();
    const [messageClass, setMessageClass] = useState();

    const updatedMultipage = (multipage) => {    
        const slug = multipage?.slug || "";
        const companySlug = multipage?.company_slug || "";
        const urlType = multipage?.url_type;

        let updatedMultipageSlug = slug;
        let modifiedUrl = "";

        if (urlType === "location_filtered") {
            updatedMultipageSlug = updatedMultipageSlug.replace("-place_name", "");
            if (place) {
                modifiedUrl = `${companySlug}/${updatedMultipageSlug}/${place?.district?.state?.slug}/${place?.district?.slug}/${place?.slug}`;
            } else if (district) {
                modifiedUrl = `${companySlug}/${updatedMultipageSlug}/${district?.state?.slug}/${district?.slug}`;
            } else if (state) {
                modifiedUrl = `${companySlug}/${updatedMultipageSlug}/${state?.slug || "india"}`;
            } else {
                modifiedUrl = `${companySlug}/${updatedMultipageSlug}`;
            }       
        } else {
            updatedMultipageSlug = updatedMultipageSlug.replace("place_name", place?.slug || district?.slug || state?.slug || "india");
            modifiedUrl = `${companySlug}/${updatedMultipageSlug}`;      
        }


        return modifiedUrl;

    };

    useEffect(() => {
        setState(null);
        setDistrict(null);
        setPlace(null);

        const fetchState = async () => {
            try {
                const response = await location.getState(matchingLocation?.slug);
                setState({
                "name": response.data?.name,
                "slug": response.data?.slug
                });
            } catch (err) {
                console.error(err);
            }
        }

        const fetchDistrict = async () => {
            try {
                const response = await location.getDistrict(matchingLocation?.slug);
                setDistrict({
                "name": response.data?.name,
                "slug": response.data?.slug,
                "state": response.data?.state
                });
            } catch (err) {
                console.error(err);
            }
        }

        const fetchPlace = async () => {
            try {
                const response = await location.getPlace(matchingLocation?.slug);
                setPlace({
                "name": response.data?.name,
                "slug": response.data?.slug,
                "district": response.data?.district,
                });
            } catch (err) {
                console.error(err);
            }
        }

        if (locationType === "place") {
            fetchPlace();
        } else if (locationType === "district") {
            fetchDistrict();
        } else if (locationType === "state") {
            fetchState();
        }


    }, [metaTagLocation])    

    useEffect(() => {
        if (mostMatchingCompany){
            setLogo(mostMatchingCompany.logo_url)
        }
    
        return () => {      
        resetLogo();
        };
    }, [mostMatchingCompany]);

    useEffect(() => {
        if (mostMatchingCompany){
            setBlogs(mostMatchingCompany.blogs)
        } else if (blogs) {    

        setBlogs(blogs);
        }
    
        return () => {      
        resetBlogs();
        };
    }, [blogs, mostMatchingCompany]);
    
    useEffect(() => {
        if (currentMetaTag) {    
            setTitle(currentMetaTag.name?.replace("place_name", matchingLocation?.name || "India"));
        } else {
            setTitle("Tags");
        }
    
        return () => {      
        resetTitle();
        };
    }, [currentMetaTag]);   

    const fetchMetaTags = async (params = nextMetaParams) => {
        if (fetchingMetaRef.current || !params) return;
        fetchingMetaRef.current = true;
        setMetaTagsLoading(true);

        try {
            const response = await metaTag.getMetaTags(params);
            setMetaTagsError(null);

            setMetaTags(prev => {
                const existingKeys = new Set(prev.map(tag => tag.slug || tag.name));
                const newItems = response.data.results.filter(tag => !existingKeys.has(tag.slug || tag.name));
                return [...prev, ...newItems];
            });

            if (response.data.next) {
                const urlParams = response.data.next.split('?')[1];
                setNextMetaParams(urlParams);
            } else {
                setNextMetaParams(null);
            }
        } catch (err) {
            setMetaTagsError(err);
        } finally {
            fetchingMetaRef.current = false;
            setMetaTagsLoading(false);
        }
    };


    useEffect(() => {
        fetchMetaTags();
    }, [])

    const DOMPurify = typeof window !== 'undefined' ? createDOMPurify(window) : null;

    const getSanitizedDescription = (description) => {
    if (!description || !DOMPurify) return '';
    return DOMPurify.sanitize(description);
    };

    const fetchMatchingItems = async (url = nextItemUrl) => {
        if (fetchingItemRef.current || !url) return;

        fetchingItemRef.current = true;
        setMatchingItemsLoading(true);

        try {
            const response = await metaTag.getMatchingItems(url);

            setMatchingItems(prev => {
                const existingKeys = new Set(prev.map(item => item.slug || item.url));
                const newItems = response.data.results.filter(item => !existingKeys.has(item.slug || item.url));
                return [...prev, ...newItems];
            });

            setNextItemUrl(response.data.next);
        } catch (err) {
            setMatchingItemsError(err);
        } finally {
            fetchingItemRef.current = false;
            setMatchingItemsLoading(false);
        }
    };


    useEffect(() => {
        if (!currentMetaTag?.slug) return;

        setMatchingItems([]);
        const initialUrl = `/meta_tag_api/matching_items/${currentMetaTag?.slug}/?limit=9&offset=0`;
        setNextItemUrl(initialUrl);

        // Immediately trigger the first fetch
        fetchMatchingItems(initialUrl);
    }, [currentMetaTag?.slug]);

    useEffect(() => {
        if (!metaLoaderRef.current || !nextMetaParams) return;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && nextMetaParams && !metaTagsLoading && !fetchingMetaRef.current) {
                fetchMetaTags();
            }
        }, { threshold: 1 });

        observer.observe(metaLoaderRef.current);

        return () => observer.disconnect();
    }, [nextMetaParams, metaTagsLoading]);

    useEffect(() => {
        const currentLoader = itemLoaderRef.current;
        if (!currentLoader) return;

        const observer = new IntersectionObserver(entries => {
            if (
                entries[0].isIntersecting &&
                nextItemUrl &&               
                !fetchingItemRef.current     
            ) {
                fetchMatchingItems(nextItemUrl);
            }
        }, { threshold: 1 });

        observer.observe(currentLoader);

        return () => observer.disconnect();
    }, [nextItemUrl]);





    useEffect(() => {
            AOS.init({
            once: true,
        });
    }, []);

    [
        matchingItemsError, metaTagsError
    ].map(error => {
        if (error) {
            console.error(error);
        }
    });

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
        {message&&
        <Message message={message} messageClass={messageClass} />
        }
        {mostMatchingCompany &&
        <AutoPopUp currentCompany={mostMatchingCompany} setMessage={setMessage} setMessageClass={setMessageClass}/>
        }

<section className="bg-half" style={{backgroundImage: "url('/images/city-4667143_1920.jpeg')"}}>
    <div className="bg-overlay"></div>
    <div className="home-center">
        <div className="home-desc-center" data-aos="fade-in">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="page-next-level text-white">
                            <h1>{(Array.isArray(currentMetaTag) || (typeof currentMetaTag === "object")) ?  `${currentMetaTag.name?.replace("place_name", matchingLocation?.name || "India")}`: "Tags"}</h1>
                            <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                             
                        <p id="breadcrumbs">
                           <span>
                           <span><Link href="/">Home</Link></span> » 
                           {currentMetaTag?.slug && currentMetaTag?
                           <>
                            <span><Link href="/tag">Tag</Link></span> » 
                            <span className="breadcrumb_last" aria-current="page">{currentMetaTag.name?.replace("place_name", matchingLocation?.name || "India")}</span>
                           </>
                           :
                            <span className="breadcrumb_last" aria-current="page">Tag</span>                           
                            }
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

        <h2>{(Array.isArray(currentMetaTag) || (typeof currentMetaTag === "object")) ? `${currentMetaTag.name?.replace("place_name", matchingLocation?.name || "India")}`: "Tags"}</h2>
        <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>

        <div className="row" data-aos="fade-up">
            {(Array.isArray(currentMetaTag) || (typeof currentMetaTag === "object")) ? 
            
                <>
                    {/* Initial loading state */}
                    {matchingItemsLoading && matchingItems.length === 0 && <Loading />}

                    {/* Empty state */}
                    {!matchingItemsLoading && matchingItems.length === 0 && (
                        <h6 className='text-center text-danger'>{noDetailMsg}</h6>
                    )}

                    {/* Items grid */}
                    <div className="row">
                        {matchingItems?.map((item, index) => {
                            const modifiedTitle = item.title?.replace("place_name", matchingLocation?.name || "India");
                            const modifiedSummary = item.summary?.replace("place_name", matchingLocation?.name || "India");
                            // const modifiedUrl = item.url?.replace("place_name", matchingLocation?.slug || "india")
                            let modifiedUrl = item.url;

                            if (item.url_type) {
                                modifiedUrl = updatedMultipage(item);
                            }
                            
                            return (

                        <div className="col-md-4 mb-4" key={item.id || `${item.slug}-${index}` || `item-${index}`}>
                            <article className="post item-post h-100">
                            <div className="post-preview">
                                <Link href={`/${modifiedUrl}`} >
                                <img 
                                    src={item.image_url || '/images/building-3697342_1280.jpg'} 
                                    alt={modifiedTitle} 
                                    className="img-fluid mx-auto d-block"
                                    onError={(e) => {
                                    e.target.src = '/images/building-3697342_1280.jpg';
                                    e.target.alt = "Default item image";            
                                    }}                                     
                                />
                                </Link>
                            </div>

                            <div className="post-header">
                                <h4 className="post-title">
                                <Link href={`/${modifiedUrl}`} >
                                    {modifiedTitle || 'Untitled Item'}
                                </Link>
                                </h4>
                                
                                <ul className="post-meta">
                                    <li>
                                    <i className="fa fa-tag" aria-hidden="true"></i>
                                    {item.company_type_name ?
                                        <Link href={`/${item.company_slug}`} >
                                            <small>&nbsp;{item.company_type_name}</small>
                                        </Link>
                                    :
                                        <Link href="/learn" >
                                            <small>&nbsp;Blog</small>
                                        </Link>
                                    }
                                    </li>
                                </ul>

                                {modifiedSummary && (
                                <div className="post-content">
                                    <p className="text-muted" style={{textAlign:"left", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis"}}>{modifiedSummary}</p>
                                </div>
                                )}

                                <span className="bar"></span>

                                <div className="post-footer">
                                <div className="post-more">
                                    <Link href={`/${modifiedUrl}`} >
                                    Read More <i className="mdi mdi-arrow-right"></i>
                                    </Link>
                                </div>
                                </div>
                            </div>
                            </article>
                        </div>
                        )})}
                    </div>

                    {/* Infinite scroll loader (only visible when loading more items) */}
                    {matchingItemsLoading && matchingItems.length > 0 && <Loading />}

                    {/* Infinite scroll trigger (hidden element) */}
                    <div ref={itemLoaderRef} style={{ height: '1px' }} />
                    </>                        

                :

                <>
                    {/* Loading state (initial load) */}
                    {metaTagsLoading && metaTags?.length === 0 && <Loading />}

                    {/* Empty state */}
                    {!metaTagsLoading && metaTags?.length === 0 && (
                        <h6 className='text-center text-danger'>{noDetailMsg}</h6>
                    )}

                    {/* Meta tags grid */}
                    <div className="row">
                        {metaTags?.filter(item => !item.name?.includes("place_name"))?.map((tag, index) => {
                            const modifiedName = tag.name?.replace("place_name", "India");
                            const modifiedSlug = tag.slug?.replace("place_name", "india");
                            
                            return (
                        <div className="col-md-4" key={tag.slug ? `${tag.slug}-${index}` : `tag-${index}`}>
                            <article className="post item-post">
                            <div className="post-preview">
                                <Link href={`/tag/${modifiedSlug}`} >
                                <img 
                                    src={tag.image || '/images/building-3697342_1280.jpg'} 
                                    alt={modifiedName} 
                                    className="img-fluid mx-auto d-block" 
                                    onError={(e) => {
                                    e.target.src = buildingImage; // Fallback image
                                    }}
                                />
                                </Link>
                            </div>

                            <div className="post-header">
                                <h4 className="post-title">
                                <Link href={`/tag/${modifiedSlug}`} >{modifiedName || 'Untitled Tag'}</Link>
                                </h4>
                                
                                <div className="post-content" style={{maxHeight: "60px", overflowY: "hidden"}}>
                                {tag.description && (
                                    <p>
                                    <span 
                                        dangerouslySetInnerHTML={{
                                        __html: getSanitizedDescription(tag.description)
                                        }} 
                                    />
                                    </p>
                                )}
                                </div>

                                <span className="bar"></span>

                                <div className="post-footer">
                                <div className="post-more">
                                    <Link href={`/tag/${modifiedSlug}`} >
                                    Read More <i className="mdi mdi-arrow-right"></i>
                                    </Link>
                                </div>
                                </div>
                            </div>
                            </article>
                        </div>
                        )})}
                    </div>

                    {/* Bottom loading indicator (for infinite scroll) */}
                    {metaTagsLoading && metaTags?.length > 0 && <Loading />}

                    {/* Error message */}
                    {metaTagsError && (
                        <div className="text-center text-danger my-3">
                        Error loading meta tags: {metaTagsError.message}
                        </div>
                    )}

                    {/* Infinite scroll trigger (hidden observer element) */}
                    {nextMetaParams && !metaTagsError && (
                        <div ref={metaLoaderRef} style={{ height: '1px' }} />
                    )}
                </>

            }            
            
        </div>        
    </div>
</section>    

    </>
  )
}

export default ListMetaTag