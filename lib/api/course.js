import apiClient from './axios';

export default {
  getCourses() {
    return apiClient.get('/course_api/courses/');
  },

  getCourse(slug) {
    return apiClient.get(`/course_api/courses/${slug}`);
  },

  getDetails(slug) {
    return apiClient.get(`/course_api/companies/${slug}/details/`);
  },

  getDetailList(slug) {
    return apiClient.get(`/course_api/companies/${slug}/detail-list/`);
  },

  getSliderDetails(slug) {
    return apiClient.get(`/course_api/companies/${slug}/slider-details/`);
  },

  getCourseDetails(url) {    
    return apiClient.get(url);
  },

  getDetail(slug, itemSlug) {
    return apiClient.get(`/course_api/companies/${slug}/details/${itemSlug}`);
  },

  getPrograms(slug) {
    return apiClient.get(`/course_api/companies/${slug}/programs/`);
  },

  getProgram(slug, programSlug) {
    return apiClient.get(`/course_api/companies/${slug}/programs/${programSlug}`);
  },

  getSpecializations(url) {    
    return apiClient.get(url);
  },

  getSpecialization(slug, specializationSlug) {
    return apiClient.get(`/course_api/companies/${slug}/specializations/${specializationSlug}`);
  },

  getCompany(slug) {
    return apiClient.get(`/course_api/companies/${slug}`);
  },

  getCompanyCourses(slug) {
    return apiClient.get(`/course_api/companies/${slug}/courses/`);
  },

  getPartners(slug) {
    return apiClient.get(`/course_api/corporate_partners/${slug}`);
  },

  getTestimonials(slug) {
    return apiClient.get(`/course_api/student_testimonials/${slug}`);
  },

  postEnquiry(data, config, slug) {    
    return apiClient.post(`/course_api/companies/${slug}/enquiries/`, data, config);
  },

  getCourseMultipages(stateSlug, params=undefined) {
    
    let endPoint = `/location_api/states/${stateSlug}/course_multipages/`;
    
    if (params) {
      endPoint += `?${params}`;
    }
    
    console.log(endPoint)
    return apiClient.get(endPoint);
  },

}