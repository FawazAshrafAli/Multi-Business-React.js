import React, { useContext, useEffect, useState } from 'react'
import Loading from '../Loading'
import Link from 'next/link.js';

import company from '../../api/company'
import BlogContext from '../context/BlogContext';
import LogoContext from '../context/LogoContext';
import TitleContext from '../context/TitleContext';
import PhoneNumberContext from '../context/PhoneNumberContext';

const CategoryFilteredEducation = ({slug, programSlug, currentCompany}) => {
    const [category, setCategory] = useState();
    
    const [courses, setCourses] = useState();
    const [coursesError, setCoursesError] = useState(null);
    const [coursesLoading, setCoursesLoading] = useState(false);

    const [nextPage, setNextPage] = useState()
    const [previousPage, setPreviousPage] = useState()

    const { setLogo, resetLogo } = useContext(LogoContext);
    const { setTitle, resetTitle } = useContext(TitleContext);
    const { setPhoneNumber, resetPhoneNumber } = useContext(PhoneNumberContext);
    const { setBlogs, resetBlogs } = useContext(BlogContext);

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

    const fetchCourses = async(url = undefined) => {
        if (!url) {
            url = `/company_api/companies/${slug}/programs/${programSlug}`;
        }

        try {
            const response = await company.getProgramFilteredCourses(url);
            setCourses(response.data.courses.results);
            setCategory(response.data)
            setNextPage(response.data.courses.next);
            setPreviousPage(response.data.courses.previous); 
            
        } catch (err) {
            setCoursesError(err);
        } finally {
            setCoursesLoading(false);
        }
        
    };

    useEffect(() => {
        fetchCourses();
    }, [slug, programSlug])

    const goToPage = (url) => {
        if (!url) return;
        fetchCourses(url);
      };

    if (coursesError) {
        console.error(coursesError);
    }

  return (
    <>    
    {/*banner-slider start */}
<section className="bg-half" style={{backgroundImage: "url('/images/city-4667143_1920.jpeg')"}}>
    <div className="bg-overlay"></div>
    <div className="home-center">
        <div className="home-desc-center" data-aos="fade-in">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="page-next-level text-white">
                            <h1>{category?.name}</h1>
                            <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
                             
                            <p id="breadcrumbs">
                           <span>
                                <span><Link href={`/${slug}`} className='breadcrumb-nav' >Home</Link></span> »
                                <span className="breadcrumb_last" aria-current="page">{category?.name}</span>
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

        {/* <h2>Article</h2>
        <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p> */}

        <div className="row" data-aos="fade-up"> 
        {coursesLoading? (
                <Loading/>
            ) : (
                courses && courses.length > 0? courses.map((course) => (
                    <div className="col-md-4" key={course.slug}>
                    {/* POST START */}
                    <article className="post course-post">
                        <div className="post-preview">
                            <Link href={`/${slug}/course/${course.slug}`} ><img src={course?.image_url || '/images/building-3697342_1280.jpg'} alt={course.name} className="img-fluid mx-auto d-block" /></Link>
                        </div>

                        <div className="post-header">
                            <h4 className="post-title"><a href="#"> {course?.name}</a></h4>
                            <ul className="post-meta">
                                {/* <li><i className="fa fa-calendar" aria-hidden="true"></i> <small>{course.published_on}</small></li> */}
                                {/* <li><i className="fa fa-tag" aria-hidden="true"></i>
                                    <a href="#"> <small>{category?.name}</small></a></li> */}
                            </ul>

                            {/* <div className="post-content">
                                <p className="text-muted">{course?.summary}</p>
                            </div> */}

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
                                <div className="post-more"><Link href={`/${slug}/course/${course.slug}`} >Read More <i className="mdi mdi-arrow-right"></i></Link></div>
                            </div>
                        </div>
                    </article>
                    {/* POST END */}                
                </div>            
                )) : <h6 className='text-center text-danger'>No courses in the given category</h6>           
            )}                        
        </div>

        {/* Pagination*/}
        <div className="row mt-4">
            <div className="col-sm-12">
                <ul className="pagination justify-content-center">
                {previousPage&&
                    <li className="next"><a href="?previous" className='d-flex justify-content-center align-items-center' onClick={(e)=>{e.preventDefault(); goToPage(previousPage)}}><i className="fas fa-caret-left"></i></a></li>
                    }
                    {/* <li className="active"><a href="#">1</a></li> */}
                    {/* <li><a href="#">2</a></li>
                    <li><a href="#">3</a></li>
                    <li><a href="#">4</a></li> */}
                    {nextPage&&
                    <li className="prev"><a href="?next" className='d-flex justify-content-center align-items-center' onClick={(e)=>{e.preventDefault(); goToPage(nextPage)}}><i className="fas fa-caret-right"></i></a></li>
                    }
                </ul>
            </div>
        </div>
        {/* Pagination end*/}
    </div>
</section>    
    </>
  )
}

export default CategoryFilteredEducation