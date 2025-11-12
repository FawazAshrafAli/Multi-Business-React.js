import apiClient from './axios';

export default {
  getCompanies() {
    return apiClient.get('/company_api/companies');
  },

  getMinimalCompanies(companyType = undefined, companiesLimit = undefined) {
    let url = "/company_api/minimal-companies";
    const params = [];

    if (companyType) params.push(`company_type=${encodeURIComponent(companyType)}`);
    if (companiesLimit) params.push(`companies_limit=${encodeURIComponent(companiesLimit)}`);

    if (params.length) url += `/?${params.join("&")}`;

    return apiClient.get(url);
  },

  getBaseCompanies() {
    return apiClient.get('/company_api/base-companies');
  },

  getBriefCompanies() {
    return apiClient.get('/company_api/brief-companies');
  },

  getFaqCompanies() {
    return apiClient.get('/company_api/faq-companies');
  },

  getCompanyTypes() {
    return apiClient.get('/company_api/company_types');
  },

  getFooterCompanyTypes(locationBased = undefined) {
    if (locationBased) {
      return apiClient.get(`/company_api/footer-company-types/?location_based=${locationBased}`);
    } else {
      return apiClient.get('/company_api/footer-company-types');
    }
  },

  getNavbarCompanyTypes() {
    return apiClient.get('/company_api/navbar-company-types');
  },

  getBriefCompanyTypes() {
    return apiClient.get('/company_api/brief-company-types');
  },


  getCompany(slug) {
    return apiClient.get(`/company_api/companies/${slug}`);
  },



  getInnerPageCompany(slug) {
    return apiClient.get(`/company_api/inner-companies/${slug}`);
  },

  getCompanyBlogs(url) {
    return apiClient.get(url);
  },

  getCompanyBlogArchives(slug) {
    return apiClient.get(`/company_api/companies/${slug}/archives`);
  },

  getCompanyAbout(slug) {
    return apiClient.get(`/company_api/companies/${slug}/about_us`);
  },

  postEnquiry(data, config, slug) {    
    return apiClient.post(`/company_api/companies/${slug}/contact_enquiries/`, data, config);
  },

  getProgramFilteredCourses(url) {
    return apiClient.get(url)
  },

  getTypeFilteredRegistrations(url) {
    return apiClient.get(url)
  },

  getClients(slug) {
    return apiClient.get(`/company_api/companies/${slug}/clients`);
  },

  getTestimonials(slug) {
    return apiClient.get(`/company_api/companies/${slug}/testimonials`);
  },

  getReviews(slug) {
    return apiClient.get(`/company_api/companies/${slug}/reviews`);
  },

  getBanners(slug) {
    return apiClient.get(`/company_api/companies/${slug}/banners`);
  },

  getRegistrationCompany() {
    return apiClient.get('/company_api/first_registration_company');
  },

  getContactUs(slug) {
    return apiClient.get(`/company_api/companies/${slug}/contact-us/`)
  },

} 