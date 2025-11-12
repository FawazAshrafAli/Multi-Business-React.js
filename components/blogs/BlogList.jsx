import React, { useEffect, useState, useContext, useRef } from 'react'

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

import AOS from 'aos';
import 'aos/dist/aos.css';

import LogoContext from '../context/LogoContext';
import TitleContext from '../context/TitleContext';
import PhoneNumberContext from '../context/PhoneNumberContext';

import company from '../../lib/api/company';

import Loading from '../Loading';
import blog from '../../lib/api/blog';
import BlogContext from '../context/BlogContext';
import AutoPopUp from '../common/AutoPopUp';
import Message from '../common/Message';


const BlogList = ({
    homeContent, category, categorySlug, monthAndYear, currentCompany
}) => {
    const { slug } = useParams();    

    const [message, setMessage] = useState();
    const [messageClass, setMessageClass] = useState();

    const searchParams = useSearchParams()
    const query = searchParams.get("s")

    const [blogs, setGeneralBlogs] = useState([]);
    const [blogsError, setBlogsError] = useState(null);
    const [blogsLoading, setBlogsLoading] = useState(false);

    const [nextParams, setNextParams] = useState('limit=9&offset=0');
    const loaderRef = useRef(null);
    const fetchingRef = useRef(false);

    const { setLogo, resetLogo } = useContext(LogoContext)
    const { setTitle, resetTitle } = useContext(TitleContext)
    const { setPhoneNumber, resetPhoneNumber } = useContext(PhoneNumberContext)    

    const { setBlogs, resetBlogs } = useContext(BlogContext);
    
    
    useEffect(() => {
        if (blogs) {      

        setBlogs(blogs);
        }
    
        return () => {      
            resetBlogs();
        };
    }, [blogs]);

    useEffect(() => {
        if (homeContent) {      

        setTitle(`Learn - ${homeContent?.meta_title}`);
        }

        return () => {      
        resetTitle();
        };
    }, [homeContent]);

    const formatMonthAndYear = (input) => {
        const [year, month] = input.split('/').map(Number);
        const date = new Date(year, month - 1); // month is 0-indexed
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };    
    

    useEffect(() => {
    let baseUrl = slug 
        ? `/company_api/companies/${slug}/blogs`
        : `/blog_api/blogs`;

    if (categorySlug) {
        baseUrl += `?category=${categorySlug}`;
    } else if (monthAndYear) {
        const passingMonthAndYear = monthAndYear.replace("/", "-");
        baseUrl += `?month_and_year=${passingMonthAndYear}`;
    } else if (query) {
        baseUrl += `?s=${query}`;
    }

    setGeneralBlogs([]); // reset on filter change
    setNextParams('limit=9&offset=0');
    fetchBlogs(baseUrl, 'limit=9&offset=0');
}, [slug, categorySlug, query, monthAndYear]);


    const fetchBlogs = async (url, params = undefined) => {
        if (fetchingRef.current) return;
        fetchingRef.current = true;
        setBlogsLoading(true);

        try {
            const separator = url.includes("?") ? "&" : "?";
            const fullUrl = params ? `${url}${separator}${params}` : url;

            let response;
            if (slug) {
                response = await company.getCompanyBlogs(fullUrl);
            } else {
                response = await blog.getBlogs(fullUrl);
            }

            setGeneralBlogs(prev => {
                const existingSlugs = new Set(prev.map(item => item.slug));
                const newItems = response.data.results?.filter(item => !existingSlugs.has(item.slug));
                return [...prev, ...newItems];
            });

            if (response.data.next) {
                const nextUrl = new URL(response.data.next);
                setNextParams(nextUrl.searchParams.toString());
            } else {
                setNextParams(null);
            }
        } catch (err) {
            console.error(err);
            setBlogsError(err);
        } finally {
            setBlogsLoading(false);
            fetchingRef.current = false;
        }
    };


    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && nextParams) {
                    let baseUrl = slug 
                        ? `/company_api/companies/${slug}/blogs`
                        : `/blog_api/blogs`;
                    fetchBlogs(baseUrl, nextParams);
                }
            },
            { rootMargin: "200px", threshold: 0 }
        );

        if (loaderRef.current) observer.observe(loaderRef.current);

        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [nextParams, slug]);


    if (blogsError) console.error(blogsError);

    useEffect(() => {
        if (currentCompany) {
            const { logo_url, meta_title, phone1, phone2 } = currentCompany;
        
            if (logo_url) setLogo(logo_url);
        
            const phones = [phone1, phone2].filter(Boolean).join(' - ');
            if (phones) setPhoneNumber(phones);
            if (meta_title) setTitle(`Learn - ${currentCompany?.meta_title}`);
        }
    
        return () => {
        resetLogo();
        resetPhoneNumber();
        };
    }, [currentCompany]);    

    useEffect(() => {
            AOS.init({
            once: true,
        });
    }, []);    

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
        
        {currentCompany && 
        <AutoPopUp currentCompany={currentCompany} setMessage={setMessage} setMessageClass={setMessageClass}/>
        }
        {message&&
        <Message message={message} messageClass={messageClass} />
        }
        {/*banner-slider start */}
<section className="bg-half" style={{backgroundImage: "url('/images/city-4667143_1920.jpeg')"}}>
    <div className="bg-overlay"></div>
    <div className="home-center">
        <div className="home-desc-center" data-aos="fade-in">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="page-next-level text-white">
                            <h1>{query? `Search: ${query}` : category? `Category: ${category}` : monthAndYear? `Month & Year: ${formatMonthAndYear(monthAndYear)}` : "Blogs"}</h1>
                            <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                             
                        <p id="breadcrumbs">
                           <span>
                           <span><Link href="/">Home</Link></span> » 
                            {currentCompany &&
                            <>                 
                            <span><Link href={`/${currentCompany?.slug}`} >{currentCompany?.sub_type}</Link></span> »         
                            </>
                            }
                            <span className="breadcrumb_last" aria-current="page">{monthAndYear ? `Archives of ${formatMonthAndYear(monthAndYear)}` : 'Blog'}</span>
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

        <h2>{query? `Search: ${query}` : category? `Category: ${category}` : monthAndYear? `Month & Year: ${formatMonthAndYear(monthAndYear)}` : "Blogs"}</h2>
        <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>

        <div className="row" data-aos="fade-up">
            {blogs?.map((blog) => (
                    <div className="col-md-4" key={blog.slug}>
                    {/* POST START */}
                    <article className="post blog-post">
                        <div className="post-preview">
                            <Link href={`${blog?.company_slug ? `/${blog.company_slug}` : ""}/learn/${blog.slug}`} aria-label={`Read More about: ${blog.title}`}><img src={blog.image_url || '/images/building-3697342_1280.jpg'} alt={blog.title} className="img-fluid mx-auto d-block" /></Link>
                        </div>

                        <div className="post-header">
                            <h4 className="post-title"><Link href={`${blog?.company_slug ? `/${blog.company_slug}` : ""}/learn/${blog.slug}`} aria-label={`Read More about: ${blog.title}`}> {blog.title}</Link></h4>
                            <ul className="post-meta">
                                <li><i className="fa fa-calendar" aria-hidden="true"></i> <small>{blog.published_on}</small></li>
                                <li>
                                    <Link href={`${blog?.company_slug ? `/${blog.company_slug}` : ""}/learn/${blog.slug}?category=${blog.category_slug}`}> <small>{blog.category}</small></Link></li>
                            </ul>

                            <div className="post-content">
                                <p className="text-muted" style={{textAlign:"left", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis"}}>{blog.summary}</p>
                            </div>

                            <span className="bar"></span>

                            <div className="post-footer">
                                {/* <div className="likes">
                                    <ul className="post-meta">
                                        <li><a href="#"><i className="far fa-heart mr-1"></i> <small>29</small></a></li>
                                        <li><a href="#"> <i className="far fa-comment mr-1"></i>
                                            <small>40</small></a>
                                        </li>
                                    </ul>
                                </div> */}
                                <div className="post-more"><Link href={`${blog?.company_slug ? `/${blog.company_slug}` : ""}/learn/${blog.slug}`} aria-label={`Read More about: ${blog.title}`}>Read More <i className="mdi mdi-arrow-right"></i></Link></div>
                            </div>
                        </div>
                    </article>
                    {/* POST END */}                
                </div>            
                ))
            }     
            {blogsLoading && <Loading />}
            <div ref={loaderRef} />
                  
            
        </div>

    </div>
</section>
        
            
    </>
  )
}

export default BlogList