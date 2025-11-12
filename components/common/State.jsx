import React, { useEffect } from 'react'
import useNearestPlace from '../../hooks/useNearestPlace'
import ListingPage from './ListingPage';
import { useRouter } from 'next/router';


const State = ({blogs, metaTags, state, faqs, itemsType}) => {
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

        router.push(`/${nearestPlace?.state?.slug}`);        

    }, [nearestPlace]);
  return (
    <>
        <ListingPage
        blogs={blogs}
        metaTags={metaTags}        
        state={state}
        faqs={faqs}
        itemsType={itemsType}
        handleNearby={handleNearby}
        />
    </>
  )
}

export default State