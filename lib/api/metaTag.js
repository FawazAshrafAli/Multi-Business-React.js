import apiClient from './axios';

export default {
  getMetaTags(params) {
    if (params) {
      return apiClient.get(`/meta_tag_api/tags/?${params}`);  
    } else {
      return apiClient.get(`/meta_tag_api/tags`);
    }
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