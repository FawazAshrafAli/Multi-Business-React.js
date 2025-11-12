import React from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Link from 'next/link';
import slugify from 'slugify';

const TagCloud = ({metaTags}) => {
  return (
    <>
        <h3>Tags Cloud</h3>
        <p className="flip"><span className="deg1"></span><span className="deg2"></span><span className="deg3"></span></p>
        <div className="row">
            <div className="col-md-12 col-sm-12 col-xs-12">
                <div className="tags_cloud">
                    {metaTags?.filter(item => !item.name?.includes("place_name"))?.map((tag, index) => <Link href={`/tag/${slugify(tag.slug || "", { lower: true, strict: true })}`}  title={tag.name} key={tag.slug ||index+1}>{tag.name}</Link>) || []}
                </div>
            </div>
        </div>
    </>
  )
}

export default TagCloud