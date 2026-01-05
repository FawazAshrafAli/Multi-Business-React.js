import React, { useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie';

import auth from '../lib/api/auth.js';
import Message from './common/Message.jsx';
import { useRouter } from 'next/router.js';
import AuthContext from './context/AuthContext.js';

const CustomerLogin = ({user}) => {
    const csrfToken = Cookies.get("csrftoken");
    const router = useRouter();
    const { refreshUser } = useContext(AuthContext); 

    const [isOtpValidated, setIsOtpValidated] = useState(false);
    const [otpErrorMsg, setOtpErrorMsg] = useState(null);
    const [getOtpFormData, setGetOtpFormData] = useState({});
    const [otpVerificationFormData, setOtpVerificationFormData] = useState({});

    const [message, setMessage] = useState();
    const [messageClass, setMessageClass] = useState();  
    
    useEffect(() => {
      if (user) {
        router.push('/cart');
      }

    }, [user]);

    const handleGetOtpFormChange = (e) => {
        setGetOtpFormData({
            ...getOtpFormData,
            [e.target.name] : e.target.value
        })

        setOtpVerificationFormData({
            ...otpVerificationFormData,
            [e.target.name] : e.target.value
        })
    }

    const handleOtpVerificationFormChange = (e) => {
        setOtpVerificationFormData({
            ...otpVerificationFormData,
            [e.target.name] : e.target.value
        })

    }

    const submitEmail = async (e) => {
      e.preventDefault();
        try {
            const response = await auth.getLoginOtp(
                getOtpFormData,
                {
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            )
            
        } catch (err) {
            console.error("Submission failed:", err);

            const responseData = err.response?.data;
            setMessageClass("bg-danger");

            if (responseData?.errors) {
                console.error("Validation details:", responseData.errors);
            }

            setMessage(responseData?.message || "Something went wrong.");
        }
    }

    const handleOtpVerification = async (e) => {
      e.preventDefault();
      let formData = { ...otpVerificationFormData };
      formData = {
        ...formData,
        otp: `${formData.digit_1}${formData.digit_2}${formData.digit_3}${formData.digit_4}${formData.digit_5}${formData.digit_6}`,
      };

      try {
        await auth.verifyLoginOtp(formData, {
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        const user = await refreshUser(); // calls getCurrentUser()

        if (user) {
          setIsOtpValidated(true);
          setMessage("Logged in successfully!");
          router.push('/cart'); // or wherever
        } else {
          setOtpErrorMsg("Failed to verify OTP. Try again.");
        }

      } catch (err) {
        console.error("OTP verification failed:", err.response?.data || err);
        setOtpErrorMsg(err.response?.data?.message || "Something went wrong.");
      }
    };




    useEffect(() => {
      const timeout = setTimeout(() => {
        import("../public/js/newScript.js");
      }, 300); 

      return () => clearTimeout(timeout);
    }, []);
  return (
    <>
        {message&&
        <Message message={message} messageClass={messageClass} />
        }
        <section id="bzAuth" aria-labelledby="bzAuthTitle">
  <div className="auth-wrap">
    <div className="auth-card">
      <h2 id="bzAuthTitle" className="auth-title">Sign in to your account</h2>
      <p className="auth-sub">Use your email to receive a one-time code, or continue with Google/Facebook.</p>

      {/* Social buttons */}
      <div className="auth-social">
        <button className="btn-social btn-google" type="button" id="btnGoogle">
          <svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 31.9 29.3 35 24 35c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.3 0 6.3 1.2 8.6 3.2l5.7-5.7C34.6 3 29.6 1 24 1 11.8 1 2 10.8 2 23s9.8 22 22 22c11 0 21-8 21-22 0-1.7-.2-3.4-.4-5.1z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.5 18.9 13 24 13c3.3 0 6.3 1.2 8.6 3.2l5.7-5.7C34.6 3 29.6 1 24 1 15.2 1 7.7 5.9 4.1 13l2.2 1.7z"/><path fill="#4CAF50" d="M24 45c5.2 0 10-1.9 13.7-5.1l-6.3-5.2C29.2 36.1 26.7 37 24 37c-5.2 0-9.7-3.3-11.3-7.9l-6.5 5C9.8 41.8 16.4 45 24 45z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.8-4.8 6.5-9.3 6.5-5.2 0-9.7-3.3-11.3-7.9l-6.5 5C10.4 38.9 16.7 43 24 43c11 0 21-8 21-22 0-1.7-.2-3.4-.4-5.1z"/></svg>
          Continue with Google
        </button>

        <button className="btn-social btn-fb" type="button" id="btnFacebook">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#1877F2" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.093 10.125 24v-8.437H7.078V12.07h3.047V9.412c0-3.007 1.792-4.668 4.533-4.668 1.313 0 2.686.235 2.686.235v2.953h-1.514c-1.49 0-1.954.927-1.954 1.88v2.258h3.328l-.532 3.493h-2.796V24C19.612 23.093 24 18.1 24 12.073z"/></svg>
          Continue with Facebook
        </button>
      </div>

      <div className="auth-divider"><span>or</span></div>

      {/* Email + OTP */}
      <form className="auth-form" method="post" id="otpForm" noValidate>
        {/* Step 1: Email */}
        <div className="step step-email" aria-live="polite">
          <label htmlFor="authEmail" className="label">Email address</label>
          <input id="authEmail" type="email" className="input" placeholder="you@example.com" name="email" value={getOtpFormData?.email || ""} onChange={(e) => handleGetOtpFormChange(e)} required />
          <small className="help">We’ll send a 6-digit code to this address.</small>

          <button className="btn-primary" type="button" id="btnGetOtp" onClick={(e) => submitEmail(e)}>Get OTP</button>
        </div>

        {/* Step 2: OTP */}
        <div className="step step-otp" hidden aria-live="polite">
          <p className="otp-text">
            Enter the 6-digit code sent to <strong id="otpEmailEcho"></strong>
          </p>

          <div className="otp-grid" role="group" aria-label="One-time passcode">
            <input inputMode="numeric" pattern="[0-9]*" maxLength="1" className="otp-cell" aria-label="Digit 1" name="digit_1" value={otpVerificationFormData?.digit_1 || ""} onInput={(e) => handleOtpVerificationFormChange(e)} />
            <input inputMode="numeric" pattern="[0-9]*" maxLength="1" className="otp-cell" aria-label="Digit 2" name="digit_2" value={otpVerificationFormData?.digit_2 || ""} onInput={(e) => handleOtpVerificationFormChange(e)} />
            <input inputMode="numeric" pattern="[0-9]*" maxLength="1" className="otp-cell" aria-label="Digit 3" name="digit_3" value={otpVerificationFormData?.digit_3 || ""} onInput={(e) => handleOtpVerificationFormChange(e)} />
            <input inputMode="numeric" pattern="[0-9]*" maxLength="1" className="otp-cell" aria-label="Digit 4" name="digit_4" value={otpVerificationFormData?.digit_4 || ""} onInput={(e) => handleOtpVerificationFormChange(e)} />
            <input inputMode="numeric" pattern="[0-9]*" maxLength="1" className="otp-cell" aria-label="Digit 5" name="digit_5" value={otpVerificationFormData?.digit_5 || ""} onInput={(e) => handleOtpVerificationFormChange(e)} />
            <input inputMode="numeric" pattern="[0-9]*" maxLength="1" className="otp-cell" aria-label="Digit 6" name="digit_6" value={otpVerificationFormData?.digit_6 || ""} onInput={(e) => handleOtpVerificationFormChange(e)} />
          </div>

          <div className="otp-actions">
            <button className="btn-primary" type="submit" onClick={(e) => handleOtpVerification(e)}>Verify & Continue</button>
            <button className="btn-link" type="button" id="btnResend" onClick={(e) => handleOtpVerification(e)} disabled>Resend code in <span id="resendTimer">30</span>s</button>
          </div>

          <button className="btn-link back" type="button" id="btnBack">← Change email</button>
          {isOtpValidated &&
          <div className="msg ok" id="otpDemoMsg" >Success! You are signed in.</div>
          }
          {otpErrorMsg && 
          <div className="msg err" id="otpErr">{otpErrorMsg}.</div>
          }
        </div>
      </form>
    </div>
  </div>
</section>
    </>
  )
}

export default CustomerLogin