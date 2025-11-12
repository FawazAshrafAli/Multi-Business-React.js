import React, { useEffect, useState } from 'react'
import useEnquiryForm from '../../../hooks/useCompanyEnquiry';

import location from '../../../lib/api/location';
import course from '../../../lib/api/course';


const EducationPopUpForm = ({company, setMessage, setMessageClass, handleClose}) => {    
    const [states, setStates] = useState();
    const [statesLoading, setStatesLoading] = useState(false);
    const [statesError, setStatesError] = useState(null);

    const [courses, setCourses] = useState();
    const [coursesLoading, setCoursesLoading] = useState(false);
    const [coursesError, setCoursesError] = useState(null);  
    
    

    const {
        formData,
        handleChange,
        handleSubmit,        
    } = useEnquiryForm({}, company, setMessage, setMessageClass);    

    // States
    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await location.getStates();
                setStates(response.data);
            } catch (err) {
                setStatesError(err);
            } finally {
                setStatesLoading(false);
            }
        };

        fetchStates();
        
    }, []);

    // Courses
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await course.getCompanyCourses(company.slug);
                setCourses(response.data);
            } catch (err) {
                setCoursesError(err);
            } finally {
                setCoursesLoading(false);
            }
        };

        fetchCourses();
        
    }, [company]);

    if (statesError) {
        console.error(statesError);
    }
    
    if (coursesError) {
        console.error(coursesError);
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        

        let success = false;

        try {
            success = await handleSubmit(e);
        } catch (err) {
            // Fallback for unexpected errors
            console.error('Unexpected error:', err);
            setMessage('An unexpected error occurred.');
            setMessageClass('bg-danger');
        }

        handleClose();
    };
    
  return (
    <>        
        <form action="#" method="post" id="enquiry-form" onSubmit={handleFormSubmit}>
            <input type="text" name="name" placeholder="Your Name" value={formData?.name || ''} onChange={handleChange} required/><br/>
            <input type="tel" name="phone" placeholder="Phone Number" value={formData?.phone || ''} onChange={handleChange} pattern="^[^A-Za-z]*$" title="Phone number must not contain letters." required /><br/>
            <input type="email" name="email" placeholder="E-Mail Address" value={formData?.email || ''} onChange={handleChange} required/><br/>
            <select className="country" name="course" value={formData?.course || ''} onChange={handleChange} required>
                <option value="" disabled hidden>-- Select Course --</option>
                {coursesLoading? <option value="" disabled>Loading . . .</option> :
                courses&&courses.map((course) => <option key={course.slug} value={course.slug}>{course.name}</option>)
                }

            </select><br/>
            <select className="country" name="state" value={formData?.state || ''} onChange={handleChange} required>
                <option value="" disabled hidden>-- Select State --</option>
                {statesLoading? <option value="" disabled>Loading . . .</option> :
                states&&states.map((state) => <option key={state.slug} value={state.slug}>{state.name}</option>)
                }
            
            </select><br/>

            <div className="frm-btn-sctn">
                <div>
                    <button className="primary_button" role="button" type="submit">SUBMIT</button>
                </div>
            </div>
        </form>        
    </>
  )
}

export default EducationPopUpForm