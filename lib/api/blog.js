import apiClient from './axios';

export default {
  getBlogs(url) {
    return apiClient.get(url);
  },

  getBlogArchives() {
    return apiClient.get(`/blog_api/archives/`);
  },

  getBlog(slug) {
    return apiClient.get(`/blog_api/blogs/${slug}`);
  },
}
