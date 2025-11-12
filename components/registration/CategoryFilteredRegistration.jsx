import React, { useEffect, useState } from 'react'
import Loading from '../Loading'
import Link from 'next/link.js';

import slugify from 'slugify';

import company from '../../api/company'

const CategoryFilteredRegistration = ({slug, typeSlug, currentCompany}) => {
    const [category, setCategory] = useState();
    
    const [registrations, setRegistrations] = useState();
    const [registrationsError, setRegistrationsError] = useState(null);
    const [registrationsLoading, setRegistrationsLoading] = useState(false);

    const [nextPage, setNextPage] = useState()
    const [previousPage, setPreviousPage] = useState()    

    const [companyTypeSlug, setCompanyTypeSlug] = useState();    

    useEffect(() => {
        if(!currentCompany) return;

        setCompanyTypeSlug(slugify(currentCompany?.company_type || "", {"lower": true}));

    }, [currentCompany])

    const fetchRegistrations = async(url = undefined) => {
        if (!url) {
            url = `/company_api/companies/${slug}/types/${typeSlug}`;
        }

        try {
            const response = await company.getTypeFilteredRegistrations(url);
            setRegistrations(response.data.registrations.results);
            setCategory(response.data)
            setNextPage(response.data.registrations.next);
            setPreviousPage(response.data.registrations.previous); 
            
        } catch (err) {
            setRegistrationsError(err);
        } finally {
            setRegistrationsLoading(false);
        }
        
    };

    useEffect(() => {
        fetchRegistrations();
    }, [slug, typeSlug])

    const goToPage = (url) => {
        if (!url) return;
        fetchRegistrations(url);
      };

    if (registrationsError) {
        console.error(registrationsError);
    }

  return (
    <>
    {/* <MetaCategoryFiltered company={currentCompany} category={category} />
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
        {registrationsLoading? (
                <Loading/>
            ) : (
                registrations && registrations.length > 0? registrations.map((registration) => (
                    <div className="col-md-4" key={registration.slug}>
                    {/* POST START */}
                    <article className="post registration-post">
                        <div className="post-preview">
                            <Link href={`/${companyTypeSlug&&companyTypeSlug}/${slug}/${registration?.slug}`} ><img src={registration?.image_url || '/images/building-3697342_1280.jpg'} alt={registration.title} className="img-fluid mx-auto d-block" /></Link>
                        </div>

                        <div className="post-header">
                            <h4 className="post-title"><a href="#"> {registration?.name}</a></h4>
                            <ul className="post-meta">
                                {/* <li><i className="fa fa-calendar" aria-hidden="true"></i> <small>{registration.published_on}</small></li> */}
                                {/* <li><i className="fa fa-tag" aria-hidden="true"></i>
                                    <a href="#"> <small>{category?.name}</small></a></li> */}
                            </ul>

                            {/* <div className="post-content">
                                <p className="text-muted">{registration?.summary}</p>
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
                                <div className="post-more"><Link href={`/${companyTypeSlug&&companyTypeSlug}/${slug}/${registration?.slug}`} >Read More <i className="mdi mdi-arrow-right"></i></Link></div>
                            </div>
                        </div>
                    </article>
                    {/* POST END */}                
                </div>            
                )) : <h6 className='text-center text-danger'>Registrations are unavailable for the selected registration type</h6>           
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

export default CategoryFilteredRegistration