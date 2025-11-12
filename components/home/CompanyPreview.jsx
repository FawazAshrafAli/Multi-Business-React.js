import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const CompanyPreview = ({companies}) => {         

  return (
    <>
        <div className="container" data-aos="fade-up">
            <h3>BZindia Group of Joint Ventures</h3>
            <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
            <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12">
                    <div id="verticalTab">
                        <ul className="resp-tabs-list">
                            {companies?.map((company, selectCompanyIndex) => (
                                <li key={company.slug || selectCompanyIndex}>{company?.name}</li>
                            ))}                            
                        </ul>

                        <div className="resp-tabs-container">
                            
                            {companies?.map((company, companyIndex) => (

                                <div key={company.slug || companyIndex}>
                                    <h4 style={{paddingBottom: "10px"}}>{company.name}</h4>
                                    <p className="row">
                                    <span className="col-md-2 home_company_list"><img src={company.logo_url} alt={company.name}/></span>                                  
                                    <span className="col-md-10">{company.summary}</span>  
                                    </p>
                        
                                    <ul className="row list-default" style={{padding:"10px 0 20px 0"}}>
                                        {company.sub_categories?.slice(0,12)?.map((subCategory, subCategoryIndex) => (
                                            <li className="col col-md-6 col-12" key={subCategory.slug || subCategoryIndex + 1} ><Link href={`${subCategory.url}`}>{subCategory.title}</Link></li>
                                        ))}                            
                                    </ul>

                                    <Link href={`/${company.slug}`} className="primary_button">Read More</Link>
                                </div>

                            ))}                            

                            <div style={{clear: "both"}}></div>
            
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </>
  )
}

export default CompanyPreview