import SeoHead from '../../../../components/SeoHead';
import location from '../../../../lib/api/location';
import ListCsc from '../../../../components/csc/ListCsc';
import DetailCsc from '../../../../components/csc/DetailCsc';
import directory from '../../../../lib/api/directory';
import course from '../../../../lib/api/course';
import service from '../../../../lib/api/service';
import registration from '../../../../lib/api/registration';
import product from '../../../../lib/api/product';
import metaTag from '../../../../lib/api/metaTag';
import blog from '../../../../lib/api/blog';
import Head from 'next/head';

export default function ListFaqPage({
  locationData, 
  isCscListingPage, isCscDetailPage, 
  childPlace, parentPlace, 
  slug, localSlug,
  center,fullPath,
  courseDetailPages, serviceDetailPages, registrationDetailPages, productDetailPages,
  metaTags, blogs, faqs,
  structuredData, nearbyCenters
}) {

  return (
    <>
      <>
        {isCscDetailPage ?
          <SeoHead
          meta_title={`${center?.title}: e-Governance Services, Digital Seva, Common Service Center`}
          meta_description={`${(center?.name || center?.title)?.toUpperCase()} ${center?.place_name || locationData?.name} provides fast and reliable e-Governance Services, Digital Seva, and online citizen facilities. Visit our Common Service Center in ${center?.place_name || locationData?.name} for government applications, bill payments, PAN, Aadhaar, and other digital services.`}          

          blogs={blogs}
          metaTags={metaTags}
          cscTags={`${(center?.name || center?.title)?.toUpperCase()} ${center?.place_name || locationData?.name}, Digital Seva Kendra ${center?.place_name || locationData?.name}, Common Service Center ${center?.place_name || locationData?.name}, e-Governance Services ${center?.place_name || locationData?.name}, Online Services ${center?.place_name || locationData?.name}, CSC Near Me, Digital India Services`}
          isCscDetailPage={true}
          url = {`https://bzindia.in/${slug}/csc/${localSlug}`}          
          />       
        
        : isCscListingPage ?
          <SeoHead
          meta_description={`CSC (Common Service Centres) in ${locationData?.name}, ${locationData?.district_name || locationData?.state_name}`}
          meta_title={`Common Service Centers ${locationData?.name}`}

          blogs={blogs}
          url = {`https://bzindia.in/${slug}/csc/${localSlug}`}
          />

        : null}


        <Head>
          {structuredData.map((schema, i) => (
            <script key={i} type="application/ld+json">
              {schema}
            </script>
          ))}
        </Head>    
          
        {isCscListingPage ?
          <ListCsc 
          locationData={locationData}
          childPlace={childPlace}
          parentPlace={parentPlace}
          initialNearbyCenters = {nearbyCenters}
          blogs={blogs}
          faqs={faqs}
          />
          
        : isCscDetailPage ? 
          <DetailCsc
          center={center}
          fullPath={fullPath}
          locationData={locationData}
          slug={slug}
          courseDetailPages={courseDetailPages}
          serviceDetailPages={serviceDetailPages}
          registrationDetailPages={registrationDetailPages}
          productDetailPages={productDetailPages}
          metaTags={metaTags}
          blogs={blogs}
          initialNearbyCenters = {nearbyCenters}
          />
          
        : null
        }
        
        </>
      
    </>
  );
}

export async function getServerSideProps(context) {
  try {    
    const fullPath = context.resolvedUrl;
    const {slug, localSlug} = context.params;

    let isCscListingPage, isCscDetailPage = false
    let district, center, place;

    let locationData;

    let locationSlug;
    if (localSlug.startsWith("common-service-center-")) {
      locationSlug = localSlug.replace("common-service-center-", "");

      if (locationSlug) {
        try {
          const districtRes = await location.getMinimalDistrict(locationSlug);
          district = districtRes.data;

          const districtCenterRes = await location.getDistrictCenter(locationSlug);
          const districtCenter = districtCenterRes.data;

          locationData = {
            ...district, 
            "latitude": districtCenter?.latitude, "longitude": districtCenter?.longitude
          }

          if (district?.state_slug === slug) {          
            isCscListingPage = true;
          }
        
        } catch (err) {
          
          const placeRes = await location.getMinimalPlace(locationSlug);
          place = placeRes.data;          
          
          const placeCenterRes = await location.getPlaceCenter(locationSlug);
          const placeCenter = placeCenterRes.data;

          locationData = {
            ...place, 
            "latitude": placeCenter?.latitude, "longitude": placeCenter?.longitude
          }

          if (place?.district_slug === slug) {          
            isCscListingPage = true;
          }
        
        }
      }
    }

    if (!isCscListingPage) {
      const centerSlug = localSlug;
      const centerRes = await directory.getCsc(centerSlug);
      center = centerRes.data;
      
      const placeName = center?.place_name;
      const districtName = center?.district_name;
      
      if (center?.district?.slug === slug || center?.state?.slug === slug) {
        isCscDetailPage = true;              
      
      } else {
        throw new Error("Not a csc center detail page");
      }

      try {
        const districtRes = await location.getMinimalDistricts(slug, `name=${districtName}`);
        const district = districtRes.data?.[0]

        if (!district) throw new Error(`District not found for name: "${districtName}"`);

        try {
          const placeRes = await location.getMinimalPlaces(district?.slug, `name=${placeName}`);
          const place = placeRes.data?.[0]

          if (!place) throw new Error(`Place not found for name: "${placeName}"`);

          const placeCenterRes = await location.getPlaceCenter(place?.slug);
          const placeCenter = placeCenterRes.data;

          locationData = {
            "name": place?.name, "slug": place?.slug,
            "district_name": place?.district_name, "district_slug": place?.district_slug,
            "state_name": place?.state_name, "state_slug": place?.state_slug,
            "pincode": place?.pincode,
            "latitude": placeCenter?.latitude, "longitude": placeCenter?.longitude
          }

        } catch (err) {
          const districtCenterRes = await location.getDistrictCenter(district?.slug);
          const districtCenter = districtCenterRes.data;

          locationData = {
            "name": district?.name, "slug": district?.slug,
            "state_name": district?.state_name, "state_slug": district?.state_slug,
            "latitude": districtCenter?.latitude, "longitude": districtCenter?.longitude
          }
        }        

      } catch (err) {

        try {
          const stateRes = await location.getState(slug);
          const state = stateRes.data;
    
          const stateCenterRes = await location.getStateCenter(slug);
          const stateCenter = stateCenterRes.data;  
          
          locationData = {
            ...state,
            "latitude": stateCenter?.latitude, "longitude": stateCenter?.longitude
          }

        } catch (err) {
          const districtRes = await location.getMinimalDistrict(slug);
          const district = districtRes.data;
    
          const districtCenterRes = await location.getDistrictCenter(slug);
          const districtCenter = districtCenterRes.data;

          locationData = {
            ...district,

            "district_name": district?.name, "district_slug": district?.slug,
            "state_name": district?.state_name, "state_slug": district?.state_slug,
            "latitude": districtCenter?.latitude, "longitude": districtCenter?.longitude
          }
          
        }
      }

    }

    let courseDetailPages, serviceDetailPages, registrationDetailPages, productDetailPages, metaTags;

    const [
      nearbyCentersRes,
      blogsRes
    ] = await Promise.all([
      location.getNearbyCscCenters(locationData?.latitude, locationData?.longitude),
      blog.getBlogs(`/blog_api/blogs`)
    ]);

    const nearbyCenters = nearbyCentersRes?.data;

    const blogs = (blogsRes.data.results || [])
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

    let structuredData = [];
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

    if (isCscListingPage) {

      structuredData = [
        JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [

            /* A) Listing page container */
            {
              "@type": ["WebPage","CollectionPage"],
              "@id": `https://bzindia.in/${slug}/csc/${localSlug}#page`,
              "name": `CSC (Common Service Centres) in ${locationData?.name}, ${locationData?.district_name || locationData?.state_name}`,
              "url": `https://bzindia.in/${slug}/csc/${localSlug}`,
              "description": `Nearby CSC (Common Service Centres) in ${locationData?.name}, ${locationData?.district_name || locationData?.state_name} for government e-services, citizen facilitation, and scheme applications.`,
              "image": "https://bzindia.in/images/csc_logo.jpg",
              "isPartOf": { "@type": "WebSite", "url": "https://bzindia.in", "name": "BZIndia" },
              "spatialCoverage": {
                "@type": "AdministrativeArea",
                "name": locationData?.name || "",
                "containedInPlace": {
                  "@type": "AdministrativeArea",
                  "name": locationData?.district_name || locationData?.state_name || "",
                  "containedInPlace": { "@type": "Country", "name": "IN" }
                },
                "geo": { "@type": "GeoCoordinates", "latitude": locationData?.latitude, "longitude": locationData?.longitude }
              }
            },

            /* B) Breadcrumbs */
            {
              "@type": "BreadcrumbList",
              "@id": `https://bzindia.in/${locationData?.district_slug || locationData?.state_slug}/csc/csc-centres-in-${locationData?.slug}#breadcrumbs`,
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://bzindia.in/" },
                { "@type": "ListItem", "position": 2, "name": locationData?.district_name || locationData?.state_name, "item": `https://bzindia.in/${locationData?.district_slug || locationData?.state_slug}` },
                { "@type": "ListItem", "position": 3, "name": "CSC", "item": `https://bzindia.in/${locationData?.district_slug || locationData?.state_slug}/csc` },
                { "@type": "ListItem", "position": 4, "name": `CSC Centres in ${locationData?.name}`, "item": `https://bzindia.in/${locationData?.district_slug || locationData?.state_slug}/csc/csc-centres-in-${locationData?.slug}` }
              ]
            },

            /* C) FAQ (keep Q/A visible on the page) */
            {
              "@type": "FAQPage",
              "@id": "https://bzindia.in/kerala/csc/csc-centres-in-malappuram#faq",
              "mainEntity": faqs?.map(faq =>({
                  "@type": "Question",
                  "name": faq.question || "",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                  }
                }))  
            },

            /* D) ItemList of CSC centres */
            {
              "@type": "ItemList",
              "@id": `https://bzindia.in/${locationData?.district_slug || locationData?.state_slug}/csc/csc-centres-in-${locationData?.slug}#list`,
              "name": "Nearby Common Service Centres (CSC) List",
              "itemListOrder": "http://schema.org/ItemListOrderAscending",
              "itemListElement": [

                /* 1) CSC Centre — Malappuram Town */
                nearbyCenters?.map((csc, index) => {
                  let cscPhoneNumber = csc?.contact_number || csc?.mobile_number || csc?.whatsapp_number || "";
      
                  if (!cscPhoneNumber.startsWith(+91)) {
                    cscPhoneNumber = `+91-${cscPhoneNumber}`;
                  }
                  
                  return({
                  "@type": "ListItem",
                  "position": index + 1,
                  "item": {
                    "@type": "GovernmentOffice",
                    "@id": `https://bzindia.in/${csc.district?.slug || csc.state?.slug === slug && locationSlug}/csc/${csc?.slug}#govoffice`,
                    "name": csc.title || csc.name || "",
                    "image": "https://bzindia.in/media/csc_logo.jpg",
                    "telephone": cscPhoneNumber ? `+91-${cscPhoneNumber}`: "",
                    "url": `https://bzindia.in/${csc.district?.slug || csc.state?.slug === slug && locationSlug}/csc/${csc.slug}`,
                    "sameAs": [
                      `https://maps.google.com/?q=${csc.latitude},${csc.longitude}`
                    ],
                    "address": {
                      "@type": "PostalAddress",
                      "streetAddress": csc.place_name || csc.street,
                      "addressLocality": csc.district_name || csc.district?.name || "",
                      "addressRegion": csc.state_name || csc.state?.name || "",
                      "postalCode": csc.pincode || "",
                      "addressCountry": "IN"
                    },
                    "geo": { "@type": "GeoCoordinates", "latitude": csc.latitude, "longitude": csc.longitude },
                    "department": {
                      "@type": "GovernmentOrganization",
                      "name": "Ministry of Electronics and Information Technology (MeitY)",
                      "url": "https://www.meity.gov.in"
                    },
                    "serviceArea": {
                      "@type": "GeoCircle",
                      "geoMidpoint": { "@type": "GeoCoordinates", "latitude": csc.latitude, "longitude": csc.longitude },
                      "geoRadius": "5000"
                    },
                    "openingHoursSpecification": [
                      { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "09:00", "closes": "18:00" },
                      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "10:00", "closes": "16:00" }
                    ],
                    "amenityFeature": [
                      { "@type": "LocationFeatureSpecification", "name": "Parking", "value": true },
                      { "@type": "LocationFeatureSpecification", "name": "Wheelchair Accessible", "value": true },
                      { "@type": "LocationFeatureSpecification", "name": "Waiting Area", "value": true },
                      { "@type": "LocationFeatureSpecification", "name": "Counter Assistance Available", "value": true },
                      { "@type": "LocationFeatureSpecification", "name": "Water Dispenser", "value": true }
                    ],
                    "aggregateRating": csc.review_count?.length > 0 ? {
                      "@type": "AggregateRating",
                      "ratingValue": "4.6",
                      "reviewCount": "24",
                      "bestRating": "5",
                      "worstRating": "1"
                    }: undefined,
                    "review": csc.review_count?.map(review => ({
                        "@type": "Review",
                        "author": { "@type": "Person", "name": "Arjun K." },
                        "datePublished": "2025-08-25",
                        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
                        "reviewBody": "Quick PAN service and helpful staff."
                      })),
                     
                  }
                })}),
                
              ]
            }
          ]
        }, null, 2)
      ]

    } else if (isCscDetailPage) {
      const companySlug = "all";
      
      const [
          courseRes,
          serviceRes,
          registrationRes,
          productRes,
          metaTagRes,
      ] = await Promise.all([
          course.getSliderDetails(companySlug),
          service.getSliderDetails(companySlug),
          registration.getSliderDetails(companySlug),
          product.getSliderProductDetails(companySlug),
          metaTag.getMetaTags()          
      ]);

      courseDetailPages = (courseRes?.data?.results || [])
          .slice(0, 12)
          .map(c => ({
          id: c.id?? null,
          name: c.course?.name?? null,
          image_url: c.course?.image_url?? null,
          price: c.course?.price?? null,
          url: c.url?? null,
          meta_description: c.meta_description?? null,
          company_name: c.course.company_name?? null,
          company_sub_type: c.course.company_sub_type?? null,
          mode: c.course.mode?? null,
          ending_date: c.course.ending_date?? null,
          starting_date: c.course.starting_date?? null,
          duration: c.course.duration?? null,
          program_name: c.course.program_name?? null,
          rating: c.course.rating?? null,
          rating_count: c.course.rating_count?? null,
          }));

      serviceDetailPages = (serviceRes?.data?.results || [])
          .slice(0, 12)
          .map(s => ({
          id: s.id?? null,
          name: s.name?? null,
          price: s.price?? null,
          image_url: s.image_url?? null,
          duration_count: s.duration_count?? null,
          url: s.url?? null,

          sub_category_name: s.sub_category_name?? null,
          company_sub_type: s.company_sub_type?? null,
          company_logo_url: s.company_logo_url?? null,
          company_slug: s.company_slug?? null,
          category_name: s.category_name?? null,
          meta_description: s.meta_description?? null,
          }));

      registrationDetailPages = (registrationRes?.data?.results || [])
          .slice(0, 12)
          .map(r => ({
          id: r.id?? null,
          title: r.registration?.title?? null,
          price: r.registration?.price?? null,
          url: r.url?? null,
          company_slug: r.company_slug?? null,
          company_sub_type: r.company_sub_type?? null,
          company_logo_url: r.company_logo_url?? null,
          meta_description: r.meta_description?? null,
          image_url: r.registration.image_url?? null,
          sub_type: r.registration.sub_type?? null,
          type_name: r.registration.type_name?? null,

          }));

      productDetailPages = (productRes?.data?.results || [])
          .slice(0, 12)
          .map(p => ({
          id: p.id,
          name: p.product?.name,
          price: p.product?.price,
          image_url: p.product?.image_url,
          url: p.url,

          category: p.product.category_name,
          company_sub_type: p.company_sub_type,
          company_slug: p.company_slug,
          meta_description: p.meta_description,
          sku: p.product.sku,
          rating: p.product.rating,
          rating_count: p.product.rating_count,
          product_reviews: (p.reviews || [])
          .slice(0, 5)
          .map(review => ({
              "review_by": review.review_by,
              "name": review.name ?? null,
              "created": review.created,
              "text": review.text,
              "rating": review.rating,
          })),
        }));

        metaTags = (metaTagRes.data.results || [])
        .slice(0, 12)
        .map(tag => ({"slug": tag.slug, "name": tag.name}));                
    }        
    
    if (isCscDetailPage) {
      let phoneNumber = center?.contact_number || center?.mobile_number || center?.whatsapp_number || "";
      
      if (!phoneNumber.startsWith(+91)) {
        phoneNumber = `+91-${phoneNumber}`;
      }

      const addressListRaw = [center?.street, center?.place_name && `${center?.place_name} Block`, center?.district_name && `${center?.district_name} District`, center?.state_name];

      let addressList = [];

      addressListRaw?.forEach(item => {

        const trimmedItem = item?.trim();

        if (trimmedItem) {
          addressList.push(trimmedItem);
        }
      });

      const address = addressList?.join(", ");

      const sixMonthsLater = new Date();
      sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
      const priceValidUntil = sixMonthsLater.toISOString().split("T")[0];
  
      const articleBody = `<section class="bg-half main_slide_bx" style="padding:20px 0px;background:linear-gradient(61deg, rgba(247,101,31,1) 0%, rgba(255,255,255,1) 50%, rgba(4,103,54,1) 100%), url() no-repeat fixed center top / cover" data-aos="fade-in">
        <div class="container">
          <div class="row">
            <div class="col-2 col-md-1 college-logo"><img src="/images/csc_logo.jpg" alt=""/></div>
            <div class="col-12 col-md-10">
              <div class="college_top_main_bx">
                <h1>${center?.title} – e-Governance Services, Digital Seva, Common Service Center</h1>
                <label>
                  <a href="https://www.google.com/maps?q=11.95819859,79.82296944" target="_blank">
                    <i class="fa fa-map-marker"></i> ${center?.street || center?.place_name}, ${center?.district_name} - ${center?.pincode}, ${center?.state_name}, India
                  </a>
                </label>
                <p style="display:inline-block">
                  <a href="#"><i class="fa fa-share-alt"></i> Share</a>
                </p>
                <p style="display:inline-block">
                  <a href="#write_a_review" style="background:#444"><i class="fa fa-comments" aria-hidden="true"></i> Write a Review</a>
                </p>
                <div class="client_review" style="display:inline-block;background:#ffffff8c;border-radius:5px;padding:3px 10px">
                  <span class="fa fa-star checked" aria-hidden="true"></span>
                  <span class="fa fa-star checked" aria-hidden="true"></span>
                  <span class="fa fa-star checked" aria-hidden="true"></span>
                  <span class="fa fa-star" aria-hidden="true"></span>
                  <span class="fa fa-star" aria-hidden="true"></span>
                </div>
                <p style="display:inline-block;color:#333">1 Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="stick_navbar" style="padding:0;background:#005c9f" data-aos="fade-in">
        <div class="communicate_language"><p>Common Service Centers (CSC) in ${locationData?.name || "India"}</p></div>
        <div class="csc_near_dv">
          <a href="#" id="nearbyCSC" style="padding:3px 15px;font-size:14px"><i class="fa fa-crosshairs" aria-hidden="true"></i> CSC Near Me</a>
        </div>
        <div style="clear:both"></div>

        <toc class="bzindia_toc_scroll">
          <a href="#slug-info">Info</a>
          <a href="#slug-about">About Us</a>
          <a href="#slug-services">Services</a>
          <a href="#slug-faqs">Faq's</a>
          <a href="#articles-section">Articles</a>
          <a href="#slug-tags">Tags</a>
          <a href="#csc-state-wise">CSC State wise</a>
          <a href="#nearby-destinations">Nearby Destinations</a>
          <a href="#slug-location-map">Location Map</a>
          <a href="#slug-contact">Contact Us</a>
          <a href="#slug-apply">Apply Now</a>
        </toc>
      </div>

      <section style="background:#f1f1f1;margin-bottom:20px;padding:0 0 50px 0">
        <div class="container">
          <div class="row" style="padding:40px 0 0 0;text-align:center" data-aos="fade-down">
            <div class="offerd-service-section" style="margin:0">
              <h2 id="slug-info">${center?.title} – e-Governance Services, Digital Seva, Common Service Center</h2>
              <p class="flip"><span class="deg1"></span><span class="deg2"></span><span class="deg3"></span></p>
              <p>
                The ${center?.name || "CSC center"}, located in the <strong><a href="#">${center?.place_name}</a></strong> Block of <strong><a href="#">${center?.district_name}</a></strong> District, <strong><a href="#">${center?.state_name}</a></strong>, is an integral part of the Common Services Centre (CSC) programme under the Government of India's Digital India initiative...
              </p>
            </div>
          </div>
          <ul class="row inner_list_style" id="slug-services">
            <h3 style="text-align:center">OUR SERVICES</h3>
            <p class="flip"><span class="deg1"></span><span class="deg2"></span><span class="deg3"></span></p>
            ${
              center?.registrations
                ?.map(
                  (r, i) =>
                    `<li key="${r?.slug || i + 1}" class="col col-md-3 col-6"><a href="#">${r?.name}</a></li>`
                )
                .join("") || ""
            }
          </ul>
        </div>
      </section>
      `;

      structuredData = [
          JSON.stringify({
            "@context": "http://schema.org",
            "@type": "ItemList",
            "itemListElement": registrationDetailPages?.map((detail, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "GovernmentService",
                  "provider": {
                    "@type": "Organization",
                    "name": detail.company_sub_type || "",
                    "url": `https://bzindia.in/${detail.company_slug}`,
                    "logo": detail.company_logo_url || "",
                    "address": {
                      "@type": "PostalAddress",
                      "streetAddress": locationData?.name || center.company_sub_type || "",
                      "addressLocality": locationData?.district_name || "",
                      "addressRegion": locationData?.state_name || "",
                      "postalCode": locationData?.pincode || "",
                      "addressCountry": "IN"
                    },
                    "location": {
                      "@type": "Place",
                      "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": locationData?.latitude || "",
                        "longitude": locationData?.longitude || ""
                      }
                    }
                  },
                  "name": detail.title || "",
                  "description": detail.meta_description || "",
                  "image": detail.image_url || "",
                  "url": `https://bzindia.in/${detail.url}`
                }
              }))        
          }),

            JSON.stringify({
              "@context": "http://schema.org",
              "@type": "ItemList",
              "itemListElement": productDetailPages?.map(detail => ({
                  "@type": "Product",
                  "name": detail.name || "",
                  "image": detail.image_url || "",
                  "description": detail.meta_description || "",
                  "sku": detail.sku || "",
                  "url": `https://bzindia.in/${detail.url}`,
                  "category": detail.category || "",
                  "offers": {
                    "@type": "Offer",
                    "price": detail.price || "",
                    "priceCurrency": "INR",
                    "availability": "http://schema.org/InStock",
                    "priceValidUntil": priceValidUntil || "",
                    "hasMerchantReturnPolicy": {
                      "@type": "MerchantReturnPolicy",
                      "name": "Return Policy",
                      "description": "No cancellations & Refunds are entertained. Please visit our return policy page for more details.",
                      "url": "https://bzindia.in/return-policy",
                      "applicableCountry": "IN",
                      "returnPolicyCategory": "https://schema.org/NoRefundsReturnPolicy"
                    },
                    "eligibleRegion": {
                      "@type": "Country",
                      "name": "IN"
                    },
                    "eligibleTransactionVolume": {
                      "@type": "PriceSpecification",
                      "priceCurrency": "INR",
                      "minPrice": detail.price || ""
                    }
                  },
                  "aggregateRating": detail?.product?.rating_count > 0 ? {
                      "@type": "AggregateRating",
                      "ratingValue": Number(detail?.product?.rating),
                      "reviewCount": Number(detail?.product?.rating_count)
                  } : undefined,
                  "review": detail?.product?.reviews?.map(review => ({
                      "@type": "Review",
                      "author": {
                          "@type": "Person",
                          "name": review?.review_by || review?.name || ""
                      },                            
                      "datePublished": review?.created || "",
                      "reviewBody": review?.text || "",
                      "reviewRating": {
                          "@type": "Rating",
                          "ratingValue": Number(review.rating)
                      }
                  }))
                })),
                
            }),
          
          JSON.stringify({
            "@context": "http://schema.org",
            "@type": "ItemList",
            "itemListElement": serviceDetailPages?.map((detail, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Service",
                  "provider": {
                    "@type": "Organization",
                    "name": detail.company_sub_type || "",
                    "url": `https://bzindia.in/${detail.company_slug}`,
                    "logo": detail.company_logo_url || "",
                    "address": {
                      "@type": "PostalAddress",
                      "streetAddress": locationData?.name || center.company_sub_type || "",
                      "addressLocality": locationData?.district_name || "",
                      "addressRegion": locationData?.state_name || "",
                      "postalCode": locationData?.pincode || "",
                      "addressCountry": "IN"
                    },
                    "location": {
                      "@type": "Place",
                      "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": locationData?.latitude || "",
                        "longitude": locationData?.longitude || ""
                      }
                    }
                  },
                  "name": detail.name || "",
                  "description": detail.meta_description || "",
                  "image": detail.image_url || "",
                  "url": `https://bzindia.in/${detail.url}`
                }
              })),
              
          }),

          JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Training Courses",
            "description": "A list of available training courses",
            "itemListElement": courseDetailPages?.map(detail => ({
                "@type": "Course",
                "name": detail.name || "",
                "description": detail.meta_description || "",
                "provider": {
                  "@type": "Organization",
                  "name": detail.company_sub_type || ""
                },
                "image": detail.image_url || "",
                "hasCourseInstance": {
                  "@type": "CourseInstance",
                  "courseMode": [detail?.mode || "Online"],
                  "endDate": detail?.ending_date ? detail?.ending_date.split('T')[0] : "",
                  "startDate": detail?.starting_date ? detail?.starting_date.split('T')[0] : "",
                  "courseWorkload": detail?.duration?"P"+detail?.duration+"D": ""
                },
                "offers": {
                  "@type": "Offer",
                  "price": detail?.price || "",
                  "priceCurrency": "INR",
                  "availability": "http://schema.org/InStock",
                  "category": detail?.program_name || ""
                },
                "aggregateRating": detail?.rating_count > 0 ? {
                  "@type": "AggregateRating",
                  "ratingValue": Number(detail?.rating),
                  "bestRating": 5,
                  "ratingCount": Number(detail?.rating_count)
                } : undefined, 
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": locationData?.latitude || "",
                  "longitude": locationData?.longitude || ""
                }
              })),              
          }),

          JSON.stringify({
            "@context": "http://schema.org",
            "@type": "WebSite",
            "url": "https://www.bzindia.in/find/csc/",
            "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.bzindia.in/find/csc/?state=&district=&block=&pincode=&from=googlesl",
            "query-input": "required name=search_term_string"
            }
          }),

          JSON.stringify(
            {
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": center?.title || center.name || "",
              "description": center?.meta_description || `The ${center?.name || "CSC center"}, located in the ${center?.place_name} Block of ${center?.district_name} District, ${center?.state_name}, is an integral part of the Common Services Centre (CSC) programme under the Government of India's Digital India initiative.`,
              "keywords": `${metaTags?.map(metaTag => metaTag?.name) || ""}`,
              "image": [center?.image_url || "https://bzindia.in/images/csc_logo.jpg"],
              "datePublished": center?.created || "",              
              "dateModified": center?.updated || "",
              "author": {
                "@type": "Organization",
                "name": "BZIndia",
                "url": `https://bzindia.in/`
              },
              "articleBody": articleBody? articleBody : ""
            }),

        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Nearby Common Service Centres (CSC) List",
          "itemListElement": nearbyCenters?.map(center =>({
              "@type": "GovernmentOffice",
              "name": `${center?.title} – e-Governance Services, Digital Seva, Common Service Center`,
              "image": center.image_url || "https://bzindia.in/images/csc_logo.jpg",
              "telephone": phoneNumber || "",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": center.place_name || locationData?.place_name || center.title || center.name || "",
                "addressLocality": center.district_name || locationData?.district_name || "",
                "addressRegion": center.state_name || locationData?.state_name || "",
                "postalCode": center.pincode || locationData?.pincode || "",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": center.latitude || locationData?.latitude || "",
                "longitude": center.longitude || locationData?.longitude || ""
              },
              "department": {
                "@type": "GovernmentOrganization",
                "name": "Ministry of Electronics and Information Technology (MeitY)",
                "url": "https://www.meity.gov.in"
              },
              "serviceArea": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": center.latitude || locationData?.latitude || "",
                  "longitude": center.longitude || locationData?.longitude || ""
                },
                "geoRadius": "5000"
              },
              "openingHours": "Mo-Fr 09:00-18:00",
              "amenityFeature": [
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Parking",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Wheelchair Accessible",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Waiting Area",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Counter Assistance Available",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Water Dispenser",
                  "value": true
                }
              ]
            })),
            
        }),

        JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": `What services are provided by ${center?.title}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `The ${center?.name} offers a variety of services including:      
                    Issuance of government certificates like birth, death, income, caste, and domicile.
                    Aadhaar updates and enrollment.
                    Utility bill payments (electricity, water, gas).
                    PAN card and voter ID applications.
                    Banking, insurance, e-commerce, and telemedicine services.`
                }
              },
              {
                "@type": "Question",
                "name": `Where is the ${center?.name} located?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `The ${center?.name} is located in ${address}. It is easily accessible for residents in the surrounding areas.`
                }
              },
              {
                "@type": "Question",
                "name": `What government programs are available through ${center?.name}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `The center facilitates major government programs such as:
                  Aadhaar enrollment and updates.
                  Pradhan Mantri Jan Arogya Yojana (PMJAY) for health services.
                  Digital India initiatives for promoting e-governance.
                  FSSAI registration for small food businesses.`
                }
              },
              
              {
                "@type": "Question",
                "name": `What private sector services does the ${center?.name} provide?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `In collaboration with private organizations, the center offers:
                  Banking services through Digital Seva Kendras.
                  Insurance premium payments.
                  E-commerce support and product delivery.
                  Telemedicine consultations and pharmaceutical assistance.`
                }
              },

              {
                "@type": "Question",
                "name": `Who can access services at ${center?.name}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `The services are available to all citizens, especially those in rural and underserved areas around ${address}. Special focus is given to students, women, and marginalized communities.`
                }
              },

              {
                "@type": "Question",
                "name": `How can I contact the Village Level Entrepreneur (VLE) at the ${center?.name}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `You can visit the ${center?.title} to meet the VLE. They are available during operating hours to assist with your queries and services.`
                }
              },

              {
                "@type": "Question",
                "name": `What skill development and education programs are offered at the ${center?.name}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `The center offers training programs in IT, healthcare, and vocational skills. It also assists with online applications for competitive exams and distance education programs.`
                }
              },

              {
                "@type": "Question",
                "name": `What are the operating hours of ${center?.title}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `The ${center?.name} operates from 9:00 AM to 6:00 PM, Monday to Saturday. It remains closed on public holidays.`
                }
              },
            ]
          }),


          JSON.stringify({
            "@context": "http://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.bzindia.in/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": locationData?.state_name || "",
                "item": `https://www.bzindia.in/${locationData?.state_slug}/`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "CSC",
                "item": `https://www.bzindia.in/${locationData?.state_slug}/csc`
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": center.title || center.name || "",
                "item": `https://www.bzindia.in/${locationData?.state_slug}/csc/${center.slug}`
              },
            ]
          })
      ]
    }

    return {
      props: {        
        locationData: locationData || {},

        isCscListingPage: isCscListingPage || false,
        isCscDetailPage: isCscDetailPage || false,

        childPlace: district || null,
        parentPlace: locationData || null,

        slug: slug || null,
        localSlug: localSlug || null,

        center: center || null,
        fullPath: fullPath || null,

        courseDetailPages: courseDetailPages || [],
        serviceDetailPages: serviceDetailPages || [],
        productDetailPages: productDetailPages || [],
        registrationDetailPages: registrationDetailPages || [],
        metaTags: metaTags || [],
        blogs: blogs || [],

        structuredData: structuredData || [],
        nearbyCenters: nearbyCenters || [],
        faqs: faqs || [],
      },
    };

  } catch (err) {
    console.error(err);

    return {
      props: {        
        locationData: {},

        isCscListingPage: false,
        isCscDetailPage: false,

        childPlace: null,
        parentPlace: null,

        slug: null,
        localSlug: null,

        center: null,
        fullPath:  null,

        courseDetailPages: [],
        serviceDetailPages: [],
        productDetailPages: [],
        registrationDetailPages: [],
        metaTags: [],
        blogs: [],

        structuredData: [],
        nearbyCenters: [],
        faqs: []
      }
    }
  }

}
