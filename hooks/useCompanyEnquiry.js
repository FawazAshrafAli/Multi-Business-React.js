import { useState } from 'react';
import Cookies from 'js-cookie';
import course from '../lib/api/course';

const useEnquiryForm = (initialFormData, company, setMessage, setMessageClass) => {
    const [formData, setFormData] = useState(initialFormData || {});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const csrfToken = Cookies.get('csrftoken');

        try {
            const payload = {
                ...formData,
                
            };

            // Axios request wrapped in try/catch
            const response = await course.postEnquiry(
                payload,
                {
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                },
                company?.slug || ""
            );

            const { success, message } = response?.data || {};

            setMessageClass(success ? "bg-success" : "bg-danger");
            setMessage(message);

            if (success) setFormData({});

            // Always return boolean
            return success;

        } catch (err) {
            // Prevent AxiosError from escaping
            console.error("Submission failed:", err);

            const responseData = err?.response?.data;
            setMessageClass("bg-danger");

            if (responseData?.errors) console.error("Validation errors:", responseData.errors);

            setMessage(responseData?.message || "Something went wrong.");

            // Always return false on failure
            return false;
        } finally {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return {
        formData,
        handleChange,
        handleSubmit,
    };
};

export default useEnquiryForm;