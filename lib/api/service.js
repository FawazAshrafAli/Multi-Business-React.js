import apiClient from './axios';

export default {
  getServices(slug) {
    return apiClient.get(`/service_api/companies/${slug}/services/`);
  },

  getCategory(slug, categorySlug) {
    return apiClient.get(`/service_api/companies/${slug}/categories/${categorySlug}/`);
  },

  getSubCategory(slug, subCategorySlug) {
    return apiClient.get(`/service_api/companies/${slug}/sub_categories/${subCategorySlug}/`);
  },

  getSubCategories(slug, categorySlug = undefined, params = undefined) {
    const paramsList = [];

    if (categorySlug) {
      paramsList.push(`category=${categorySlug}`);
    }

    if (params) {
      paramsList.push(params);
    }

    const queryString = paramsList.join("&");

    const endpoint = queryString
      ? `/service_api/companies/${slug}/sub_categories/?${queryString}`
      : `/service_api/companies/${slug}/sub_categories/`;

    return apiClient.get(endpoint);
  },


  getDetails(slug) {
    return apiClient.get(`/service_api/companies/${slug}/details/`);
  },

  getDetailList(slug) {
    return apiClient.get(`/service_api/companies/${slug}/detail-list/`);
  },

  getSliderDetails(slug) {
    return apiClient.get(`/service_api/companies/${slug}/slider-details/`);
  },

  getServiceDetails(url) {
    return apiClient.get(url);
  },

  getDetail(slug, itemSlug) {
    return apiClient.get(`/service_api/companies/${slug}/details/${itemSlug}`);
  },

  getMultipages(slug) {
    return apiClient.get(`/service_api/companies/${slug}/multipages/`);
  },

  getServiceMultipages(stateSlug, params=undefined) {
    if (params) {
      return apiClient.get(`/location_api/states/${stateSlug}/service_multipages/?${params}`);
    } else {
      return apiClient.get(`/location_api/states/${stateSlug}/service_multipages/`);
    }
  },

  getMultipage(slug, itemSlug) {
    return apiClient.get(`/service_api/companies/${slug}/multipages/${itemSlug}`);
  },

  postEnquiry(data, config, slug) {    
    return apiClient.post(`/service_api/companies/${slug}/enquiries/`, data, config);
  },
}