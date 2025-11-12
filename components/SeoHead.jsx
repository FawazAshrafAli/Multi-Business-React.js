import React from 'react'
import Head from 'next/head'

const SeoHead = ({
    meta_description, meta_title, metaTags,
    url, blogs = [], currentCompany, pageImage,
    isBlogPage = false, cscTags
}) => {    

    const publishedTime = new Date().toISOString();
  return (
    <Head>
        {/* Static Meta Tags */}        

        <meta name="p:domain_verify" content="28769622c011e3f608ad7f03c6c65528"/>
        <meta name="google-site-verification" content="6age_yBzkuTa9uIkKonb_VO3OFUPZ_eyKxCM48MBLuM" />
        <meta name="msvalidate.01" content="4D196FD7BB898D60AE3855BA5DB31BFB" />
        <meta name="yandex-verification" content="d0dff9991249de3f" />

        <meta name="robots" content="index, follow" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content={currentCompany? currentCompany?.name: "BZIndia"} />        
        <meta name="author" content={currentCompany? currentCompany?.name: "BZIndia"} />

        {/* Dynamic Meta Tags */}
        <link rel="shortcut icon" href={currentCompany? currentCompany?.favicon_url: 'https://bzindia.in/images/Favicon.png'} />
            
        <meta name="description" content={meta_description || ""} />
        {cscTags || metaTags && 
        <meta name="keywords" content={cscTags || metaTags?.map(metaTag => metaTag?.name).join(", ") || ""} />
        }
    
        <link rel="canonical" href={url || ""} />

        <link rel="alternate" hrefLang="en" href={url || ""} />
        <link rel="alternate" hrefLang="x-default" href={url || ""} />
    
        <title>{meta_title || ""}</title>
    
        <meta property="og:type" content={isBlogPage? "article": "website"}/>
    
        <meta property="og:title" content={meta_title || ""} />
    
        <meta property="og:url" content={url || ""} />
    
    
        <meta property="og:description" content={meta_description || ""} />
    
        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta_title || ""} />
        <meta name="twitter:description" content={meta_description || ""} />
        <meta name="twitter:image" content={pageImage? pageImage :currentCompany? currentCompany?.logo_url: "https://bzindia.in/images/logo.svg"} />
        <meta name="twitter:site" content={currentCompany? currentCompany?.x: "https://x.com/Bzindia_in"} />
        <meta name="twitter:creator" content={`@${currentCompany?.name || "Bzindia_in"}`} />
    
        {/* Other meta tags */}
        <meta property="article:publisher" content={currentCompany? currentCompany?.facebook: "https://www.facebook.com/BZindia/"} />
        <meta property="article:published_time" content={publishedTime} />
    
        <meta property="og:image" content={pageImage? pageImage :currentCompany? currentCompany?.logo_url: "https://bzindia.in/images/logo.svg"} />      
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="800" />
        <meta property="og:image:type" content="image/png" />

        <link rel="icon" href={currentCompany? currentCompany?.favicon_url: 'https://bzindia.in/images/Favicon.png'} sizes="32x32"/>
        <link rel="icon" href={currentCompany? currentCompany?.favicon_url: 'https://bzindia.in/images/Favicon.png'} sizes="192x192"/>
        <link rel="icon" href={currentCompany? currentCompany?.favicon_url: 'https://bzindia.in/images/Favicon.png'} sizes="180x180"/>
        <link rel="icon" href={currentCompany? currentCompany?.favicon_url: 'https://bzindia.in/images/Favicon.png'} sizes="270x270"/>

        <script type="application/ld+json">
            {JSON.stringify(
                {
                    "@context": "http://schema.org",
                    "@type": "WebSite",
                    "name": "BZIndia",
                    "url": "https://bzindia.in/"
                },                
            )}
        </script>        
        
        {metaTags && 
        <>
        <script type="application/ld+json">
            {JSON.stringify(
                {
                    "@context": "http://schema.org",
                    "@type": "CollectionPage",
                    "name": "Tags Page",
                    "description": "A page listing various tags for categorizing content.",
                    "url": "https://bzindia.in/tags",
                    "mainEntity": {
                        "@type": "ItemList",
                        "itemListElement": metaTags?.map((metaTag, index) => ({
                            "@type": "ListItem",
                            "position": index+1,
                            "url": `https://bzindia.in/tag/${metaTag.slug || ""}`,
                            "name": metaTag.name || ""                       
                        })) || [],

                    }
                },                
            )}
            </script>    

            <script type="application/ld+json">
            {JSON.stringify(
                {
                    "@context": "http://schema.org",
                    "@type": "WebPage",
                    "mainEntity": {
                        "@type": "CreativeWork",
                        "name": "Keyphrases",
                        "about": metaTags?.map((metaTag) => ({
                            "@type": "Thing",
                            "name": metaTag.name || ""
                        })) || [],
                    } 
                },                    
            )}
            </script>
        </>
        }


            {blogs?.length > 0 &&
            <script type="application/ld+json">
            {JSON.stringify(
                {
                    "@context": "http://schema.org",
                    "@type": "ItemList",
                    "name": "List of Blog Articles",
                    "itemListElement": blogs?.map((blog, index) => (
                        {
                            "@type": "ListItem",
                            "position": index+1,
                            "item": {
                            "@type": "BlogPosting",
                            "headline": blog?.title || "",
                            "image": blog?.image_url || "",
                            "datePublished": blog?.published_date?.split('T')?.[0] || "",
                            "dateModified": blog?.updated?.split('T')?.[0] || "",
                            "author": {
                                "@type": "Person",
                                "name": "Admin"
                            },
                            "publisher": {
                                "@type": "Organization",
                                "name": "BZIndia",
                                "logo": {
                                "@type": "ImageObject",
                                "url": "https://bzindia.in/static/w3/images/logo.jpeg"
                                }
                            },
                            "mainEntityOfPage": {
                                "@type": "WebPage",
                                "@id": blog?.get_absolute_url || ""
                            },
                            "articleBody": blog?.content || "",
                            "keywords": blog?.meta_tags?.map(tag => tag.name).join(", ") || "",
                            "url": blog?.get_absolute_url || "" 
                            }
                        }
                    )) || [],
                },                
            )}
            </script>
            }
    </Head>
  )
}

export default SeoHead