import React from 'react'

const Message = ({message, messageClass}) => {    
  return (
    <>
        {message&&
        <div className={`text-center text-light py-2 ${messageClass&&messageClass}`}>
            <h6 className="p-0 m-0">{message}</h6>
        </div>
        }        
    </>
  )
}

export default Message