import apiClient from "./axios";

export default {

  async getDestinations(lat=undefined, lon=undefined) {
      if (lat && lon) {
        return apiClient.get(`/destination_api/destinations/?lat=${lat}&lon=${lon}`);
      }
      return apiClient.get(`/destination_api/destinations/`);
    },

  async getSliderDestinations(lat=undefined, lon=undefined) {
      if (lat && lon) {
        return apiClient.get(`/destination_api/slider-destinations/?lat=${lat}&lon=${lon}`);
      }
      return apiClient.get(`/destination_api/destinations/`);
    },
}