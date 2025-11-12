import React from 'react'

const CopyRight = () => {
  return (
    <>
        <div className="col-md-12">
            <div className="copy-right-bx">
              <div className="copy-right-bx-cntnt">
                  <span className="ftr-spn-cpy-1">
                    &copy; {new Date().getFullYear()} BZIndia - Top Companies in India
                  </span>
              </div>
            </div>
        </div>
    </>
  )
}

export default CopyRight