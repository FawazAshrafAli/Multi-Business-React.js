import apiClient from './axios';

export default {
  getProducts(slug) {
    return apiClient.get(`/product_api/companies/${slug}/products`);
  },

  getProductDetails(slug, params) {
    let url = `/product_api/companies/${slug}/details/`;
    if (params) url += `?${params}`;
    return apiClient.get(url);
  },

  getProductDetailList(slug, params) {
    let url = `/product_api/companies/${slug}/detail-list/`;
    if (params) url += `?${params}`;
    return apiClient.get(url);
  },

  getSliderProductDetails(slug) {
    return apiClient.get(`/product_api/companies/${slug}/slider-details`);
  },

  getDetail(slug, itemSlug) {
      return apiClient.get(`/product_api/companies/${slug}/details/${itemSlug}`);
  },

  getProductCategories(slug) {
    return apiClient.get(`/product_api/companies/${slug}/categories`);
  },

  getHomeProductCategories(slug) {
    return apiClient.get(`/product_api/companies/${slug}/home-categories`);
  },

  getCategories(slug) {
    return apiClient.get(`/product_api/companies/${slug}/brief-categories`);
  },

  getCategory(slug, categorySlug) {
    return apiClient.get(`/product_api/companies/${slug}/categories/${categorySlug}`);
  },

  getSubCategories(slug, categorySlug=undefined, params = undefined) {
    const paramsList = [];

    if (categorySlug) {
      paramsList.push(`category=${categorySlug}`);
    }

    if (params) {
      paramsList.push(params);
    }

    const queryString = paramsList.join("&");

    return apiClient.get(
      `/product_api/companies/${slug}/sub_categories/${queryString ? "?" + queryString : ""}`
    );
  },


  getSubCategory(slug, subCategorySlug) {
    return apiClient.get(`/product_api/companies/${slug}/sub_categories/${subCategorySlug}`);
  },

  postEnquiry(data, config, slug) {    
    return apiClient.post(`/product_api/companies/${slug}/enquiries/`, data, config);
  },

  postReview(data, config, slug) {    
    return apiClient.post(`/product_api/companies/${slug}/reviews/`, data, config);
  },

  getProductMultipages(stateSlug, params=undefined) {
    if (params) {
      return apiClient.get(`/location_api/states/${stateSlug}/product_multipages/?${params}`);
    } else {
      return apiClient.get(`/location_api/states/${stateSlug}/product_multipages/`);
    }
  },
}