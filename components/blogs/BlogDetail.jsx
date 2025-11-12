import React, { useContext, useEffect, useState } from 'react'

import Link from 'next/link';
import { useParams } from 'next/navigation';

import createDOMPurify from 'dompurify';

import AOS from 'aos';
import 'aos/dist/aos.css';

import LogoContext from '../context/LogoContext';
import TitleContext from '../context/TitleContext';
import PhoneNumberContext from '../context/PhoneNumberContext';

import blog from '../../lib/api/blog';
import company from '../../lib/api/company';

import Loading from '../Loading';

import BlogContext from '../context/BlogContext';
import Message from '../common/Message';
import AutoPopUp from '../common/AutoPopUp';


const BlogDetail = ({blogs, currentCompany, currentBlog}) => {
    const {slug} = useParams();

    // const [currentBlog, setCurrentBlog] = useState();
    // const [currentBlogError, setCurrentBlogError] = useState(null);
    // const [currentBlogLoading, setCurrentBlogLoading] = useState(false);  
    
    const [blogArchives, setBlogArchives] = useState();
    const [blogArchivesLoading, setBlogArchivesLoading] = useState(false);

    const [companies, setCompanies] = useState([]);
    const [companiesLoading, setCompaniesLoading] = useState(false);  

    const { setLogo, resetLogo } = useContext(LogoContext)
    const { setTitle, resetTitle } = useContext(TitleContext)
    const { setPhoneNumber, resetPhoneNumber } = useContext(PhoneNumberContext)    

    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState();
    const [messageClass, setMessageClass] = useState();     

    const [sanitizedContent, setSanitizedContent] = useState([]);

    const { setBlogs, resetBlogs } = useContext(BlogContext);


    useEffect(() => {
        if (currentCompany) {      

        setBlogs(currentCompany?.blogs || blogs);
        } else {
            setBlogs(blogs);
        }
    
        return () => {      
        resetBlogs();
        };
    }, [currentCompany, blogs]);

    useEffect(() => {            
    
            if (typeof window === 'undefined' || !currentBlog) return;
                            
            const DOMPurify = createDOMPurify(window);
            const sanitized = DOMPurify.sanitize(currentBlog.content || '')
            
    
            setSanitizedContent(sanitized);
    
        }, [currentBlog]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Form
    const handleSubmit = (e) => {
        e.preventDefault();

        window.location.href=`/learn/?s=${formData.s}`;
    };

    // Blog
    // useEffect(() => {
    //     const fetchCurrentBlog = async () => {
    //         try {
    //             const response = await blog.getBlog(blogSlug);           
    //             setCurrentBlog(response.data);
    //         } catch (err) {
    //             setCurrentBlogError(err);
    //         } finally {
    //             setCurrentBlogLoading(false);
    //         }
    //     };

    //     fetchCurrentBlog();
    // }, [blogSlug]);

    // Blogs
    useEffect(() => {

        const fetchBlogArchives = async() => {
            if (!slug) {
                try {
                    const response = await blog.getBlogArchives();

                    setBlogArchives(response.data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setBlogArchivesLoading(false);
                }
            } else {
                try {
                    const response = await company.getCompanyBlogArchives(slug);
                    setBlogArchives(response.data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setBlogArchivesLoading(false);
                }
            }

        }

        // fetchBlogs();
        fetchBlogArchives();
    }, [slug]);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await company.getBaseCompanies();           
                setCompanies(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setCompaniesLoading(false);
            }
        };

        fetchCompanies();
        
    }, []);    

    useEffect(() => {
        if (currentCompany) {
        const { logo_url, meta_title, phone1, phone2 } = currentCompany;
    
        if (logo_url) setLogo(logo_url);
        if (currentBlog) setTitle(currentBlog.meta_title || currentBlog.title);
    
        const phones = [phone1, phone2].filter(Boolean).join(' - ');
        if (phones) setPhoneNumber(phones);
        }
    
        return () => {
        resetLogo();
        resetTitle();
        resetPhoneNumber();
        };
    }, [currentCompany, currentBlog]);

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
                            <h1>{currentBlog?.title}</h1>
                            <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                             
<p id="breadcrumbs">
                           <span>
                           <span><Link href="/">Home</Link></span> » 
                            {currentCompany && 
                            <>
                                <span><Link href={`/${currentCompany?.slug}`} >{currentCompany?.sub_type}</Link></span> » 
                            </>
                            }
                            <span><Link href={`${currentCompany? `/${currentCompany?.slug}` : ""}/learn`} >Blogs</Link></span> » 
                            <span className="breadcrumb_last" aria-current="page">{currentBlog?.title}</span>
                           </span>
                           </p>

                        </div>
                    </div>  
                    
                    
                    
               
                    
                </div>
            </div>
        </div>
    </div>
</section>


 

 {/*  */}
 <section className="section py-5 h2_second">
    <div className="container">
        <div className="row">
           

            {/* BLOG POST START */}
            <div className="col-md-8">
                {/* Post Start */}
                {
                <article className="post m-0">
                    <div className="post-preview">
                        <a href={currentBlog?.image_url || '/images/city-4667143_1920.jpeg'} target="_blank"><img src={currentBlog?.image_url || '/images/city-4667143_1920.jpeg'} alt={currentBlog?.title} className="img-fluid mx-auto d-block"/></a>
                    </div>

                    <div className="post-header">
                        <ul className="post-meta">
                            <li><i className="mdi mdi-calendar"></i> <small>{currentBlog?.published_on}</small></li>
                            <li><i className="mdi mdi-tag-text-outline"></i>
                                <a href={`/learn/?category=${currentBlog?.category || ""}`} > <small>{currentBlog?.category}</small></a></li>
                        </ul>
                        
                        <div className="post-content">
                            <div dangerouslySetInnerHTML={{__html: sanitizedContent}}/>
                        </div>
                    </div>
                </article>
                } 
                
            </div>

             {/* SIDEBAR */}
             <div className="col-lg-4 col-md-4">
                {/* SEARCH */}
                <div className="sidebar p-30">
                    <div className="text-center">
                        <div id="search-2" className="widget widget-search mb-0">
                            <form role="search" method="get" id="searchform" className="searchform" onSubmit={handleSubmit}>
                                <div>
                                    <input type="text" value={formData?.s || ''} name="s" id="s" onChange={handleChange} placeholder="Search..."/>
                                    <input type="submit" id="searchsubmit" value="Search"/>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {/* SEARCH */}

                {/* Categories widget*/}
                <div className="sidebar p-30">
                    <div className="widget widget_categories">
                        <h4 className="text-uppercase text-center">Categories</h4>
                        <ul className="list-unstyled">                            
                            {companies?.filter(company => company.blogs_count > 0 ).map((company, index) => (
                                <li key={index+1} className="mb-2"><Link href={`/${company.slug}/learn`} >{company.sub_type}</Link> <span className="float-right">({company.blogs_count || 0})</span></li>
                            )) || []}                                                        
                        </ul>
                    </div>
                </div>
                {/* Categories widget*/}
                
                {/* TAG */}
                <div className="sidebar p-30">
                    <div className="widget">
                        <h4 className="text-uppercase text-center">Tags</h4>
                        <div className="text-center tagcloud">
                            {currentBlog?.meta_tags?.map((meta_tag, index) => <a key={meta_tag.slug || index + 1} href={`/tag/${meta_tag.slug}`}>{meta_tag.name}</a>) || []}                            
                        </div>
                    </div>
                </div>
                {/* TAG */}

                {/* Recent Post */}
                <div className="sidebar p-30">
                    <div className="widget">
                        <h4 className="text-uppercase text-center">Recent Post</h4>
                        <div className="slider single">                            
                            <ul className="list-default">
                                {blogs?.slice(0,5).map(blog => <li key={blog?.slug}><Link href={`${blog?.company_slug ? `/${blog.company_slug}` : ""}/learn/${blog.slug}`} >{blog?.title}</Link></li>) || []}
                            </ul>                            
                        </div>
                    </div>
                </div>                                
                {/* Recent Post */}

                {/* Archives */}
                <div className="sidebar p-30">
                    <div className="widget widget_categories">
                        <h4 className="text-uppercase text-center">Archives</h4>
                        <ul className="list-unstyled">
                            {blogArchivesLoading ? <Loading/>
                            :
                                blogArchives?.map((archive, index) => (
                                    <li className="mb-2" key={index + 1}><Link href={`/${archive.endpoint}`} to="_blank">{archive.published_month_and_year}</Link> <span className="float-right">{archive.published_month_count}</span></li>
                                )) || []                         
                            }
                        </ul>
                    </div>
                </div>
                {/* Archives */}

                {/* FOLLOW */}
                {/* <div className="sidebar p-30">
                    <div className="widget">
                        <h4 className="text-uppercase text-center">Subscribe &amp; Follow</h4>
                        <ul className="list-unstyled social-icon text-center">
                            <li className="list-inline-item"><a href="#"><i className="mdi mdi-facebook"></i></a></li>
                            <li className="list-inline-item"><a href="#"><i className="mdi mdi-twitter"></i></a></li>
                            <li className="list-inline-item"><a href="#"><i className="mdi mdi-instagram"></i></a></li>
                            <li className="list-inline-item"><a href="#"><i className="mdi mdi-dribbble"></i></a></li>
                            <li className="list-inline-item"><a href="#"><i className="mdi mdi-whatsapp"></i></a></li>
                            <li className="list-inline-item"><a href="#"><i className="mdi mdi-behance"></i></a></li>
                        </ul>
                    </div>
                </div> */}
                {/* FOLLOW */}
            </div>
            {/* SIDEBAR */}
        </div>
    </div>
</section>
{/* Blog Details End */}    
    
    </>
  )
}

export default BlogDetail