// // lib/axiosInterceptor.js
// import apiClient from "./axios";

// export const setupInterceptors = () => {
//   apiClient.interceptors.response.use(
//     (response) => response,
//     (error) => {      
//       return Promise.reject(error);
//     }
//   );
// };


import apiClient from "./axios";

let isRefreshing = false;
let refreshPromise = null;

export const setupInterceptors = () => {
  apiClient.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;

      // If no response or not a 401, just reject
      if (!error.response) {
        return Promise.reject(error);
      }

      const status = error.response.status;

      // Only attempt refresh for 401 errors and not for refresh endpoint itself
      if (status === 401 && !originalRequest._retry && !originalRequest.url.includes("/auth_api/refresh")) {
        originalRequest._retry = true;

        try {
          // Ensure only one refresh call is active
          if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = apiClient.post("/auth_api/refresh/"); // cookies will be sent because withCredentials=true
          }

          // Wait for the refresh result
          await refreshPromise;

          // Refresh finished; reset flags
          isRefreshing = false;
          refreshPromise = null;

          // Retry original request
          return apiClient(originalRequest);

        } catch (refreshError) {
          // Refresh failed: clear flags, optionally trigger client-side logout
          isRefreshing = false;
          refreshPromise = null;

          // Optional: call your logout flow to clear client state
          // try { await auth.logout(); } catch (e) { /* ignore */ }

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};
