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

  addToCart(formData, config) {
    return apiClient.post('/product_api/cart/', formData, config);
  },

  getCartItems(userId) {
    return apiClient.get(`/product_api/cart/?user_id=${userId}`);
  },

  getCartSummary(username) {
    return apiClient.get(`/product_api/cart/summary/?user=${username}`);
  },

  removeFromCart(cartId) {
    return apiClient.delete(`/product_api/cart/${cartId}/`);
  },

  setCartItemQty(itemSlug, formData, config) {
    return apiClient.put(`/product_api/cart/${itemSlug}/`, formData, config);
  },
  
  addDeliveryAddress(formData, config) {    
    return apiClient.post('/product_api/address/', formData, config);
  },

  getDeliveryAddresses(userId) {
    return apiClient.get(`/product_api/address/?user_id=${userId}`);
  },

  removeDeliveryAddress(addressSlug) {
    return apiClient.delete(`/product_api/address/${addressSlug}/`);
  },

  setDefaultAddress(addressSlug, config) {
    return apiClient.put(`/product_api/address/${addressSlug}/`, config);
  },

  placeOrderAndPay(formData, config) {
    return apiClient.post(`/product_api/order/`, formData, config); 
  },

  getRecentOrder() {
    return apiClient.get(`/product_api/order/recent`); 
  },

  getOrders(url) {    
    return apiClient.get(url); 
  },

  getOrder(slug) {    
    return apiClient.get(`/product_api/order/${slug}`); 
  },

  downloadInvoice(slug) {    
    return apiClient.get(`/product_api/order/${slug}/download_invoice`, {
      responseType: "blob",
      withCredentials: true
    }); 
  },
}