import apiClient from './axios';

export default {  
  
  getRegistrationSubTypes(slug) {
    return apiClient.get(`/registration_api/companies/${slug}/sub_types/`);
  },

  getRegistrations(slug) {
    return apiClient.get(`/registration_api/companies/${slug}/registrations/`);
  },

  getTypes(slug) {
    return apiClient.get(`/registration_api/companies/${slug}/types/`);
  },

  getType(slug, typeSlug) {
    return apiClient.get(`/registration_api/companies/${slug}/types/${typeSlug}`);
  },

  getSubTypes(slug, typeSlug=undefined, params=undefined) {
    let endPoint= `/registration_api/companies/${slug}/sub_types/`;

    const paramsList = [];

  if (typeSlug?.trim()) paramsList.push(`type=${typeSlug.trim()}`);
  if (params?.trim()) paramsList.push(params.trim());

  if (paramsList.length > 0) {
    endPoint += `?${paramsList.join('&')}`;
  }

    return apiClient.get(endPoint);
  },

  getSubType(slug, subTypeSlug) {
    return apiClient.get(`/registration_api/companies/${slug}/sub_types/${subTypeSlug}`);
  },

  getDetails(slug) {
    return apiClient.get(`/registration_api/companies/${slug}/details/`);
  },

  getDetailList(slug) {
    return apiClient.get(`/registration_api/companies/${slug}/detail-list/`);
  },

  getSliderDetails(slug) {
    return apiClient.get(`/registration_api/companies/${slug}/slider-details/`);
  },

  getRegistrationDetails(url) {
    return apiClient.get(url);
  },

  getDetail(slug, itemSlug) {
    return apiClient.get(`/registration_api/companies/${slug}/details/${itemSlug}`);
  },

  postEnquiry(data, config, slug) {    
    return apiClient.post(`/registration_api/companies/${slug}/enquiries/`, data, config);
  },

  getRegistrationMultipages(stateSlug, params=undefined) {
    if (params) {
      return apiClient.get(`/location_api/states/${stateSlug}/registration_multipages/?${params}`);
    } else {
      return apiClient.get(`/location_api/states/${stateSlug}/registration_multipages/`);
    }
  },  
}