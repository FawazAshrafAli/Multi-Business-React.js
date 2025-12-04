
import { Feed } from 'feed';
import location from '../../../lib/api/location';
import company from '../../../lib/api/company';
import service from '../../../lib/api/service';
import course from '../../../lib/api/course';
import registration from '../../../lib/api/registration';
import product from '../../../lib/api/product';
import blog from '../../../lib/api/blog';


export default async function handler(req, res) {
    const {slug} = req.query;

    if (!slug) return null;

    const siteUrl = "https://bzindia.in";

    let currentCompany, state, district;

    let isCompanyPage, isStatePage, isDistrictPage = false;

    // Fetch dynamic content
    try {
        const companyRes = await company.getCompany(slug);
        currentCompany = companyRes.data; 
        
        isCompanyPage = true;
    } catch (err) {

        try {
            const stateRes = await location.getState(slug);
            state = stateRes.data;

            isStatePage = true;
        } catch (err) {

            const districtRes = await location.getDistrict(slug);
            district = districtRes.data;

            isDistrictPage = true;
        }
    }          

    let feed;

    if (isCompanyPage) {

        feed = new Feed({
          title: `${currentCompany?.meta_title || `${currentCompany?.name}`} - Home RSS Feed`,
          description: currentCompany?.meta_description || '',
          id: `${siteUrl}/${slug}`,
          link: `${siteUrl}/${slug}`,
          language: 'en',
          image: currentCompany?.logo_url || `${siteUrl}/images/logo.svg`,
          favicon: currentCompany?.favicon_url || `${siteUrl}/images/Favicon.png`,
          updated: new Date(currentCompany?.updated || new Date()),
          generator: 'Feed for Next.js',
          feedLinks: {
            rss2: `${siteUrl}/${slug}/feed`,
          },
          author: {
            name: currentCompany?.name,
            link: `${siteUrl}/${slug}`,
          },
        });

        // Add companies
        currentCompany?.meta_tags?.forEach((tag) => {
            feed.addItem({
            title: tag.name,
            id: `${siteUrl}/tag/${tag.slug}`,
            link: `${siteUrl}/tag/${tag.slug}`,
            description: tag.meta_description,
            date: new Date(tag.updated),
            });
        });

        // Add blog posts
        currentCompany?.blogs?.forEach((post) => {
            feed.addItem({
            title: post.title,
            id: `${siteUrl}/learn/${post.slug}`,
            link: `${siteUrl}/learn/${post.slug}`,
            description: post.summary?.slice(0, 300),
            date: new Date(post.published_on),
            });
        });

        // Add faq faqs
        currentCompany?.faqs?.forEach((faq) => {
            feed.addItem({
            title: faq.title,
            id: `${siteUrl}/faqs/${faq.slug}`,
            link: `${siteUrl}/faqs/${faq.slug}`,
            description: faq.question,
            content: `
                <p><strong>Q:</strong> ${faq.question}</p>
                <p><strong>A:</strong> ${faq.answer}</p>
            `,
            date: new Date(faq.updated) || new Date(),
            });
        });                                 

        if (currentCompany?.company_type === "Service") {
            const serviceDetailsRes = await service.getDetails(slug);
            const serviceDetails = serviceDetailsRes.data?.results;

            // Add services
            serviceDetails.slice(0, 12).forEach((detailPage) => {
                feed.addItem({
                    title: detailPage.service?.name,
                    id: `${siteUrl}/${detailPage.service?.category_slug}/${detailPage.service?.sub_category_slug}/${detailPage.slug}`,
                    link: `${siteUrl}/${detailPage.service?.category_slug}/${detailPage.service?.sub_category_slug}/${detailPage.slug}`,
                    description: detailPage.meta_description || "",
                    date: new Date(detailPage.updated|| Date.now()),
                });
            });
    
        } else if (currentCompany?.company_type === "Education") {
            const courseDetailsRes = await course.getDetails(slug);
            const courseDetails = courseDetailsRes.data?.results;

            // Add courses
            courseDetails.slice(0, 12).forEach((detailPage) => {
                feed.addItem({
                    title: detailPage.course?.name,
                    id: `${siteUrl}/${detailPage.course?.program_slug}/${detailPage.course?.specialization_slug}/${detailPage.slug}`,
                    link: `${siteUrl}/${detailPage.course?.program_slug}/${detailPage.course?.specialization_slug}/${detailPage.slug}`,
                    description: detailPage.meta_description || "",
                    date: new Date(detailPage.updated || Date.now()),
                });
            });
        } else if (currentCompany?.company_type === "Registration") {
            const registrationDetailsRes = await registration.getDetails(slug);
            const registrationDetails = registrationDetailsRes.data?.results;

            // Add registrations
            registrationDetails.slice(0, 12).forEach((detailPage) => {
                feed.addItem({
                    title: detailPage.registration?.title,
                    id: `${siteUrl}/${detailPage.registration?.sub_type?.type_slug}/${detailPage.registration?.sub_type?.slug}/${detailPage.slug}`,
                    link: `${siteUrl}/${detailPage.registration?.sub_type?.type_slug}/${detailPage.registration?.sub_type?.slug}/${detailPage.slug}`,
                    description: detailPage.meta_description?.slice(0,300) || detailPage.summary?.slice(0,300) || "",
                    date: new Date(detailPage.updated || Date.now()),
                });
            });
        } else if (currentCompany?.company_type === "Product") {
            const productDetailsRes = await product.getProductDetails(slug);
            const productDetails = productDetailsRes.data?.results; 

            // Add products
            productDetails.slice(0, 12).forEach((detailPage) => {
                feed.addItem({
                    title: detailPage.product?.name,
                    id: `${siteUrl}/${detailPage.product?.category_slug}/${detailPage.product?.sub_category_slug}/${detailPage.slug}`,
                    link: `${siteUrl}/${detailPage.product?.category_slug}/${detailPage.product?.sub_category_slug}/${detailPage.slug}`,
                    description: detailPage.meta_description || "",
                    date: new Date(detailPage.updated || Date.now()),
                });
            });
        }

    } else if (isStatePage || isDistrictPage) {
        feed = new Feed({
          title: `${state?.name || district?.name} - ${isStatePage?"State":"District"} RSS Feed`,
          description: `List of services available in ${state?.name || district?.name}`,
          id: `${siteUrl}/${slug}`,
          link: `${siteUrl}/${slug}`,
          language: 'en',
          image: `${siteUrl}/images/logo.svg`,
          favicon: `${siteUrl}/images/Favicon.png`,
          updated: new Date(Date()),
          generator: 'Feed for Next.js',
          feedLinks: {
            rss2: `${siteUrl}/${slug}/feed`,
          },
          author: {
            name: "BzIndia",
            link: `${siteUrl}/${slug}`,
          },
        });

        const getImageMimeType = (url) => {
            if (url.endsWith('.png')) return 'image/png';
            if (url.endsWith('.webp')) return 'image/webp';
            if (url.endsWith('.jpg') || url.endsWith('.jpeg')) return 'image/jpeg';
            return 'image/*';
        };

        const [            
            serviceSubCategoriesRes, registrationSubTypesRes,
            productSubCategoriesRes, courseSpecializationsRes,
            blogsRes
        ] = await Promise.all([            
            service.getSubCategories("all"), 
            registration.getRegistrationSubTypes("all"),
            product.getSubCategories("all"),
            course.getSpecializations("/course_api/companies/all/specializations"),
            blog.getBlogs(`/blog_api/blogs`)
        ])        

        const serviceSubCategories = serviceSubCategoriesRes?.data?.results;
        const registrationSubTypes = registrationSubTypesRes?.data?.results;
        const productSubCategories = productSubCategoriesRes?.data?.results;
        const courseSpecializations = courseSpecializationsRes?.data?.results;
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

        serviceSubCategories.slice(0, 12).forEach((subCat) => {
            feed.addItem({
                title: subCat.name,
                id: `${siteUrl}/${district?.state?.slug || state?.slug}/more-services/${subCat.location_slug || subCat.slug}-${district?.slug || state?.slug}`,
                link: `${siteUrl}/${district?.state?.slug || state?.slug}/more-services/${subCat.location_slug || subCat.slug}-${district?.slug || state?.slug}`,
                description: subCat.meta_description?.slice(0,300) || "",
                date: new Date(subCat.updated|| Date.now()),

                enclosure: subCat.image_url ? {
                    url: `${subCat.image_url}`,  
                    type: getImageMimeType(subCat.image_url)
                } : undefined
            });
        });

        registrationSubTypes.slice(0, 12).forEach((subType) => {
            feed.addItem({
                title: subType.name,
                id: `${siteUrl}/${district?.state?.slug || state?.slug}/startup-services/${subType.location_slug || subType.slug}-${district?.slug || state?.slug}`,
                link: `${siteUrl}/${district?.state?.slug || state?.slug}/startup-services/${subType.location_slug || subType.slug}-${district?.slug || state?.slug}`,
                description: subType.meta_description?.slice(0,300) ||  "",
                date: new Date(subType.updated || Date.now()),

                enclosure: subType.image_url ? {
                    url: `${subType.image_url}`,  
                    type: getImageMimeType(subType.image_url)
                } : undefined
            });
        });

        productSubCategories.slice(0, 12).forEach((subCat) => {
            feed.addItem({
                title: subCat.name,
                id: `${siteUrl}/${district?.state?.slug || state?.slug}/more-products/${subCat.location_slug || subCat.slug}-${district?.slug || state?.slug}`,
                link: `${siteUrl}/${district?.state?.slug || state?.slug}/more-products/${subCat.location_slug || subCat.slug}-${district?.slug || state?.slug}`,
                description: subCat.meta_description?.slice(0,300) || "",
                date: new Date(subCat.updated|| Date.now()),

                enclosure: subCat.image_url ? {
                    url: `${subCat.image_url}`,  
                    type: getImageMimeType(subCat.image_url)
                } : undefined
            });
        });

        courseSpecializations.slice(0, 12).forEach((specialization) => {
            feed.addItem({
                title: specialization.name,
                id: `${siteUrl}/${district?.state?.slug || state?.slug}/more-courses/${specialization.location_slug || specialization.slug}-${district?.slug || state?.slug}`,
                link: `${siteUrl}/${district?.state?.slug || state?.slug}/more-courses/${specialization.location_slug || specialization.slug}-${district?.slug || state?.slug}`,
                description: specialization.meta_description?.slice(0,300) || "",
                date: new Date(specialization.updated || Date.now()),

                enclosure: specialization.image_url ? {
                    url: `${specialization.image_url}`,  
                    type: getImageMimeType(specialization.image_url)
                } : undefined
            });
        });

        feed.addItem({
            title: "Common Service Centers",
            id: `${siteUrl}/${district?.state?.slug || state?.slug}/csc/${district? `common-service-center-${district?.slug}`:""}`,
            link: `${siteUrl}/${district?.state?.slug || state?.slug}/csc/${district? `common-service-center-${district?.slug}`:""}`,
            description: `Common Service Centers near ${district?.name || state?.name}`,
            date: new Date(Date.now()),            
        });

        feed.addItem({
            title: "Post Offices",
            id: `${siteUrl}/${district?.state?.slug || state?.slug}/post-office/${district?.slug ||""}`,
            link: `${siteUrl}/${district?.state?.slug || state?.slug}/post-office/${district?.slug ||""}`,
            description: `Post Offices near ${district?.name || state?.name}`,
            date: new Date(Date.now()),            
        });

        feed.addItem({
            title: "Police Stations",
            id: `${siteUrl}/${district?.state?.slug || state?.slug}/police-station/${district?.slug ||""}`,
            link: `${siteUrl}/${district?.state?.slug || state?.slug}/police-station/${district?.slug ||""}`,
            description: `Police Stations near ${district?.name || state?.name}`,
            date: new Date(Date.now()),            
        });

        feed.addItem({
            title: "Banks",
            id: `${siteUrl}/${district?.state?.slug || state?.slug}/bank/${district?.slug ||""}`,
            link: `${siteUrl}/${district?.state?.slug || state?.slug}/bank/${district?.slug ||""}`,
            description: `Banks near ${district?.name || state?.name}`,
            date: new Date(Date.now()),            
        });

        feed.addItem({
            title: "Courts",
            id: `${siteUrl}/${district?.state?.slug || state?.slug}/court/${district?.slug ||""}`,
            link: `${siteUrl}/${district?.state?.slug || state?.slug}/court/${district?.slug ||""}`,
            description: `Courts near ${district?.name || state?.name}`,
            date: new Date(Date.now()),
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
    }

  res.setHeader('Content-Type', 'application/rss+xml');
  res.write(feed.rss2());
  res.end();
}
