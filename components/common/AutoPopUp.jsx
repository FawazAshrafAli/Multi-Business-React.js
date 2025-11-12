import { useState, useEffect, useContext } from 'react';
import ProductPopUpForm from '../product/common/ProductPopUpForm';
import ServicePopUpForm from '../service/common/ServicePopUpForm';
import RegistrationPopUpForm from '../registration/common/RegistrationPopUpForm';
import EducationPopUpForm from '../education/common/EducationPopUpForm';
import TitleContext from '../context/TitleContext';

export default function AutoPopUp({currentCompany, setMessage, setMessageClass}) {
  const [isVisible, setIsVisible] = useState(false);

  const {title} = useContext(TitleContext);

  useEffect(() => {
    if (!sessionStorage.getItem('popupClosed')) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('popupClosed', 'true');
  };

  const styles = {
    autoPopup: {
        display: 'flex',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999999,
    },
    popupContent: {
        background: '#fff',
        padding: '20px',
        maxWidth: '500px',
        width: '90%',
        borderRadius: '10px',
        textAlign: 'center',
        position: 'relative',
    },
    popupClose: {
        position: 'absolute',
        top: '10px',
        right: '15px',
        fontSize: '24px',
        color: '#000',
        cursor: 'pointer',
    },
    };


  return (
    isVisible && (
      <div id="autoPopup" style={styles.autoPopup}>
        <div className="popup-content" style={styles.popupContent}>
          <span className="popup-close" style={styles.popupClose} onClick={handleClose}>
            &times;
          </span>
          <h3>
            📩
            <span className="title-rainbow">Get in Touch with Us Today</span>📩
          </h3>
          <h6>{title || currentCompany?.meta_title}</h6>          
          {currentCompany?.company_type === "Product" ?
          <ProductPopUpForm company={currentCompany} setMessage={setMessage} setMessageClass={setMessageClass} handleClose={handleClose}/>
          
          :currentCompany?.company_type === "Service" ?
          <ServicePopUpForm company={currentCompany} setMessage={setMessage} setMessageClass={setMessageClass} handleClose={handleClose}/>

          :currentCompany?.company_type === "Registration" ?
          <RegistrationPopUpForm company={currentCompany} setMessage={setMessage} setMessageClass={setMessageClass} handleClose={handleClose}/>

          :currentCompany?.company_type === "Education" ?
          <EducationPopUpForm company={currentCompany} setMessage={setMessage} setMessageClass={setMessageClass} handleClose={handleClose}/>

            : null
          }

        </div>
      </div>
    )
  );
}
