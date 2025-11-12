import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import useNearestPlace from '../hooks/useNearestPlace';
import ListingPage from './common/ListingPage';

const District = ({blogs, metaTags, district, faqs, itemsType}) => {
    const router = useRouter();
    const {nearestPlace, fetchNearestPlace} = useNearestPlace();

    const handleNearby = async () => {
        try {
            fetchNearestPlace();
        } catch (err) {
            console.error("Error in handling nearby function: ", err)
        }
    }

    useEffect(() => {
        if (!nearestPlace) return;

        router.push(`/${nearestPlace?.district?.slug}`);

    }, [nearestPlace]);

  return (
    <>
        <ListingPage
        blogs={blogs}
        metaTags={metaTags}        
        district={district}
        faqs={faqs}
        itemsType={itemsType}
        handleNearby={handleNearby}
        />
    </>
  )
}

export default District