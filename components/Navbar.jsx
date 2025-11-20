import React, {useState, useEffect, useContext, Fragment} from 'react'
import company from '../lib/api/company';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LogoContext from './context/LogoContext';
import { useAuth } from "../hooks/useAuth";
import location from '../lib/api/location';
import NearestLocationContext from './context/NearesLocationContext';

const Navbar = () => {
  const router = useRouter();
  const {logo} = useContext(LogoContext)
  const [isOpen, setIsOpen] = useState(false);
  const [openedLink, setOpenedLink] = useState(null);

  const [passingSlug, setPassingSlug] = useState();
  const [isLocationSlug, setIsLocationSlug] = useState(true);  

  const {nearestLocation} = useContext(NearestLocationContext)

  const {slug} = router.query;
  const {multipageParams} = router.query;

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };  

  const updateOpenedLink = (linkId) => {
    setOpenedLink((prev) => (prev === linkId ? null : linkId));
  };

  useEffect(() => {
    if (slug) {
      setPassingSlug(slug);
    } else if (multipageParams?.[0]) {
      if (!(/^\d+$/.test(multipageParams?.[0] ?? ""))) {
        setPassingSlug(multipageParams?.[0]);
      }
    } else {
      setPassingSlug(null);
    }

  }, [slug, multipageParams]);  

  const [currentCompany, setCurrentCompany] = useState();
  const [currentCompanyLoading, setCurrentCompanyLoading] = useState(true);

  const [companyTypes, setCompanyTypes] = useState();
  const [companyTypeError, setCompanyTypeError] = useState(null);
  const [companyTypeLoading, setCompanyTypeLoading] = useState(true)
  
  const { user, loading, refresh, logout } = useAuth();  

  useEffect(() => {
    if (!slug) return;

    const fetchLocation = async () => {
      try {
        const response = await location.getUrlLocation(undefined, slug);
        const locationData = response.data;
        if (!locationData?.match_type) {
          setIsLocationSlug(false);
        }
      } catch (err) {
        console.error(err)
      }

    }

    fetchLocation();

  }, [slug]);

  useEffect(() => {
    if (!passingSlug || isLocationSlug) return;

    const fetchCurrentCompany = async () => {
      try {
        const response = await company.getCompany(passingSlug);
        setCurrentCompany(response.data);
      } catch (err) {
        
      } finally {
        setCurrentCompanyLoading(false);
      }
    };

    fetchCurrentCompany();
  }, [passingSlug, isLocationSlug]);

    useEffect(() => {
      const fetchCompanyTypes = async () => {
        try {
          const response = await company.getNavbarCompanyTypes();
          const passingCompanyTypes = response.data;

          passingCompanyTypes.sort((a, b) => a.name.localeCompare(b.name));       

          if (passingCompanyTypes.length > 3) {
            [passingCompanyTypes[2], passingCompanyTypes[3]] = [passingCompanyTypes[3], passingCompanyTypes[2]];
          }

          setCompanyTypes(passingCompanyTypes);
        } catch (err) {
          setCompanyTypeError(err);
        } finally {
          setCompanyTypeLoading(false);
        }
      };

        fetchCompanyTypes();
    }, [])
    
    const logoutUser = async (e) => {
      e.preventDefault();
      await logout();
      refresh();
      router(0);
    }    

    if (companyTypeError) {
      console.error(companyTypeError);
    }

  return (
    <>
        <nav className="navbar" itemScope="" itemType="http://www.schema.org/SiteNavigationElement">
           <div className="brand-and-icon">
             <Link href="/" className="navbar-brand"><img itemProp="image" src={logo} alt={currentCompany? `${currentCompany?.name} Logo` : "Logo of BZIndia"} style={{maxHeight: "55px"}} /></Link>
             <button type="button" className="navbar-toggler" onClick={toggleMenu}
              aria-controls="navbarSupportedContent"
              aria-expanded={isOpen}
              aria-label="Toggle navigation"
             >
               <i className="fas fa-bars"></i>
             </button>
           </div>
   
           <div className="navbar-collapse" style={isOpen ? {display : "block"} : {display : "none"}}>
             <ul className="navbar-nav">
               <li itemProp="name"><Link itemProp="url" href={`/${slug?slug:''}`}>Home</Link></li>
              
              {!companyTypeLoading &&
                <>
               <li>
                 <a href="#" className="menu-link" onClick={() => updateOpenedLink("company")}>
                   Company
                   <span className="drop-icon">
                     <i className="fas fa-chevron-down"></i>
                   </span>
                 </a>
                 <div className="sub-menu" style={openedLink == "company" ? {display: "block"} : {display: "none"}}>
                    {/* item  */}                                    
                  {companyTypes?.map((companyType, companyTypeIndex) => (
                    <div className="sub-menu-item" key={companyType.slug || companyTypeIndex + 1}>
                    <h4>{companyType.name === "Registration" ? "Startup India" : companyType.name}</h4>
                    <ul>
                      {companyType?.companies?.map((company, companyIndex) => (
                      <li itemProp="name" key={company.slug || companyIndex + 1}><Link href={`/${company.slug}`} >{company.name}</Link></li>
                      )) || []}
                    </ul>
                  </div>
                  )) || []}
                 </div>
               </li>               
               
                {companyTypes?.map((companyType, companyTypeIndex) => (                  
                  <li key={companyType?.slug || companyTypeIndex + 1}>
                    <a href="#" className="menu-link" onClick={() => updateOpenedLink(companyType.slug || companyTypeIndex + 1)}>
                      {companyType.name === "Registration" ? "Startup India" : companyType.name}
                      <span className="drop-icon">
                        <i className="fas fa-chevron-down"></i>
                      </span>
                    </a>
                    <div className="sub-menu" style={openedLink == (companyType.slug || companyTypeIndex + 1) ? {display: "block"} : {display: "none"}}>
                      {/* item  */}
                      {companyType?.companies?.filter(
                        (company) => currentCompany&&currentCompany.company_type == company.company_type ? company.slug === currentCompany.slug : true
                      )
                      .filter(company => company.sub_categories.length > 0)
                      .slice(0,4)?.map((company, companyIndex) => ( 
                        currentCompany?.company_type == company?.company_type || companyType.companies?.filter(company => company.sub_categories.length > 0)?.length < 2 ?
                          <Fragment key={company?.slug || companyIndex + 1}>                          
                            <div className="sub-menu-item">  
                              <ul>                                
                                {company?.sub_categories?.length <= 8 ?
                                  <>
                                    {company?.sub_categories?.slice(0, 7)?.map((subCategory, subCategoryIndex) => (
                                      <li itemProp="name" key={subCategory.slug || subCategoryIndex + 1}><Link itemProp="url" href={subCategory.url}  title={subCategory.title}>{subCategory.title}</Link></li>
                                    )) || []}
                                    {/* <li itemProp="name"><Link className="btn btn-sm border-0 p-0" itemProp="url" href={`/${company.slug}/${company.items_url}`}>View More<i className="fa fa-angle-double-right"></i></Link></li> */}
                                    {nearestLocation && 
                                    <li itemProp="name"><Link className="btn btn-sm border-0 p-0" itemProp="url" href={`/${nearestLocation?.district?.slug || nearestLocation?.state?.slug}/${company.items_url}`}>View More<i className="fa fa-angle-double-right"></i></Link></li>
                                    }
                                  </>
                                  : 
                                  <>
                                    {company?.sub_categories?.slice(0, 8)?.map((subCategory, subCategoryIndex) => (
                                      <li itemProp="name" key={subCategory.slug || subCategoryIndex + 1}><Link itemProp="url" href={subCategory.url}  title={subCategory.title}>{subCategory.title}</Link></li>
                                    )) || []}    
                                  </>
                                }
                              </ul> 
                            </div>
                            <div className="sub-menu-item">  
                              <ul>                                
                                {company?.sub_categories?.length > 7 && company?.sub_categories?.length <= 16 ?
                                  <>
                                    {company?.sub_categories?.slice(8, 15)?.map((subCategory, subCategoryIndex) => (                                                  
                                      <li itemProp="name" key={subCategory.slug || subCategoryIndex + 1}><Link itemProp="url" href={subCategory.url}  title={subCategory.title}>{subCategory.title}</Link></li>
                                    )) || []}
                                    {/* <li itemProp="name"><Link className="btn btn-sm border-0 p-0" itemProp="url" href={`/${company.slug}/${company.items_url}`}>View More<i className="fa fa-angle-double-right"></i></Link></li> */}
                                    {nearestLocation && 
                                    <li itemProp="name"><Link className="btn btn-sm border-0 p-0" itemProp="url" href={`/${nearestLocation?.district?.slug || nearestLocation?.state?.slug}/${company.items_url}`}>View More<i className="fa fa-angle-double-right"></i></Link></li>
                                    }
                                  </>
                                  : 
                                  <>
                                    {company?.sub_categories?.slice(8, 16)?.map((subCategory, subCategoryIndex) => (                                                  
                                      <li itemProp="name" key={subCategory.slug || subCategoryIndex + 1}><Link itemProp="url" href={subCategory.url}  title={subCategory.title}>{subCategory.title}</Link></li>
                                    )) || []}    
                                  </>
                                }
                              </ul> 
                            </div>
                            <div className="sub-menu-item">  
                              <ul>                                
                                {company?.sub_categories?.length > 15 && company?.sub_categories?.length <= 24 ?
                                    <>
                                      {company?.sub_categories?.slice(16, 23)?.map((subCategory, subCategoryIndex) => (                                                  
                                        <li itemProp="name" key={subCategory.slug || subCategoryIndex + 1}><Link itemProp="url" href={subCategory.url}  title={subCategory.title}>{subCategory.title}</Link></li>
                                      )) || []}
                                      {/* <li itemProp="name"><Link className="btn btn-sm border-0 p-0" itemProp="url" href={`/${company.slug}/${company.items_url}`}>View More<i className="fa fa-angle-double-right"></i></Link></li> */}
                                      {nearestLocation && 
                                      <li itemProp="name"><Link className="btn btn-sm border-0 p-0" itemProp="url" href={`/${nearestLocation?.district?.slug || nearestLocation?.state?.slug}/${company.items_url}`}>View More<i className="fa fa-angle-double-right"></i></Link></li>
                                      }
                                    </>
                                    : 
                                    <>
                                      {company?.sub_categories?.slice(16, 24)?.map((subCategory, subCategoryIndex) => (                                                  
                                        <li itemProp="name" key={subCategory.slug || subCategoryIndex + 1}><Link itemProp="url" href={subCategory.url}  title={subCategory.title}>{subCategory.title}</Link></li>
                                      )) || []}    
                                    </>
                                  }
                              </ul> 
                            </div>
                            <div className="sub-menu-item">
                                <ul>
                                  {company?.sub_categories?.slice(24, 31)?.map((subCategory, subCategoryIndex) => (                                                  
                                    <li itemProp="name" key={subCategory.slug || subCategoryIndex + 1}><Link itemProp="url" href={subCategory.url}  title={subCategory.title}>{subCategory.title}</Link></li>
                                  )) || []}                            
                                  {company?.sub_categories?.length > 24 ?
                                    // <li itemProp="name"><Link className="btn btn-sm border-0 p-0" itemProp="url" href={`/${company.slug}/${company.items_url}`}>View More<i className="fa fa-angle-double-right"></i></Link></li>
                                    nearestLocation && 
                                    <li itemProp="name"><Link className="btn btn-sm border-0 p-0" itemProp="url" href={`/${nearestLocation?.district?.slug || nearestLocation?.state?.slug}/${company.items_url}`}>View More<i className="fa fa-angle-double-right"></i></Link></li>
                                    
                                    : ""
                                  }
                                </ul>                               
                            </div>
                          </Fragment>
                          :
                          <div className="sub-menu-item" key={company?.slug || companyIndex + 1}>  
                            <h4>{company?.name}</h4>
                            <ul>
                              {company?.sub_categories?.slice(0, 7)?.map((subCategory, subCategoryIndex) => (                                                  
                                <li itemProp="name" key={subCategory.slug || subCategoryIndex + 1}><Link itemProp="url" href={subCategory.url}  title={subCategory.title}>{subCategory.title}</Link></li>
                              )) || []}
                              {/* <li itemProp="name"><Link className="btn btn-sm border-0 p-0" itemProp="url" href={`/${company.slug}/${company.items_url}`}>View More<i className="fa fa-angle-double-right"></i></Link></li>                               */}
                              {nearestLocation && 
                              <li itemProp="name"><Link className="btn btn-sm border-0 p-0" itemProp="url" href={`/${nearestLocation?.district?.slug || nearestLocation?.state?.slug}/${company.items_url}`}>View More<i className="fa fa-angle-double-right"></i></Link></li>
                              }
                            </ul> 
                          </div>
                        
                      )) || []}
                      
                      {/* end of item  */}                      
                    </div>
                  </li>
                )) || []}                
                             
                 </>
                  }
                 <li>
                 <Link href={`${(currentCompany && passingSlug) ?`/${passingSlug}`:''}/contact-us`} >Contact Us</Link>
               </li>
                {user? (
                    <a href="#"  className="customer_log" onClick={(e) => logoutUser(e)}><i className="fa fa-user-circle-o" aria-hidden="true"></i> Logout</a>
                ):
               <li style={{border:'none'}}>
                 <Link href="#"  className="customer_log"><i className="fa fa-user-circle-o" aria-hidden="true"></i> Sign In</Link>
               </li>              
                }

             </ul>
           </div>
         </nav>
         {/* <Outlet /> */}
    </>
  )
}

export default Navbar