import React, { useEffect } from 'react'

// import "/public/js/script.js"
import Loading from '../Loading'
import Link from 'next/link';

const Faq = ({faqs, loading, companyFaq}) => {
    if (!faqs) return;

    if (!faqs || loading) return <Loading/>;

    useEffect(() => {
        if (!faqs) return;

        import('jquery').then(($) => {
            // window.$ = window.jQuery = $;

            import('/public/js/script.js');
        });
    }, [faqs]);
  return (
    <>        
        {faqs?.length>0?faqs.map((faq, index) => (
            <div itemProp="mainEntity" itemScope itemType="https://schema.org/Question" className="marg_btm_8" key={faq?.slug || index+1}>
                <h6 itemProp="name" className="faqs_accordion">{faq.question}</h6>
                <div className="faqs_panel" itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                    {companyFaq ? 
                        <>
                            <p itemProp="text">{faq.short_answer}..<Link href={`/faqs/${faq.slug}`}  >Read More</Link></p>
                            
                        </>
                    :                
                    <p itemProp="text">{faq.answer}</p>
                    }
                </div>
            </div>
        )):"FAQs are unavailable at this moment."}
    </>
  )
}

export default Faq