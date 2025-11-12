import React, { useEffect, useState, useContext, useRef } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/router';

import AOS from 'aos';
import 'aos/dist/aos.css';

import Loading from './Loading';
import search from '../lib/api/search';
import TitleContext from './context/TitleContext';

const Results = ({query}) => {
    const router = useRouter();
    const [noDetailMsg, setNoDetailMsg] = useState();        

    const [matchingItems, setMatchingItems] = useState([]);
    const [matchingItemsError, setMatchingItemsError] = useState(null);
    const [matchingItemsLoading, setMatchingItemsLoading] = useState(false);         

    const [nextParams, setNextParams] = useState('limit=9&offset=0');
    const loaderRef = useRef(null);

    const { setTitle, resetTitle } = useContext(TitleContext)

    const [formData, setFormData] = useState({"s": query || ""});            

    const fetchMatchingItems = async() => {  
        if (!query) return;

        setMatchingItemsLoading(true);
        
        try {
            const response = await search.getResults(query, nextParams);
            setMatchingItems(response.data.results);

            if (response.data.next) {
                const urlParams = response.data.next.split('?')[1];
                setNextParams(urlParams);
            } else {
                setNextParams(null);
            }
        } catch (err) {
            setMatchingItemsError(err);
        } finally {
            setMatchingItemsLoading(false);
        }

        if (!matchingItems) {
            let msg = "No Results to Display."            

            setNoDetailMsg(msg)
        }
    };    

    useEffect(() => {
        fetchMatchingItems();
    }, [query]);

    useEffect(() => {
        if (query) setTitle(`You Searched for ${query}`)

        return () => {
            return resetTitle;
        }
    }, [query])

    useEffect(() => {
            AOS.init({
            once: true,
        });
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.query) {
            router.push(`/?s=${formData.query}`)
        }
    }

    [
        matchingItemsError,
    ].map(error => {
        if (error) {
            console.error(error);
        }
    });

  return (
    <>          

        <section className="bg-half" style={{backgroundImage: "url('/images/city-4667143_1920.jpeg')"}} data-aos="fade-in" >
            <div className="banner-sech-bar">
                <div className="banner-serch-bar-cntnt">
                    <h2>SEARCH YOUR NEEDS</h2>                    
                    <form className="search_bx mt-5" role="search">
                        <input className="form-control" type="search" name="s" placeholder="Search" value={formData.s || ""} onChange={(e) => handleChange(e)} aria-label="Search"/>
                        <button className="srch-btn" type="submit"><i className="fas fa-search" onClick={(e) => handleSubmit(e)}></i></button>
                    </form>
                </div>
            </div>

            <div className="bg-overlay"></div>
        </section>


    <section className="cleints-listing-secion py-5 h2_second">
        <div className="container">

            <h2>{`You Searched for ${query}`}</h2>
            <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>

            <div className="row" data-aos="fade-up">
                <>
                    {matchingItemsLoading && matchingItems.length === 0 && <Loading />}

                    {!matchingItemsLoading && matchingItems.length === 0 && (
                        <h6 className='text-center text-danger'>{noDetailMsg}</h6>
                    )}

                    {matchingItems?.map((item, index) => (
                        <div className="col-md-4" key={item.slug+index || index + 1}>
                            <article className="post item-post">
                                <div className="post-preview">
                                    <Link href={`/${item.url}`} ><img src={item.image_url || '/public/images/building-3697342_1280.jpg'} alt={item.title} className="img-fluid mx-auto d-block" style={{maxHeight: "240.8px"}} /></Link>
                                </div>
                                <div className="post-header">
                                    <h4 className="post-title"><Link href={`/${item.url}`} > {item.title?.slice(0,20)}</Link></h4>
                                    <ul className="post-meta">
                                        {/* <li><i className="fa fa-calendar" aria-hidden="true"></i> <small>{item.published}</small></li> */}
                                        <li><i className="fa fa-tag" aria-hidden="true"></i>
                                            <span> <small>&nbsp;{item.company_type_name}</small></span>
                                        </li>
                                    </ul>

                                    <div className="post-content" style={{maxHeight: "60px", overflowY: "hidden"}}>
                                        <p className="text-muted">{item.summary}</p>
                                    </div>

                                    <span className="bar"></span>

                                    <div className="post-footer">                                
                                        <div className="post-more"><Link href={`/${item.url}`} >Read More <i className="mdi mdi-arrow-right"></i></Link></div>
                                    </div>
                                </div>
                            </article>
                        </div>            
                    ))}

                    {matchingItemsLoading && matchingItems.length > 0 && <Loading />}
                    <div ref={loaderRef} style={{ height: '1px' }} />
                </>            
                
            </div>        
        </div>
    </section>    

    {/* <Footer blogs={blogs} blogsLoading={blogsLoading} destinations={destinations} destinationsLoading={destinationsLoading} companies={companies} companiesLoading={companiesLoading} /> */}
  
    </>
  )
}

export default Results