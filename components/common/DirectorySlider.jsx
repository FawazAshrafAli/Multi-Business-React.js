import React from 'react'
import Slider from 'react-slick'
import { nearbyGovtOffSettings } from '/public/w3/js/slider'
import Link from 'next/link'

const DirectorySlider = () => {
  return (
    <>
      <section>
        <div className="container">
<div className="row" style={{margin:"50px 0 50px 0"}} >
      <div className="offerd-service-section" style={{marginBottom:"0"}}>
        <h3>FIND NEARBY</h3>
         <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
        <div className="nearby_govt_off">

          <Slider {...nearbyGovtOffSettings}>
        
            <div className="services-block-two">
        <div className="inner-box">
  <div className="nearby_img">
          <img src="/images/Nearby-Police-Stations.jpeg" alt="Find Nearby Police Station"loading="lazy" />
            </div>
  <h3 className="nearby_head"><a href="DDDDDD">Nearby Police Station</a>
  <a href="DDDDDD" className="simple_menu_stle" title="Find Nearby Police Station"><i className="fa fa-crosshairs" aria-hidden="true"></i> Find Nearby</a></h3>
            </div>
            </div>
                      
                      
            <div className="services-block-two">
        <div className="inner-box">
  <div className="nearby_img">
          <img src="/images/nearby-post-office.jpeg" alt="Find Nearby Post Office" loading="lazy" />
            </div>
  <h3 className="nearby_head"><a href="DDDDDD">Nearby Post Office & Pincode</a>
  <a href="DDDDDD" className="simple_menu_stle" title="Find Nearby Post Office"><i className="fa fa-crosshairs" aria-hidden="true"></i> Find Nearby</a></h3>
            </div>
            </div>
                      
                      
            <div className="services-block-two">
        <div className="inner-box">
  <div className="nearby_img">
          <img src="/images/Nearby-Courts.jpeg" alt="Find Nearby Judicial Courts"loading="lazy" />
            </div>
  <h3 className="nearby_head"><a href="DDDDDD">Nearby Judicial Courts</a>
  <a href="DDDDDD" className="simple_menu_stle" title="Find Nearby Judicial Courts"><i className="fa fa-crosshairs" aria-hidden="true"></i> Find Nearby</a></h3>
            </div>
            </div>
                      
                      
            <div className="services-block-two">
        <div className="inner-box">
          <div className="nearby_img">
          <img src="/images/Nearby-CSC-Centers.jpeg" alt="Find Nearby CSC Centers"loading="lazy" />
            </div>
  <h3 className="nearby_head"><Link href="/csc_centers" >Nearby CSC Centers</Link>
  <Link href="/csc_centers"  className="simple_menu_stle" title="Find Nearby CSC Centers"><i className="fa fa-crosshairs" aria-hidden="true"></i> Find Nearby</Link></h3>
            </div>
            </div>
                      
                      
              <div className="services-block-two">
        <div className="inner-box">
        <div className="nearby_img">
          <img src="/images/Nearby-Bank-and-ifsc.jpeg" alt="Find Nearby Police Station" loading="lazy" />
            </div>
    <h3 className="nearby_head"><a href="DDDDDD">Nearby Bank &amp; IFSC</a>
  <a href="DDDDDD" className="simple_menu_stle" title="Find Nearby Police Station"><i className="fa fa-crosshairs" aria-hidden="true"></i> Find Nearby</a></h3>
            </div>
            </div>
          </Slider>
                    
                    
           
        </div>
      </div>
      
      <a href="#" className="primary_button" style={{margin: "0 auto"}}>FIND MORE</a>
          </div>
    </div>
    </section>
    </>
  )
}

export default DirectorySlider