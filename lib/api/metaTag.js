import apiClient from './axios';

export default {
  getMetaTags(params) {
    let endPoint = "/meta_tag_api/tags/";

    if (params) {
      endPoint += `?${params}`
    }
    
    return apiClient.get(endPoint);
  },

  getMetaTag(metaTagSlug) {
    return apiClient.get(`/meta_tag_api/tags/${metaTagSlug}`);
  },

  getMetaTag(metaTagSlug) {
    return apiClient.get(`/meta_tag_api/tags/${metaTagSlug}`);
  },

  getMostMatchingCompany(metaTagSlug) {
    return apiClient.get(`/meta_tag_api/most-matching-company/${metaTagSlug}`);
  },

  getMatchingItems(url) {
    return apiClient.get(url);
  },
}