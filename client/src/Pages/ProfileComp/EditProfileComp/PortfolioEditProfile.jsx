import React from 'react'
import { useLocation, useParams } from 'react-router-dom';

const PortfolioEditProfile = () => {
     const {id} = useParams();
  return (
    <div>
      Portfolio : {id}
    </div>
  )
}

export default PortfolioEditProfile
