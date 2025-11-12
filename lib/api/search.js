import apiClient from "./axios";

export default {
    getResults(query) {
        return apiClient.get(`/search_api/results/?query=${query}`);
    },
}