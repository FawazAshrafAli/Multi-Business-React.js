import React from 'react'

import Spinner from 'react-bootstrap/Spinner';

const Loading = () => {
  return (
    <>
        <div className='d-flex justify-content-center'>
            {/* <h3 className='text-center'>Loading . . .</h3>         */}
            <Spinner animation="grow" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>        
    </>
  )
}

export default Loading