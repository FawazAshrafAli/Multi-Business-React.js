
import { Feed } from 'feed';
import blog from '../../../lib/api/blog';
import location from '../../../lib/api/location';
import directory from '../../../lib/api/directory';
import service from '../../../lib/api/service';

export default async function handler(req, res) {
    const {slug, cscSlug} = req.query;

    const siteUrl = 'https://bzindia.in';

    let isCscListingPage, isCscDetailPage = false;
    let state, district;
    let locationData = {};

    const getImageMimeType = (url) => {
        if (url.endsWith('.png')) return 'image/png';
        if (url.endsWith('.webp')) return 'image/webp';
        if (url.endsWith('.jpg') || url.endsWith('.jpeg')) return 'image/jpeg';
        return 'image/*';
    };

    try {
        const stateRes = await location.getState(slug);
        state = stateRes.data;

        const stateCenterRes = await location.getStateCenter(slug);
        const stateCenter = stateCenterRes.data;

        locationData = {
            ...state, 
            "latitude": stateCenter?.latitude, "longitude": stateCenter?.longitude
        }

    } catch (err) {

        const districtRes = await location.getDistrict(slug);
        district = districtRes.data;

        const districtCenterRes = await location.getDistrictCenter(slug);
        const districtCenter = districtCenterRes.data;

        locationData = {
            ...district, 
            "latitude": districtCenter?.latitude, "longitude": districtCenter?.longitude
        }

    }

    if ((district || state)) {
        if (cscSlug.startsWith("common-service-center")) {
            isCscListingPage = true;
        } else {
            const centerRes = await directory.getCsc(cscSlug);
            const center = centerRes.data;

            isCscDetailPage = true;
        }
    }

    let feed;

    if (isCscListingPage) {
        const nearbyCscCentersRes = await location.getNearbyCscCenters(locationData?.latitude, locationData?.longitude);
        const nearbyCscCenters = nearbyCscCentersRes.data;

        const blogsRes = await blog.getBlogs(`/blog_api/blogs`)
        const blogs = (blogsRes.data?.results || [])
              .slice(0, 12)
              .map(b => ({
              id: b.id,
              title: b.title,
              slug: b.slug,
              summary: b.summary,
              image_url: b.image_url,
              published_date: b.published_date,
              updated: b.updated,
              get_absolute_url: b.get_absolute_url,
              content: b.content,
              meta_tags: b.meta_tags,
              }));

        feed = new Feed({
            title: `Common Service Centers - CSC Feed`,
            description: `Common Service Centers near ${locationData?.name}`,
            id: `${siteUrl}/${slug}/csc`,
            link: `${siteUrl}/${slug}/csc`,
            language: 'en',
            image: `${siteUrl}/images/logo.svg`,
            favicon: `${siteUrl}/images/Favicon.png`,
            updated: new Date(),
            generator: 'Feed for Next.js',
            feedLinks: {
            rss2: `${siteUrl}/${slug}/csc/feed`,
            },
            author: {
            name: 'BZIndia',
            link: siteUrl,
            },
        });

        nearbyCscCenters?.forEach((center) => {
            feed.addItem({
            title: `${center.title || center.name}: e-Governance Services, Digital Seva, Common Service Center`,
            id: `${siteUrl}/${center.district?.slug || slug}/csc/${center.slug}`,
            link: `${siteUrl}/${center.district?.slug || slug}/csc/${center.slug}`,
            description: center.meta_description?.slice(0, 300) || `${(center?.name || center?.title)?.toUpperCase()} ${center?.place_name || locationData?.name} provides fast and reliable e-Governance Services, Digital Seva, and online citizen facilities. Visit our Common Service Center in ${center?.place_name || locationData?.name} for government applications, bill payments, PAN, Aadhaar, and other digital services.`,
            date: new Date(center.updated || Date.now()),
            });
        });

        const faqs = [
            {        
                "question": `What services are available at CSCs in ${locationData?.name}?`,          
                "answer": "CSCs offer services such as Aadhaar updates, PAN card applications, utility bill payments, and access to various government schemes."        
            },
            {        
                "question": `Who can use the CSC services in ${locationData?.name}?`,          
                "answer": "All residents, including students, professionals, and senior citizens, can access services at the CSCs."        
            },
            {        
                "question": `How can I locate the nearest CSC in ${locationData?.name}?`,          
                "answer": "You can visit the Digital Seva Portal or inquire locally for the nearest center."        
            },
            {        
                "question": "Are there any fees for CSC services?",          
                "answer": "Yes, minimal charges apply for specific services like certificate issuance and document printing."        
            },
            {        
                "question": `Can I apply for an Aadhaar card at a CSC in ${locationData?.name}?`,          
                "answer": "Yes, Aadhaar enrollment, updates, and biometric authentication services are available."        
            },
            {        
                "question": "What documents are required for availing services at a CSC?",          
                "answer": "Essential documents like identity proof, address proof, and passport-sized photographs are typically required."        
            },
            {        
                "question": `Are CSCs in ${locationData?.name} involved in educational programs?`,          
                "answer": "Yes, CSCs conduct digital literacy training, vocational courses, and PMGDISHA programs."        
            },
            {        
                "question": "How does a VLE assist citizens at the CSC?",          
                "answer": "The VLE helps with form submissions, document verification, and guiding citizens through digital processes."        
            },
        ]

        faqs?.forEach((faq, index) => {
            feed.addItem({
            title: faq.question,
            id: index+1, 
            description: faq.question,
            content: `
                <p><strong>Q:</strong> ${faq.question}</p>
                <p><strong>A:</strong> ${faq.answer}</p>
            `,
            date: new Date(new Date()),
            });
        });

        blogs?.slice(0, 12)?.forEach((post) => {
            let blogUrl = `${siteUrl}/learn/${post.slug}`;

            if (blog.company_slug) {
                blogUrl = `${siteUrl}/${blog.company_slug}/learn/${post.slug}`;
            }

            feed.addItem({
            title: post.title,
            id: blogUrl,
            link: blogUrl,
            description: post.summary?.slice(0,300),
            date: new Date(post.published_on),

                enclosure: post.image_url ? {
                    url: `${post.image_url}`,  
                    type: getImageMimeType(post.image_url)
                } : undefined
            });
        });
    
    } else if (isCscDetailPage) {
        feed = new Feed({
            title: `${center.title || center.name} - CSC Feed`,
            description: `Common Service Centers near ${locationData?.name}`,
            id: `${siteUrl}/${slug}/csc`,
            link: `${siteUrl}/${slug}/csc`,
            language: 'en',
            image: `${siteUrl}/images/logo.svg`,
            favicon: `${siteUrl}/images/Favicon.png`,
            updated: new Date(),
            generator: 'Feed for Next.js',
            feedLinks: {
            rss2: `${siteUrl}/${slug}/csc/feed`,
            },
            author: {
            name: 'BZIndia',
            link: siteUrl,
            },
        });
    }    
 

  res.setHeader('Content-Type', 'application/rss+xml');
  res.write(feed.rss2());
  res.end();
}
