import apiClient from "./axios";

export default {
    getNearbyCscCenters() {
        return apiClient.get(`/directory_api/nearby_csc_centers/`);
    },
    getCscRegistrations() {
        return apiClient.get(`/directory_api/csc_registrations/`);
    },

    getCsc(centerSlug) {
        return apiClient.get(`/directory_api/cscs/${centerSlug}`);
    }
}