import apiClient from './axios';

export default {
  async getHomeContent(retries = 1) {
    try {
      return await apiClient.get('/home_api/', { timeout: 10000 });
    } catch (err) {
      if (retries > 0) {
        console.warn('Retrying getHomeContent, attempts left:', retries);
        return await this.getHomeContent(retries - 1);
      } else {
        throw err;
      }
    }
  },
};
