import apiClient from './axios';

export default {
    getHomeContent() {
        return apiClient.get('/home_api/');
    },
}