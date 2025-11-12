// Your GA4 Measurement ID from Google Analytics
export const GA_TRACKING_ID = 'G-DFRJ2F85E7';

/**
 * Log a pageview — called on each Next.js route change.
 * @param {string} url - The path of the page (e.g., /about, /products/item-1)
 */
export const pageview = (url) => {
  if (typeof window.gtag !== 'function') return; // Prevents errors during SSR
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

/**
 * Log a custom event.
 * @param {object} param0
 * @param {string} param0.action - Event name (e.g., 'signup', 'purchase')
 * @param {object} param0.params - Extra event parameters
 */
export const event = ({ action, params }) => {
  if (typeof window.gtag !== 'function') return; // Prevents errors during SSR
  window.gtag('event', action, params);
};
