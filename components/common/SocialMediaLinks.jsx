import React from 'react'

const SocialMediaLinks = () => {
  return (
    <>
        <div className="col-md-12">
            <ul className="social-icons" style={{width:"100%"}} itemScope itemType="https://schema.org/Organization">
              <link itemProp="url" href="https://bzindia.in/" />
              <li><a itemProp="sameAs" href="https://www.facebook.com/BZindia/" title="Facebook"><i className="fa fa-facebook" aria-hidden="true"></i></a></li>
              <li><a itemProp="sameAs" href="https://twitter.com/Bzindia_in" title="Twitter"><i className="fa fa-twitter" aria-hidden="true"></i></a></li>
              <li><a itemProp="sameAs" href="https://www.instagram.com/bzindia/" title="Instagram"><i className="fa fa-instagram" aria-hidden="true"></i></a></li>
              <li><a itemProp="sameAs" href="https://www.linkedin.com/company/bzindia" title="LinkedIn"><i className="fa fa-linkedin" aria-hidden="true"></i></a></li>
              <li><a itemProp="sameAs" href="https://www.youtube.com/channel/UCObPeK-T-jvgyfed9ysaSdQ?sub_confirmation=1" title="YouTube"><i className="fa fa-youtube-play" aria-hidden="true"></i></a></li>
              <li><a itemProp="sameAs" href="https://in.pinterest.com/bzindia/" title="Pinterest"><i className="fa fa-pinterest-p" aria-hidden="true"></i></a></li>
              <li><a itemProp="sameAs" href="https://bzindia.tumblr.com/" title="Tumblr"><i className="fa fa-tumblr" aria-hidden="true"></i></a></li>
              <li><a itemProp="sameAs" href="#" title="Google Plus"><i className="fa fa-google-plus" aria-hidden="true"></i></a></li>
              <li><a itemProp="sameAs" href="https://www.slideshare.net/BZindia" title="SlideShare"><i className="fa fa-slideshare" aria-hidden="true"></i></a></li>
              <li><a itemProp="sameAs" href="https://www.reddit.com/user/bzindia-in/" title="Reddit"><i className="fa fa-reddit" aria-hidden="true"></i></a></li>	 
              <li><a itemProp="sameAs" href="https://www.flickr.com/photos/193921536@N03/" title="Flickr"><i className="fa fa-flickr" aria-hidden="true"></i></a></li>
              
            </ul>
          </div>
    </>
  )
}

export default SocialMediaLinks