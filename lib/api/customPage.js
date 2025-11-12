import apiClient from "./axios";

export default {
    getContactUs(slug) {
        return apiClient.get(`/custom_pages_api/contact_us/${slug}/`)
    },

    getPrivacyPolicy() {
        return apiClient.get(`/custom_pages_api/privacy_policy/`)
    },

    getTermsAndConditions() {
        return apiClient.get(`/custom_pages_api/terms_and_conditions/`)
    },

    getShippingAndDeliveryPolicy() {
        return apiClient.get(`/custom_pages_api/shipping-and-delivery-policy/`)
    },

    getCancellationAndRefundPolicy() {
        return apiClient.get(`/custom_pages_api/cancellation-and-refund-policy/`)
    },

    getFaq(slug) {
        return apiClient.get(`/custom_pages_api/faqs/${slug}/`)
    },

    getBzindiaFaqs() {
        return apiClient.get(`/custom_pages_api/bzindia_faqs/`)
    },

    getBzindiaContacts(slug) {
        return apiClient.get(`/custom_pages_api/bzindia_contacts/`)
    },
}