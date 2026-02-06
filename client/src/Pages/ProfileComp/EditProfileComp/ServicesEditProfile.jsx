import React from 'react'
import { useLocation, useParams } from 'react-router-dom'

const ServicesEditProfile = () => {

    const {id} = useParams();
  return (
    <div>
      Services : {id}
    </div>
  )
}

export default ServicesEditProfile
