import apiClient from "./axios";

export default {
    postEnquiry(data, config) {
        return apiClient.post('/contact_api/', data, config);
    },
}