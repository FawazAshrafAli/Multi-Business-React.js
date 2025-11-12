import React, {useState} from 'react'
import Loading from '../Loading';
import { useShuffle } from '../../hooks/useShuffle';

const FooterCompanies = ({companies}) => {
    const shuffle = useShuffle();

    const [openAccordion, setOpenAccordion] = useState(null);

    const toggleAccordion = (slug) => {
        setOpenAccordion(openAccordion === slug ? null : slug);
    };

    if (!companies) return <Loading/>;

  return (
    <>
        <div className="row" style={{paddingBottom:"40px"}}>

            {companies?.slice(0,12)?.map((company, index) => {
                const shuffledCategories = shuffle(company.categories || []);

                return (
                    <div className="col col-md-3 col-12" key={company.slug || index + 1}>
                        <button className="accordion" onClick={() => toggleAccordion(company.slug)}>{company.name}</button>
                        <ul className={`panel list-default ${openAccordion === company.slug ? 'active-company-accordian-ul' : ''}`} itemScope="" itemType="http://www.schema.org/SiteNavigationElement">
                            <li itemProp="name"><a itemProp="url" href={`/${company.slug}/about-us`}>About Us</a></li>
                            <li itemProp="name"><a itemProp="url" href={`/${company.slug}/learn`}>Blog</a></li>
                            <li itemProp="name"><a itemProp="url" href={`/${company.slug}/contact-us`}>Contact Us</a></li>
                            <li itemProp="name"><a itemProp="url" href={`/${company.slug}/faqs`}>FAQs</a></li>
                            {shuffledCategories.slice(0, 8).map((category, categoryIndex) => (
                            <li itemProp="name" key={category.slug || categoryIndex + 1}><a itemProp="url" href={`/${company.slug}/${category.slug}`}>{category.name}</a></li>
                            ))}
                        </ul>
                    </div>
                )

            })}               

            </div>
    </>
  )
}

export default FooterCompanies