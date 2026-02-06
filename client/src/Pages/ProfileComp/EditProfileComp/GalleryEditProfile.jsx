import React from 'react'
import { useLocation, useParams } from 'react-router-dom';

const GalleryEditProfile = () => {

     const {id} = useParams();

  return (
    <div>
      Gallery : {id}
    </div>
  )
}

export default GalleryEditProfile
